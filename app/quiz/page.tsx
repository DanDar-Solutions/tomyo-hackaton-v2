"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Notification
import questionsData from "../../question.json";
import { saveQuizResults } from "@/core/auth-action"; // Added action!

export default function QuizPage() {
    const router = useRouter();
    const quizData = questionsData.onboarding;
    const questions = quizData.questions;
    const totalQuizzes = questions.length;
    
    const [currentQuiz, setCurrentQuiz] = useState(1);
    const [completed, setCompleted] = useState(false);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const question = questions[currentQuiz - 1];

    const handleAnswer = (val: string) => {
        setAnswers(prev => ({ ...prev, [question.id]: val }));
    };

    const handleNext = async () => {
        if (!answers[question.id]) {
            toast.error("Required Field", { description: "Please provide an answer before continuing to the next module." });
            return;
        }

        if (currentQuiz < totalQuizzes) {
            setCurrentQuiz(prev => prev + 1);
        } else {
            setIsSubmitting(true);
            toast.loading("Saving your profile results...");
            
            const res = await saveQuizResults(answers);
            toast.dismiss();
            
            if (res.error) {
                toast.error("Save Failed", { description: res.error });
                setIsSubmitting(false);
            } else {
                setCompleted(true);
                toast.success("Incredible job!", {
                    description: "You have completed your entire onboarding module.",
                    position: "top-right"
                });
            }
        }
    };

    const progressPercentage = ((currentQuiz - 1) / totalQuizzes) * 100;

    if (completed) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
                <Card className="w-full max-w-md text-center border-green-500/20 shadow-lg shadow-green-500/10">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-green-500">Congratulations! 🎉</CardTitle>
                        <CardDescription className="text-lg">Your profile has been fully updated.</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center pb-8">
                        <Button size="lg" onClick={() => router.push('/dashboard')}>
                            Return to Dashboard
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <main className="flex min-h-[80vh] flex-col items-center justify-center p-4">
            <div className="w-full max-w-3xl space-y-8">
                
                {/* Custom Progress Bar */}
                <div className="space-y-3">
                    <div className="flex justify-between text-sm font-semibold text-muted-foreground">
                        <span>Quiz {currentQuiz} of {totalQuizzes} / {quizData.title}</span>
                        <span>{Math.round(progressPercentage)}% Completed</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-primary transition-all duration-500 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                <Card className="w-full shadow-md">
                    <CardHeader>
                        <CardTitle className="text-2xl">{question.text}</CardTitle>
                        <CardDescription>Select or enter your precise response.</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="min-h-[300px] flex flex-col items-center justify-center border-y bg-muted/20 p-8 space-y-4">
                        
                        {question.type === "single_choice" && question.options && (
                            <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">
                                {question.options.map((opt: any) => (
                                    <Button 
                                        key={opt.value} 
                                        variant={answers[question.id] === opt.value ? "default" : "outline"}
                                        size="lg"
                                        className="justify-start text-base h-auto py-5 shadow-sm"
                                        onClick={() => handleAnswer(opt.value)}
                                    >
                                        {opt.label}
                                    </Button>
                                ))}
                            </div>
                        )}

                        {question.type === "time" && (
                            <div className="max-w-xs mx-auto w-full flex flex-col items-center gap-4">
                                <div className="text-4xl opacity-50 mb-4">⏰</div>
                                <Input 
                                    type="time" 
                                    className="text-2xl p-6 text-center shadow-inner font-bold tracking-widest"
                                    value={answers[question.id] || ""} 
                                    onChange={(e) => handleAnswer(e.target.value)}
                                />
                            </div>
                        )}

                    </CardContent>
                    
                    <CardFooter className="flex justify-between pt-6">
                        <Button 
                            variant="outline" 
                            onClick={() => setCurrentQuiz(Math.max(1, currentQuiz - 1))}
                            disabled={currentQuiz === 1 || isSubmitting}
                        >
                            Previous
                        </Button>
                        <Button onClick={handleNext} disabled={isSubmitting} className="min-w-[120px]">
                            {currentQuiz === totalQuizzes ? (isSubmitting ? "Finishing..." : "Finish Setup") : "Next >>"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </main>
    );
}
