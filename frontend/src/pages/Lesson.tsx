import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {QuizComponent} from "@/components/quiz"
import { Separator } from "@/components/ui/separator"
import api from "@/utils/axiosRequestInterceptor"
import { handleApiError } from "@/utils/handleApiError"
import type { Lesson, Quiz } from "@/types/Quiz";
import ReactMarkdown from "react-markdown";

type ApiResponse<T> = {
    success: boolean
    data: T
}

function LessonPage() {
    const {id} = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null)

    const [lesson, setLesson] = useState<Lesson | null>(null)
    const [quiz, setQuiz] = useState<Quiz | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get<ApiResponse<Lesson>>(`/lessons/${id}`)
                console.log(response)
                const responseData = response.data
                setLesson(responseData.data)
            } catch (error) {
                console.log(error)
                handleApiError(error, setError)
            }
            try {
                const response = await api.get<ApiResponse<Quiz>>(`/quiz/lessons/${id}`)
                console.log(response)
                const responseData = response.data
                const quiz = responseData.data
                setQuiz(quiz)
            } catch (error) {
                console.log(error)
                handleApiError(error, setError)
            }
        }
        fetchData();
    }, [id])

    if (error) {
        return (
            <div className="p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Erreur</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-destructive">{error}</CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">{lesson?.title ?? "Leçon"}</h1>
                    <p className="mt-1 text-muted-foreground">Lecture de la leçon</p>
                </div>
                <Button variant="outline" onClick={() => navigate(-1)}>
                    Retour
                </Button>
            </div>

            <Separator className="my-6"/>

            {/* Contenu leçon */}
            <Card>
                <CardHeader>
                    <CardTitle>Contenu</CardTitle>
                </CardHeader>
                <CardContent>
                    <ReactMarkdown>
                        {lesson?.content ?? "Aucun contenu pour cette leçon."}
                    </ReactMarkdown>
                </CardContent>
            </Card>

            {quiz && (
                <QuizComponent title={quiz.title} questions={quiz.questions} />
            )}

        </div>
    )
}

export default LessonPage
