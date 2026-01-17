import React, { useState } from 'react';
import type {QuizQuestion} from "@/types/Quiz";

type QuizProps = {
    title: string;
    questions: QuizQuestion[];
}


export const QuizComponent: React.FC<QuizProps> = ({ title, questions }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    console.log(selectedAnswer);
    if (!questions?.length) {
        return <div>No questions available</div>;
    }
    const currentQuestion = questions[currentQuestionIndex];

    const handleOptionClick = (index: number) => {
        if (isAnswered) return;
        setSelectedAnswer(index);
        setIsAnswered(true);

        if (index === currentQuestion.correctAnswer) {
            setScore(score + 1);
        }
    };

    const handleNextBtn = () => {
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < questions.length) {
            setCurrentQuestionIndex(nextIndex);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            setShowResult(true);
        }
    };

    const restartQuiz = () => {
        setScore(0);
        setCurrentQuestionIndex(0);
        setShowResult(false);
        setSelectedAnswer(null);
        setIsAnswered(false);
    };


    if (showResult) {
        return (
            <div className="max-w-xl mx-auto p-6 text-center space-y-4">
                <h2 className="text-2xl font-semibold">
                    Quiz Completed! 🎉
                </h2>

                <p className="text-lg">
                    You scored{" "}
                    <strong className="font-semibold">{score}</strong> out of{" "}
                    <strong className="font-semibold">{questions.length}</strong>
                </p>

                <button
                    onClick={restartQuiz}
                    className="mt-4 px-6 py-2 rounded-md border border-accent hover:bg-muted transition"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-6 space-y-6">
            <h2 className="text-2xl font-semibold text-center">
                {title}
            </h2>

            <div className="text-sm text-gray-500 text-center">
                Question {currentQuestionIndex + 1} / {questions.length}
            </div>

            <h3 className="text-xl font-medium">
                {currentQuestion.question}
            </h3>

            <div className="space-y-3">
                {currentQuestion.answers.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleOptionClick(index)}
                        disabled={isAnswered}
                        className="w-full px-4 py-2 text-left rounded-md border border-accent hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {option}
                    </button>
                ))}
            </div>

            {isAnswered && (
                <div className="pt-4">
                    <button
                        onClick={handleNextBtn}
                        className="w-full px-4 py-2 rounded-md border border-accent hover:bg-muted transition"
                    >
                        {currentQuestionIndex === questions.length - 1
                            ? "Finish Quiz"
                            : "Next Question"}
                    </button>
                </div>
            )}
        </div>
    );
}