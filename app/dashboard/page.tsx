"use client";

import { useState } from "react";
import { Nav } from "@/components/nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Video,
  BarChart2,
  Users,
  Brain,
  AlertTriangle,
  Calendar,
  Clock,
  Plus,
} from "lucide-react";
import { MoodChart } from "@/components/dashboard/mood-chart";
import { StressLevels } from "@/components/dashboard/stress-levels";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { DailyTracker } from "@/components/dashboard/daily-tracker";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { useMentalHealthStore } from "@/lib/data-service";
import { format, parseISO, addDays } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecentActivities } from "@/components/dashboard/recent-activities";
import { useToast } from "@/components/ui/use-toast";
import { Trophy, Pencil } from "lucide-react";
import { AddGoalDialog } from "@/components/goals/add-goal-dialog";
import { EditGoalDialog } from "@/components/goals/edit-goal-dialog";
import { UpdateProgressDialog } from "@/components/goals/update-progress-dialog";
import { Rewards } from "@/components/gamification/rewards";

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
];

type Activity = {
  id: string;
  type: "assessment" | "diary" | "goal" | "community";
  title: string;
  date: string;
  score?: number;
};

// Sample recent activities
const recentActivities: Activity[] = [
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
];

export default function Dashboard() {
  const [lastAssessmentScore, setLastAssessmentScore] = useState(75);
  const [improvementRate, setImprovementRate] = useState(15);
  const moodEntries = useMentalHealthStore((state) => state.moodEntries);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showEditGoal, setShowEditGoal] = useState(false);
  const [showUpdateProgress, setShowUpdateProgress] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const goalScore = useMentalHealthStore((state) => state.goals);
  const goals = useMentalHealthStore((state) => state.goals);
  const { toast } = useToast();

  const handleEditGoal = (goalId: string) => {
    setSelectedGoal(goalId);
    setShowEditGoal(true);
  };

  const handleUpdateProgress = (goalId: string) => {
    setSelectedGoal(goalId);
    setShowUpdateProgress(true);
  };

  const completedGoals = goalScore.filter(
    (goalScore) => goalScore.current >= goalScore.target
  ).length;
  const activeGoals = goalScore.length;
  const averageMood =
    moodEntries.length > 0
      ? Math.round(
          (moodEntries.reduce((sum, entry) => sum + entry.mood, 0) /
            moodEntries.length) *
            10
        ) / 10
      : 0;

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="max-w-5xl mx-auto mt-8 p-4 space-y-6">
        {/* Upcoming Appointments */}
        <Card className="bg-muted">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>
                Your scheduled counseling sessions
              </CardDescription>
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
                <p className="text-muted-foreground mb-4">
                  You don't have any upcoming appointments.
                </p>
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
                          <AvatarFallback>
                            {appointment.therapistName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {appointment.therapistName}
                          </p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-1 h-4 w-4" />
                            <span>
                              {format(
                                parseISO(appointment.date),
                                "MMMM d, yyyy"
                              )}
                            </span>
                            <Clock className="ml-2 mr-1 h-4 w-4" />
                            <span>
                              {format(parseISO(appointment.date), "h:mm a")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            appointment.status === "confirmed"
                              ? "default"
                              : "outline"
                          }
                        >
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
        {/* Mental Health Check-in Alert */}
        <Card className="bg-muted">
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
                Your mental well-being score has improved by {improvementRate}%
                since last month
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Card className="flex-1">
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

              <Card className="flex-1">
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
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Main Content */}
        <Tabs defaultValue="mood">
          <TabsList>
            <TabsTrigger value="mood">Mood</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mood Analysis</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <MoodChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Stress Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <StressLevels />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mood" className="space-y-6">
            <Card className="bg-muted">
              <CardHeader>
                <CardTitle>Daily Tracker</CardTitle>
              </CardHeader>
              <CardContent>
                <DailyTracker />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <RecentActivities activities={recentActivities} />
          </TabsContent>
        </Tabs>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Goals & Habits</h1>
            <p className="text-muted-foreground">
              Track your progress and build healthy habits
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (goals.length > 0) {
                  setShowEditGoal(true);
                  setSelectedGoal(goals[0].id);
                } else {
                  toast({
                    title: "No goals to edit",
                    description: "Add a goal first before editing.",
                    variant: "destructive",
                  });
                }
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              <span className="ml-2">Edit Goals</span>
            </Button>
            <Button onClick={() => setShowAddGoal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Goal
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Progress Summary</CardTitle>
            <CardDescription>
              You're making great progress on your goals!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                <span className="text-3xl font-bold">{goals.length}</span>
                <span className="text-sm text-muted-foreground">
                  Active Goals
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                <span className="text-3xl font-bold">
                  {goals.length > 0
                    ? Math.round(
                        goals.reduce(
                          (acc, goal) =>
                            acc + (goal.current / goal.target) * 100,
                          0
                        ) / goals.length
                      )
                    : 0}
                  %
                </span>
                <span className="text-sm text-muted-foreground">
                  Average Completion
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                <span className="text-3xl font-bold">
                  {goals.filter((goal) => goal.current >= goal.target).length}
                </span>
                <span className="text-sm text-muted-foreground">
                  Completed Goals
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {goals.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="rounded-full bg-muted p-6">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">No goals yet</h3>
              <p className="text-muted-foreground">
                Create your first goal to start tracking your progress
              </p>
              {/* <Button onClick={() => setShowAddGoal(true)}>
                Add Your First Goal
              </Button> */}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{goal.title}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditGoal(goal.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>{goal.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>
                        {goal.current}/{goal.target}
                      </span>
                    </div>
                    <Progress value={(goal.current / goal.target) * 100} />
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            goal.category === "mindfulness"
                              ? "bg-blue-500"
                              : goal.category === "exercise"
                              ? "bg-green-500"
                              : goal.category === "social"
                              ? "bg-purple-500"
                              : goal.category === "sleep"
                              ? "bg-indigo-500"
                              : "bg-orange-500"
                          }`}
                        ></div>
                        <span className="text-sm text-muted-foreground capitalize">
                          {goal.category}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateProgress(goal.id)}
                      >
                        Update Progress
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <AddGoalDialog open={showAddGoal} onOpenChange={setShowAddGoal} />

        {selectedGoal && (
          <>
            <EditGoalDialog
              open={showEditGoal}
              onOpenChange={setShowEditGoal}
              goalId={selectedGoal}
            />
            <UpdateProgressDialog
              open={showUpdateProgress}
              onOpenChange={setShowUpdateProgress}
              goalId={selectedGoal}
            />
          </>
        )}
      </main>
    </div>
  );
}
