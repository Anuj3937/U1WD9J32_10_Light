"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useMentalHealthStore } from "@/lib/data-service"

export function MoodHeatmap() {
  const moodEntries = useMentalHealthStore((state) => state.moodEntries)

  // Process mood data for heatmap visualization
  const processedData = moodEntries.reduce(
    (acc, entry) => {
      const date = new Date(entry.date)
      const week = Math.floor(date.getDate() / 7)
      const day = date.getDay()

      if (!acc[week]) {
        acc[week] = Array(7).fill(0)
      }
      acc[week][day] = entry.mood
      return acc
    },
    {} as Record<number, number[]>,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood Patterns</CardTitle>
        <CardDescription>Your emotional well-being over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] grid grid-cols-7 gap-1">
          {Object.values(processedData).map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-rows-7 gap-1">
              {week.map((value, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`rounded-sm ${
                    value === 0
                      ? "bg-muted"
                      : value < 3
                        ? "bg-red-200 dark:bg-red-900"
                        : value < 5
                          ? "bg-yellow-200 dark:bg-yellow-900"
                          : "bg-green-200 dark:bg-green-900"
                  }`}
                  title={`Mood: ${value}`}
                />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

