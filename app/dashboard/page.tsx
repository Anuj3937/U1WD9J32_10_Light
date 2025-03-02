import { Nav } from "@/components/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Video, BarChart2, Users, Film, Brain, AlertTriangle } from "lucide-react"
import { MoodChart } from "@/components/dashboard/mood-chart"
import { StressLevels } from "@/components/dashboard/stress-levels"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { DailyTracker } from "@/components/dashboard/daily-tracker"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="max-w-7xl mx-auto mt-8 p-4">
        <div className="flex flex-col gap-6">
          {/* Assessment Alert */}
          <Alert>
            <Brain className="h-4 w-4" />
            <AlertTitle>Mental Health Check-In</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>Regular self-assessment helps maintain your mental well-being. Take a quick assessment now.</span>
              <Button asChild>
                <Link href="/assessment">Take Basic Assessment</Link>
              </Button>
            </AlertDescription>
          </Alert>

          {/* Assessment Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Assessment & Progress</CardTitle>
              <CardDescription>Track your mental health journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Last Assessment Score</span>
                  <span className="font-medium">75/100</span>
                </div>
                <Progress value={75} />
                <p className="text-sm text-muted-foreground">
                  Your mental well-being score has improved by 15% since last month
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">Basic Assessment</CardTitle>
                    <CardDescription>10 questions • 5 mins</CardDescription>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0">
                    <Button asChild variant="secondary" className="w-full">
                      <Link href="/assessment">Start</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">Detailed Analysis</CardTitle>
                    <CardDescription>30 questions • 15 mins</CardDescription>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0">
                    <Button asChild variant="secondary" className="w-full">
                      <Link href="/assessment/detailed">Start</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">Crisis Assessment</CardTitle>
                    <CardDescription>Immediate help & support</CardDescription>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0">
                    <Button asChild variant="destructive" className="w-full">
                      <Link href="/assessment/crisis">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Get Help Now
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Header with Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mood Score</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7.5/10</div>
                <p className="text-xs text-muted-foreground">+4% from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Diary Entries</CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">3 entries this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Community</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Active support groups</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reels Watched</CardTitle>
                <Film className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28</div>
                <p className="text-xs text-muted-foreground">Self-help content</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Weekly Mood Analysis</CardTitle>
                <CardDescription>Track your emotional well-being over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <MoodChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stress Levels</CardTitle>
                <CardDescription>Current stress indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <StressLevels />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <QuickActions />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Daily Tracker</CardTitle>
                <CardDescription>Track your mood and daily activities</CardDescription>
              </CardHeader>
              <CardContent>
                <DailyTracker />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

