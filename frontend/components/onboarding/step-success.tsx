"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import confetti from "canvas-confetti"
import { useEffect } from "react"

interface StepSuccessProps {
  onComplete: () => void
}

const StepSuccess = ({ onComplete }: StepSuccessProps) => {
  useEffect(() => {
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const random = (min: number, max: number) => Math.random() * (max - min) + min

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      confetti({
        ...defaults,
        particleCount,
        origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-500">
      <Card className="w-full max-w-lg text-center border-green-500/20 bg-linear-to-b from-background to-green-500/5">
        <CardHeader>
          <div className="mx-auto bg-green-500/10 p-6 rounded-full mb-6 animate-bounce">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold">All Set!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-2">
            <p className="text-xl font-medium">Your DevMetrics dashboard is ready.</p>
            <p className="text-muted-foreground">
              We've analyzed your GitHub profile and generated your personalized insights.
            </p>
          </div>
          <Button
            size="lg"
            onClick={onComplete}
            className="w-full font-semibold text-lg bg-green-600 hover:bg-green-700 text-white"
          >
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export { StepSuccess };
