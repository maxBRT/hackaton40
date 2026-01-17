import React, { useState } from 'react';
import type {QuizQuestion} from "@/types/Quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'

type QuizProps = {
    title: string;
    questions: QuizQuestion[];
}


export const QuizComponent: React.FC<QuizProps> = ({ title, questions }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [makeItRain, setMakeItRain] = useState(false);
    const [isAnswered, setIsAnswered] = useState(false);
    const { width, height } = useWindowSize(); 
    
    if (!questions?.length) {
        return <div className="text-center p-6 text-muted-foreground">Aucune question disponible</div>;
    }
    const currentQuestion = questions[currentQuestionIndex];
    const progressValue = ((currentQuestionIndex + 1) / questions.length) * 100;

    const handleOptionClick = (index: number) => {
        if (isAnswered) return;
        setSelectedAnswer(index);
        setIsAnswered(true);

        if (index === currentQuestion.correctAnswer) {
            setScore(score + 1);
        }

        if (currentQuestionIndex === questions.length - 1) {
            setMakeItRain(true);
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
        setMakeItRain(false);
    };
    

    return (
        <>
            {makeItRain && (
                <Confetti
                    width={width}
                    height={height * 2}
                    gravity={0.3}
                    numberOfPieces={400}
                />
            )}
            {showResult ? (
                <Card className="max-w-xl mx-auto shadow-lg border-2">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold text-primary">
                            Quiz terminé ! 🎉
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-6">
                        <div className="py-4">
                            <p className="text-xl">
                                Votre score :{" "}
                                <span className="text-3xl font-bold text-primary">{score}</span> / {questions.length}
                            </p>
                            <p className="text-muted-foreground mt-2">
                                {score === questions.length ? "Parfait ! Vous maîtrisez le sujet." : score >= questions.length / 2 ? "Bien joué ! Continuez ainsi." : "Vous pouvez faire mieux, réessayez !"}
                            </p>
                        </div>

                        <Button
                            onClick={restartQuiz}
                            size="lg"
                            className="rounded-full px-8"
                        >
                            Recommencer
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Card className="max-w-xl mx-auto shadow-lg border-2">
                    <CardHeader>
                        <div className="flex justify-between items-end mb-2">
                            <CardTitle className="text-2xl font-bold text-primary">
                                {title}
                            </CardTitle>
                            <span className="text-sm font-medium text-muted-foreground">
                                Question {currentQuestionIndex + 1} sur {questions.length}
                            </span>
                        </div>
                        <Progress value={progressValue} className="h-2" />
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <h3 className="text-xl font-semibold leading-tight">
                            {currentQuestion.question}
                        </h3>

                        <div className="grid gap-3">
                            {currentQuestion.answers.map((option, index) => {
                                const isCorrect = index === currentQuestion.correctAnswer;
                                const isSelected = index === selectedAnswer;
                                
                                let buttonClass = "w-full px-5 py-4 text-left rounded-xl border-2 transition-all duration-200 h-auto font-normal ";
                                
                                if (!isAnswered) {
                                    buttonClass += "border-border hover:border-primary hover:bg-accent cursor-pointer";
                                } else {
                                    if (isCorrect) {
                                        buttonClass += "border-green-500 bg-green-50 text-green-700 font-medium ring-2 ring-green-200";
                                    } else if (isSelected) {
                                        buttonClass += "border-red-500 bg-red-50 text-red-700 ring-2 ring-red-200";
                                    } else {
                                        buttonClass += "border-border opacity-50";
                                    }
                                }

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleOptionClick(index)}
                                        disabled={isAnswered}
                                        className={buttonClass}
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="flex-1">{option}</span>
                                            {isAnswered && isCorrect && (
                                                <svg className="w-6 h-6 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                            {isAnswered && isSelected && !isCorrect && (
                                                <svg className="w-6 h-6 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {isAnswered && (
                            <div className="pt-4 flex justify-end">
                                <Button
                                    onClick={handleNextBtn}
                                    size="lg"
                                    className="rounded-full px-8 flex items-center gap-2"
                                >
                                    {currentQuestionIndex === questions.length - 1
                                        ? "Terminer le quiz"
                                        : "Question suivante"}
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </>
    );
}