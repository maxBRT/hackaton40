export type Lesson = {
    id: string
    title: string
    content: string
    moduleId: string
    position: number
    difficulty: string
    createdAt: string
    updatedAt: string
}

export type QuizQuestion = {
    id: number
    question: string
    answers: string[]
    correctAnswer?: number
}

export type Quiz = {
    id: string
    title: string
    description: string
    lessonId: string
    status: boolean
    questions: QuizQuestion[]
}
