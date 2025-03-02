"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Lightbulb, TrendingUp, AlertTriangle } from "lucide-react"
import { useMentalHealthStore } from "@/lib/data-service"

export function AIInsights() {
  const moodEntries = useMentalHealthStore((state) => state.moodEntries)
  const assessmentScores = useMentalHealthStore((state) => state.assessmentScores)

  // Calculate insights based on mood entries and assessment scores
  const calculateInsights = () => {
    const recentMoods = moodEntries.slice(-7)
    const averageMood = recentMoods.reduce((acc, entry) => acc + entry.mood, 0) / recentMoods.length
    const stressLevels = recentMoods.map((entry) => entry.stress_level)
    const averageStress = stressLevels.reduce((acc, level) => acc + level, 0) / stressLevels.length

    return {
      trendingUp: averageMood > 3.5,
      stressAlert: averageStress > 7,
      recommendations: [
        "Try a 5-minute mindfulness exercise",
        "Connect with a friend today",
        "Take a short walk outside",
      ],
    }
  }

  const insights = calculateInsights()

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Insights</CardTitle>
        <CardDescription>Personalized recommendations based on your data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.trendingUp ? (
          <Alert>
            <TrendingUp className="w-4 h-4" />
            <AlertTitle>Positive Trend</AlertTitle>
            <AlertDescription>Your mood has been improving over the past week. Keep up the good work!</AlertDescription>
          </Alert>
        ) : insights.stressAlert ? (
          <Alert variant="destructive">
            <AlertTriangle className="w-4 h-4" />
            <AlertTitle>Stress Alert</AlertTitle>
            <AlertDescription>
              Your stress levels seem elevated. Consider scheduling a counseling session.
            </AlertDescription>
          </Alert>
        ) : null}
        <div className="space-y-2">
          <h4 className="font-medium">Recommended Actions</h4>
          <ul className="space-y-2">
            {insights.recommendations.map((rec, index) => (
              <li key={index} className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

