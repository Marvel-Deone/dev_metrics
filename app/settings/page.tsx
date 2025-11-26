"use client"

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "next-themes";
import { Download, Share2, User, Shield, Bell, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

 const SettingsPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isPublic, setIsPublic] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const handleExport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Generating your ${format} report... This may take a moment.`,
    });
    // Simulate export delay
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Your ${format} report has been downloaded successfully.`,
        variant: "default", // Corrected variant
      })
    }, 2000);
  }

  const handlePublicToggle = (checked: boolean) => {
    setIsPublic(checked)
    if (checked) {
      toast({
        title: "Profile Published",
        description: "Your developer profile is now viewable by the public.",
      });
    } else {
      toast({
        title: "Profile Private",
        description: "Your developer profile is now hidden from the public.",
      });
    }
  }

  if (status === "loading") return null;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Settings</h1>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle>Account</CardTitle>
            </div>
            <CardDescription>Manage your personal information and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" defaultValue={session?.user?.name || ""} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue={session?.user?.email || ""} disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" placeholder="Tell us about yourself..." className="resize-none" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>

        {/* Public Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-primary" />
              <CardTitle>Public Profile</CardTitle>
            </div>
            <CardDescription>Control your profile visibility and public link</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Make Profile Public</Label>
                <p className="text-sm text-muted-foreground">Allow others to view your developer stats</p>
              </div>
              <Switch checked={isPublic} onCheckedChange={handlePublicToggle} />
            </div>

            {isPublic && (
              <div className="p-4 rounded-lg bg-secondary/50 border border-border flex items-center justify-between gap-4">
                <code className="text-sm flex-1 truncate">
                  devmetrics.app/u/{session?.user?.name?.replace(/\s+/g, "").toLowerCase() || "user"}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `devmetrics.app/u/${session?.user?.name?.replace(/\s+/g, "").toLowerCase() || "user"}`,
                    )
                    toast({ title: "Link Copied", description: "Public profile link copied to clipboard." })
                  }}
                >
                  Copy Link
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Export Data */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-primary" />
              <CardTitle>Export Data</CardTitle>
            </div>
            <CardDescription>Download your analytics reports</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex-1 gap-2 bg-transparent" onClick={() => handleExport("PDF")}>
              <Download className="w-4 h-4" /> Export as PDF
            </Button>
            <Button variant="outline" className="flex-1 gap-2 bg-transparent" onClick={() => handleExport("PNG")}>
              <Download className="w-4 h-4" /> Export Charts (PNG)
            </Button>
            <Button variant="outline" className="flex-1 gap-2 bg-transparent" onClick={() => handleExport("JSON")}>
              <Download className="w-4 h-4" /> Export Raw Data
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Manage your email preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Weekly Summary</Label>
                <p className="text-sm text-muted-foreground">Receive a weekly report of your coding activity</p>
              </div>
              <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-500/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" />
              <CardTitle className="text-red-500">Danger Zone</CardTitle>
            </div>
            <CardDescription>Irreversible account actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Delete Account</Label>
                <p className="text-sm text-muted-foreground">Permanently remove your account and all data</p>
              </div>
              <Button variant="destructive" size="sm" className="gap-2">
                <Trash2 className="w-4 h-4" /> Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Toaster />
    </div>
  )
}

export default SettingsPage;