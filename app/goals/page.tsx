"use client"

import { useState } from "react"
import { Nav } from "@/components/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plus, Trophy } from "lucide-react"
import { AddGoalDialog } from "@/components/goals/add-goal-dialog"
import { useMentalHealthStore } from "@/lib/data-service"
import { Rewards } from "@/components/gamification/rewards"

export default function Goals() {
  const [showAddGoal, setShowAddGoal] = useState(false)
  const goals = useMentalHealthStore((state) => state.goals)

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="max-w-7xl mx-auto mt-8 p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Goals & Habits</h1>
            <p className="text-muted-foreground">Track your progress and build healthy habits</p>
          </div>
          <Button onClick={() => setShowAddGoal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Goal
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <Card key={goal.id}>
              <CardHeader>
                <CardTitle>{goal.title}</CardTitle>
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
                    <span className="text-sm text-muted-foreground">{goal.type}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Update progress
                      }}
                    >
                      Update Progress
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
      </main>
    </div>
  )
}

