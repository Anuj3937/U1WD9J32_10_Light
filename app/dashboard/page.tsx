"use client"

import { useState } from "react"
import { Nav } from "@/components/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Video, BarChart2, Users, Brain, AlertTriangle, Calendar, Clock, Plus } from "lucide-react"
import { MoodChart } from "@/components/dashboard/mood-chart"
import { StressLevels } from "@/components/dashboard/stress-levels"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { DailyTracker } from "@/components/dashboard/daily-tracker"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { useMentalHealthStore } from "@/lib/data-service"
import { format, parseISO, addDays } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { useToast } from "@/components/ui/use-toast"

// Sample upcoming appointments
const upcomingAppointments = [
  {
    id: "1",
    therapistName: "Dr. Emily Johnson",
    therapistAvatar: "/placeholder.svg",
    date: format(addDays(new Date(), 2), "yyyy-MM-dd'T'HH:mm:ss"),
    type: "Individual Therapy",
    status: "confirmed",
  },
  {
    id: "2",
    therapistName: "Dr. Michael Lee",
    therapistAvatar: "/placeholder.svg",
    date: format(addDays(new Date(), 5), "yyyy-MM-dd'T'HH:mm:ss"),
    type: "Follow-up Session",
    status: "pending",
  },
]

// Sample recent activities
const recentActivities = [
  {
    id: "1",
    type: "assessment",
    title: "Completed Anxiety Assessment",
    date: format(addDays(new Date(), -1), "yyyy-MM-dd'T'HH:mm:ss"),
    score: 68,
  },
  {
    id: "2",
    type: "diary",
    title: "Added Video Diary Entry",
    date: format(addDays(new Date(), -2), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "3",
    type: "goal",
    title: "Completed Meditation Goal",
    date: format(addDays(new Date(), -3), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "4",
    type: "community",
    title: "Joined Anxiety Support Group",
    date: format(addDays(new Date(), -5), "yyyy-MM-dd'T'HH:mm:ss"),
  },
]

export default function Dashboard() {
  const [lastAssessmentScore, setLastAssessmentScore] = useState(75)
  const [improvementRate, setImprovementRate] = useState(15)
  const moodEntries = useMentalHealthStore((state) => state.moodEntries)
  const goals = useMentalHealthStore((state) => state.goals)
  const { toast } = useToast()

  // Calculate stats
  const completedGoals = goals.filter((goal) => goal.current >= goal.target).length
  const activeGoals = goals.length
  const averageMood =
    moodEntries.length > 0
      ? Math.round((moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length) * 10) / 10
      : 0

  // Check  entry) => sum + entry.mood, 0) / moodEntries.length * 10) / 10\
 // : 0

  // Check if user has completed an assessment recently
  const hasRecentAssessment = recentActivities.some(
    (activity) => activity.type === "assessment" && new Date(activity.date) >= addDays(new Date(), -7),
  )

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="max-w-7xl mx-auto mt-8 p-4">
        <div className="flex flex-col gap-6">
          {/* Assessment Alert */}
          {!hasRecentAssessment && (
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
          )}

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
                  <span className="font-medium">{lastAssessmentScore}/100</span>
                </div>
                <Progress value={lastAssessmentScore} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  Your mental well-being score has improved by {improvementRate}% since last month
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
                <div className="text-2xl font-bold">{averageMood}/10</div>
                <p className="text-xs text-muted-foreground">Based on your daily check-ins</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Diary Entries</CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recentActivities.filter((a) => a.type === "diary").length}</div>
                <p className="text-xs text-muted-foreground">Recent entries this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Goals</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {completedGoals}/{activeGoals}
                </div>
                <p className="text-xs text-muted-foreground">Goals completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
                <p className="text-xs text-muted-foreground">Scheduled counseling sessions</p>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your scheduled counseling sessions</CardDescription>
              </div>
              <Button asChild>
                <Link href="/counseling">
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Session
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">You don't have any upcoming appointments.</p>
                  <Button asChild>
                    <Link href="/counseling">Schedule Your First Session</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <Card key={appointment.id}>
                      <CardContent className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={appointment.therapistAvatar} />
                            <AvatarFallback>{appointment.therapistName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{appointment.therapistName}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="mr-1 h-4 w-4" />
                              <span>{format(parseISO(appointment.date), "MMMM d, yyyy")}</span>
                              <Clock className="ml-2 mr-1 h-4 w-4" />
                              <span>{format(parseISO(appointment.date), "h:mm a")}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={appointment.status === "confirmed" ? "default" : "outline"}>
                            {appointment.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main Content */}
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="mood">Mood Analysis</TabsTrigger>
              <TabsTrigger value="activities">Recent Activities</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Weekly Mood Analysis</CardTitle>
                    <CardDescription>Track your emotional well-being over time</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <MoodChart />
                  </CardContent>
                  <CardFooter className="text-sm text-muted-foreground">
                    <div className="w-full flex justify-between items-center">
                      <span>Data from your daily check-ins</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Analysis Generated",
                            description: "Your detailed mood analysis has been generated.",
                          })
                        }}
                      >
                        View Detailed Analytics
                      </Button>
                    </div>
                  </CardFooter>
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
              </div>
            </TabsContent>

            <TabsContent value="mood" className="space-y-6 mt-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Daily Tracker</CardTitle>
                  <CardDescription>Track your mood and daily activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <DailyTracker />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activities" className="space-y-6 mt-6">
              <RecentActivities activities={recentActivities} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

