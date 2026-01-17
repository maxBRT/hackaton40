import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { QuizProvider, useActions, useQuiz } from "react-quiz-kit";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import api from "@/utils/axiosRequestInterceptor"
import { handleApiError } from "@/utils/handleApiError"

type ApiResponse<T> = {
    success: boolean
    data: T
}

type Lesson = {
    id: string
    title: string
    content: string
    moduleId: string
    position: number
    difficulty: string
    createdAt: string
    updatedAt: string
}

type QuizQuestion = {
    id: number
    question: string
    answers: string[]
    correctAnswer?: number
}

type Quiz = {
    id: string
    title: string
    description: string
    lessonId: string
    status: boolean
    questions: QuizQuestion[]
}

export default function LessonPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [lesson, setLesson] = useState<Lesson | null>(null)
    const [quiz, setQuiz] = useState<Quiz | null>(null)

    const [answers, setAnswers] = useState<Record<string, number>>({})

    useEffect(() => {
        const fetchdata = async () => {
            setLoading(true)
            try {
                const response = await api.get<ApiResponse<Lesson>>(`/lessons/${id}`)
                const responseData = response.data
                setLesson(responseData.data)
            } catch (error) {
                handleApiError(error, setError)

            } finally {
                setLoading(false)
            }
            setLoading(true)
            try {
                const response = await api.get<ApiResponse<Quiz>>(`/quiz/lessons/${id}`)
                const responseData = response.data
                setQuiz(responseData.data)
            } catch (error) {
                handleApiError(error, setError)

            } finally {
                setLoading(false)
            }
        } 
        fetchdata()
    }, [id])

    const markCompleted = async () => {
        try {
            await api.post(`/lessons/${id}/complete`, null)
        } catch (e) {
            handleApiError(e,setError)
        }
    }

    if (loading) {
        return <div className="p-6 text-sm text-muted-foreground">Chargement...</div>
    }

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

    const questions = quiz?.questions ?? []

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

            <Separator className="my-6" />

            {/* Contenu leçon */}
            <Card>
                <CardHeader>
                    <CardTitle>Contenu</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="whitespace-pre-wrap text-sm leading-6">
                        {lesson?.content ?? "Aucun contenu pour cette leçon."}
                    </div>
                </CardContent>
            </Card>

            <QuizProvider>

            </QuizProvider>

        </div>
    )
}
