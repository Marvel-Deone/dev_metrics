"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

interface StepWelcomeProps {
    onNext: () => void
    user?: {
        name?: string | null
        image?: string | null
    }
}

export function StepWelcome({ onNext, user }: StepWelcomeProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-500">
            <Card className="w-full max-w-lg text-center border-primary/20 bg-linear-to-b from-background to-secondary/10">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                        <Sparkles className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-bold">Welcome, {user?.name?.split(" ")[0] || "Developer"}!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-lg text-muted-foreground">
                        We are setting up your developer analytics to help you track your journey.
                    </p>
                    <Button size="lg" onClick={onNext} className="w-full font-semibold text-lg">
                        Continue
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
