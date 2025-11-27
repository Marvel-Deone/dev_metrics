'use client'

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github } from 'lucide-react';

const SignIn = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-background flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="border border-border/50 shadow-lg backdrop-blur-sm">
          <CardHeader className="space-y-3 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Github className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">DevMetrics</CardTitle>
            <CardDescription>
              Connect with GitHub to view your stats and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              className="w-full h-12 text-base font-semibold gap-2 bg-primary hover:bg-primary/90 transition-all duration-200"
            >
              <Github className="w-5 h-5" />
              Sign in with GitHub
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-4">
              We only access your public GitHub profile data
            </p>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Your development metrics at a glance</p>
        </div>
      </div>
    </div>
  )
}

export default SignIn;