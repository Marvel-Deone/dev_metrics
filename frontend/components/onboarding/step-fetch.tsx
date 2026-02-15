"use client"

import { useEffect, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2 } from "lucide-react";

interface StepFetchProps {
    onNext: () => void
}

const TASKS = [
    "Fetch user profile",
    "Fetch repos",
    "Fetch commit history (last 90 days)",
    "Fetch languages",
    "Fetch PR activity",
    "Fetch star/fork metrics",
]

const StepFetch = ({ onNext }: StepFetchProps) => {
    const [progress, setProgress] = useState(0);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const hasAdvanced = useRef(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);

                    if (!hasAdvanced.current) {
                        hasAdvanced.current = true;
                        setTimeout(onNext, 1000);
                    }

                    return 100;
                }
                return prev + 2;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [onNext]);

    useEffect(() => {
        const taskInterval = setInterval(() => {
            setCurrentTaskIndex((prev) => {
                if (prev < TASKS.length - 1) return prev + 1
                return prev;
            })
        }, 1500);

        return () => clearInterval(taskInterval);
    }, [])

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="w-full max-w-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Indexing your repositories...</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-2">
                        <Progress value={progress} className="h-3" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{Math.round(progress)}%</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {TASKS.map((task, index) => (
                            <div
                                key={index}
                                className={`flex items-center gap-3 transition-all duration-300 ${index === currentTaskIndex
                                    ? "text-foreground font-medium translate-x-2"
                                    : index < currentTaskIndex
                                        ? "text-muted-foreground/50"
                                        : "text-muted-foreground/30"
                                    }`}
                            >
                                {index < currentTaskIndex ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : index === currentTaskIndex ? (
                                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                                ) : (
                                    <div className="h-5 w-5 rounded-full border-2 border-muted" />
                                )}
                                <span>{task}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export { StepFetch };