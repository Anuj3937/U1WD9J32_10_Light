"use client"

import { useState } from "react"
import { Nav } from "@/components/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plus, Trophy, Pencil } from "lucide-react"
import { AddGoalDialog } from "@/components/goals/add-goal-dialog"
import { EditGoalDialog } from "@/components/goals/edit-goal-dialog"
import { UpdateProgressDialog } from "@/components/goals/update-progress-dialog"
import { useMentalHealthStore } from "@/lib/data-service"
import { Rewards } from "@/components/gamification/rewards"
import { useToast } from "@/components/ui/use-toast"

export default function Goals() {
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [showEditGoal, setShowEditGoal] = useState(false)
  const [showUpdateProgress, setShowUpdateProgress] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)
  const goals = useMentalHealthStore((state) => state.goals)
  const { toast } = useToast()

  const handleEditGoal = (goalId: string) => {
    setSelectedGoal(goalId)
    setShowEditGoal(true)
  }

  const handleUpdateProgress = (goalId: string) => {
    setSelectedGoal(goalId)
    setShowUpdateProgress(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="max-w-7xl mx-auto mt-8 p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Goals & Habits</h1>
            <p className="text-muted-foreground">Track your progress and build healthy habits</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (goals.length > 0) {
                  setShowEditGoal(true)
                  setSelectedGoal(goals[0].id)
                } else {
                  toast({
                    title: "No goals to edit",
                    description: "Add a goal first before editing.",
                    variant: "destructive",
                  })
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
            <CardDescription>You're making great progress on your goals!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                <span className="text-3xl font-bold">{goals.length}</span>
                <span className="text-sm text-muted-foreground">Active Goals</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                <span className="text-3xl font-bold">
                  {goals.length > 0
                    ? Math.round(
                        goals.reduce((acc, goal) => acc + (goal.current / goal.target) * 100, 0) / goals.length,
                      )
                    : 0}
                  %
                </span>
                <span className="text-sm text-muted-foreground">Average Completion</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                <span className="text-3xl font-bold">{goals.filter((goal) => goal.current >= goal.target).length}</span>
                <span className="text-sm text-muted-foreground">Completed Goals</span>
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
              <p className="text-muted-foreground">Create your first goal to start tracking your progress</p>
              <Button onClick={() => setShowAddGoal(true)}>Add Your First Goal</Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{goal.title}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => handleEditGoal(goal.id)}>
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
                        <span className="text-sm text-muted-foreground capitalize">{goal.category}</span>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleUpdateProgress(goal.id)}>
                        Update Progress
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <CardTitle>Achievements</CardTitle>
              </div>
              <CardDescription>Your progress and rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <Rewards />
            </CardContent>
          </Card>
        </div>

        <AddGoalDialog open={showAddGoal} onOpenChange={setShowAddGoal} />

        {selectedGoal && (
          <>
            <EditGoalDialog open={showEditGoal} onOpenChange={setShowEditGoal} goalId={selectedGoal} />
            <UpdateProgressDialog
              open={showUpdateProgress}
              onOpenChange={setShowUpdateProgress}
              goalId={selectedGoal}
            />
          </>
        )}
      </main>
    </div>
  )
}

