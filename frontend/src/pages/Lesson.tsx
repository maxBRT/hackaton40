import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QuizComponent } from "@/components/quiz"
import { Separator } from "@/components/ui/separator"
import api from "@/utils/axiosRequestInterceptor"
import { handleApiError } from "@/utils/handleApiError"
import type { Lesson, Quiz } from "@/types/Quiz";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, BookOpen, Loader2, FileText, GraduationCap } from "lucide-react"

type ApiResponse<T> = {
    success: boolean
    data: T
}

function LessonPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const [lesson, setLesson] = useState<Lesson | null>(null)
    const [quiz, setQuiz] = useState<Quiz | null>(null)

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const [lessonRes, quizRes] = await Promise.allSettled([
                    api.get<ApiResponse<Lesson>>(`/lessons/${id}`),
                    api.get<ApiResponse<Quiz>>(`/quiz/lessons/${id}`)
                ]);

                if (lessonRes.status === 'fulfilled') {
                    setLesson(lessonRes.value.data.data);
                } else {
                    handleApiError(lessonRes.reason, setError);
                }

                if (quizRes.status === 'fulfilled') {
                    setQuiz(quizRes.value.data.data);
                }
            } catch (error) {
                console.error(error)
                handleApiError(error, setError)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData();
    }, [id])

    if (isLoading) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Chargement de la leçon...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <Card className="border-destructive/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                            <span>Erreur</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">{error}</p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Retour
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-6 w-6 text-primary" />
                        <h1 className="text-3xl font-bold tracking-tight">{lesson?.title ?? "Leçon"}</h1>
                    </div>
                    <p className="text-muted-foreground">Lecture de la leçon</p>
                </div>
                <Button variant="ghost" onClick={() => navigate(-1)} className="self-start sm:self-auto">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour
                </Button>
            </div>

            <Separator />

            {/* Contenu leçon */}
            <Card className="shadow-md border-none bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Contenu de la leçon
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-foreground leading-relaxed">
                        <ReactMarkdown
                            components={{
                                h1: ({ ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4 border-b pb-2" {...props} />,
                                p: ({ ...props }) => <p className="mb-4 last:mb-0" {...props} />,
                                code: ({ ...props }) => <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-sm" {...props} />,
                                a: ({ ...props }) => <a className="text-primary underline underline-offset-4 hover:text-primary/80" {...props} />,
                            }}
                        >
                            {lesson?.content ?? "Aucun contenu pour cette leçon."}
                        </ReactMarkdown>
                    </div>
                </CardContent>
            </Card>

            {quiz && (
                <div className="pt-8 w-full">
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                            <GraduationCap className="h-6 w-6 text-primary" />
                            <span>Vérification des connaissances</span>
                        </h2>
                        <p className="text-muted-foreground mt-1">Répondez à ces questions pour valider vos acquis.</p>
                    </div>
                    <QuizComponent title={quiz.title} questions={quiz.questions} />
                </div>
            )}
        </div>
    )
}

export default LessonPage
