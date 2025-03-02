"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const achievements = [
  {
    id: 1,
    title: "Consistency Champion",
    description: "Complete daily check-ins for 7 days straight",
    progress: 5,
    total: 7,
    icon: "🏆",
  },
  {
    id: 2,
    title: "Mindfulness Master",
    description: "Practice mindfulness exercises 10 times",
    progress: 8,
    total: 10,
    icon: "🧘‍♂️",
  },
  {
    id: 3,
    title: "Community Supporter",
    description: "Help 5 community members with supportive comments",
    progress: 3,
    total: 5,
    icon: "❤️",
  },
]

export function Rewards() {
  const calculateLevel = (points: number) => Math.floor(points / 100) + 1
  const userPoints = 340

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
        <CardDescription>Level {calculateLevel(userPoints)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>XP: {userPoints}</span>
            <span>Next Level: {Math.ceil(userPoints / 100) * 100}</span>
          </div>
          <Progress value={userPoints % 100} />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Achievements</h3>
          {achievements.map((achievement) => (
            <div key={achievement.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
                <Badge variant="secondary">
                  {achievement.progress}/{achievement.total}
                </Badge>
              </div>
              <Progress value={(achievement.progress / achievement.total) * 100} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

