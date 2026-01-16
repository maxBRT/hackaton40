import { useNavigate, Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "@/utils/axiosRequestInterceptor.ts";
import type {ForumPost, ForumThread, ForumThreadDetailsResponse} from "@/types/Forum";
import type {MePayload, MeResponse} from "@/types/User.ts";
import {handleApiError} from "@/utils/handleApiError.ts";
import {Item, ItemContent, ItemHeader, ItemTitle} from "@/components/ui/item.tsx";
import UserAvatar from "@/components/user/user-avatar.tsx";
import {Spinner} from "@/components/ui/spinner.tsx";
import {ArrowLeftIcon, MessageSquareIcon, SendIcon, Trash2Icon} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";

interface PostParams extends Record<string, string | undefined> {
    id: string;
}

export default function ForumThreadDetails() {
    
    const { id } = useParams<PostParams>()
    const navigate = useNavigate();
    const [thread, setThread] = useState<ForumThread | null>(null);
    const [me, setMe] = useState<MePayload | null>(null);
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const [title, setTitle] = useState("");
    const [replyContent, setReplyContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [detailsResponse, meResponse] = await Promise.all([
                    api.get<ForumThreadDetailsResponse>(`/forum-threads/${id}/posts`),
                    api.get<MeResponse>('/auth/me')
                ]);

                const responseData = detailsResponse.data
                setThread(responseData.data.thread);
                setPosts(responseData.data.posts);
                setMe(meResponse.data.data);
            } catch (e) {
                handleApiError(e, setError)
            }finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id]);

    const formatTimestamp = (dateString: Date) => {
        const now = Date.now();
        const created = new Date(dateString).getTime();
        const diffMs = now - created;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return new Date(dateString).toLocaleDateString();
    };

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        setSubmitting(true);
        try {
            const response = await api.post(`/forum-threads/${id}/posts`, {
                title: title,
                content: replyContent,
            });
            
            if (response.data.success) {
                const updatedResponse = await api.get<ForumThreadDetailsResponse>(`/forum-threads/${id}/posts`);
                setPosts(updatedResponse.data.data.posts);
                setReplyContent("");
                setTitle("");
            }
        } catch (e) {
            handleApiError(e, setError);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteThread = async () => {
        if (!window.confirm("Are you sure you want to delete this thread?")) return;
        try {
            await api.delete(`/forum-threads/${id}`);
            navigate("/forum");
        } catch (e) {
            handleApiError(e, setError);
        }
    };

    const handleDeletePost = async (postId: string) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await api.delete(`/forum-threads/posts/${postId}`);
            const updatedResponse = await api.get<ForumThreadDetailsResponse>(`/forum-threads/${id}/posts`);
            setPosts(updatedResponse.data.data.posts);
        } catch (e) {
            handleApiError(e, setError);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-10"><Spinner /></div>;
    }

    if (error || !thread) {
        return (
            <div className="container max-w-4xl py-6">
                <Button variant="ghost" asChild className="mb-4">
                    <Link to="/forum">
                        <ArrowLeftIcon className="mr-2 h-4 w-4" />
                        Back to Forum
                    </Link>
                </Button>
                <div className="text-red-500 bg-red-50 p-4 rounded-md border border-red-200">
                    {error || "Thread not found"}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-7xl py-6 px-4 sm:px-6">
            <Button variant="ghost" asChild className="mb-6 -ml-2 text-muted-foreground hover:text-foreground">
                <Link to="/forum">
                    <ArrowLeftIcon className="mr-2 h-4 w-4" />
                    Back to Forum
                </Link>
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <article className="space-y-6">
                        <Item variant={"outline"} className="w-full overflow-hidden border-2">
                            <ItemHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-3">
                                            <UserAvatar userId={thread.userId}/>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-sm">
                                                    {thread.user ? thread.user.username : <Spinner className="inline ml-1" />}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatTimestamp(thread.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                        {me && me.userId === thread.userId && (
                                            <Button variant="ghost" size="icon" className="text-destructive mx-2 hover:text-destructive/90" onClick={handleDeleteThread}>
                                                <Trash2Icon className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                    {thread.course && (
                                        <Badge variant="secondary" className="font-normal">
                                            {thread.course.title}
                                        </Badge>
                                    )}
                                </div>
                            </ItemHeader>

                            <ItemContent className="pt-6 pb-6 space-y-4">
                                <ItemTitle className="text-2xl font-bold tracking-tight leading-tight">
                                    {thread.title}
                                </ItemTitle>
                                <div className="text-base text-foreground/90 whitespace-pre-wrap leading-relaxed">
                                    {thread.content}
                                </div>
                            </ItemContent>
                        </Item>

                        <div className="pt-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <MessageSquareIcon className="h-5 w-5" />
                                    Replies
                                    <span className="text-sm font-normal text-muted-foreground ml-1">
                                        ({posts.length})
                                    </span>
                                </h2>
                            </div>
                            
                            <Separator />

                            <div className="space-y-4 pt-2">
                                {posts.length === 0 ? (
                                    <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
                                        <p className="text-muted-foreground text-sm">Aucune réponse pour le moment. Soyez le premier à répondre!</p>
                                    </div>
                                ) : (
                                    posts.map((post: ForumPost) => (
                                        <Item
                                            key={post.id}
                                            variant={"outline"}
                                            className="w-full transition-colors hover:border-primary/20"
                                        >
                                            <ItemHeader className="pb-3 border-b">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <UserAvatar userId={post.userId}/>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-sm">
                                                                {post.user ? post.user.username : <Spinner className="inline ml-1" />}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {formatTimestamp(post.createdAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {me && me.userId === post.userId && (
                                                        <Button variant="ghost" size="icon" className="text-destructive mx-2 hover:text-destructive/90" onClick={() => handleDeletePost(post.id)}>
                                                            <Trash2Icon className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </ItemHeader>

                                            <ItemContent className="pt-4 pb-4">
                                                {post.title && post.title !== thread.title && (
                                                    <h3 className="font-semibold text-md mb-2">{post.title}</h3>
                                                )}
                                                <p className="text-sm text-foreground/80 leading-relaxed">
                                                    {post.content}
                                                </p>
                                            </ItemContent>
                                        </Item>
                                    ))
                                )}
                            </div>
                        </div>
                    </article>
                </div>

                <aside className="space-y-6">
                    <Card className="sticky top-6">
                        <CardHeader>
                            <CardTitle className="text-lg">Vous avez la reponse?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleReplySubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Titre</Label>
                                   <Input 
                                    type="text" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Titre de la question" 
                                    className="w-full p-2 border rounded-md"
                                    required
                                    />
                                    <Label htmlFor="content">Votre Réponse</Label>
                                    <Textarea 
                                        id="content"
                                        placeholder="Tu a surement oublié le point virgule..."
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        className="min-h-40 resize-none"
                                        required
                                    />
                                </div>
                                <Button 
                                    type="submit" 
                                    className="w-full" 
                                    disabled={submitting || !replyContent.trim()}
                                >
                                    {submitting ? (
                                        <Spinner className="mr-2" />
                                    ) : (
                                        <SendIcon className="mr-2 h-4 w-4" />
                                    )}
                                    Post Reply
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    )
}