"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useMentalHealthStore } from "@/lib/data-service"

export function GoalsProgress() {
  const goals = useMentalHealthStore((state) => state.goals)
  const updateGoal = useMentalHealthStore((state) => state.updateGoal)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Goals & Habits</CardTitle>
          <CardDescription>Track your progress towards better mental health</CardDescription>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">{goal.title}</span>
                <span className="text-sm text-muted-foreground">
                  {goal.current}/{goal.target}
                </span>
              </div>
              <Progress value={(goal.current / goal.target) * 100} />
              <p className="text-sm text-muted-foreground">{goal.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

