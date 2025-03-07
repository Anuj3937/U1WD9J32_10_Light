"use client"

import { useMemo } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { useMentalHealthStore } from "@/lib/data-service"

export function MoodChart() {
  const moodEntries = useMentalHealthStore((state) => state.moodEntries)

  // Process the mood entries to create chart data
  const chartData = useMemo(() => {
    // Create an object to store the latest entry for each day
    const dailyData: Record<string, { day: string; mood: number; stress: number }> = {}

    // Process all entries
    moodEntries.forEach((entry) => {
      const day = new Date(entry.date).toLocaleDateString("en-US", { weekday: "short" })

      // Only keep the latest entry for each day
      dailyData[day] = {
        day,
        mood: entry.mood,
        stress: entry.stress_level,
      }
    })

    // If we don't have enough data, add some default values
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const result = days.map((day) => {
      return dailyData[day] || { day, mood: null, stress: null }
    })

    // Fill in any missing data with sample data
    const finalData = result.map((item, index) => {
      if (item.mood === null) {
        // Sample data from the original static data
        const sampleData = [6, 7, 5, 8, 7, 9, 8]
        return {
          day: item.day,
          mood: sampleData[index],
          stress: 10 - sampleData[index], // Inverse relationship for sample data
        }
      }
      return item
    })

    return finalData
  }, [moodEntries])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          domain={[0, 10]}
          ticks={[0, 2, 4, 6, 8, 10]}
        />
        <Tooltip
          contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.8)", borderRadius: "8px" }}
          labelStyle={{ fontWeight: "bold" }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="mood"
          name="Mood Level"
          stroke="#4f46e5"
          strokeWidth={2}
          activeDot={{ r: 8 }}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="stress"
          name="Stress Level"
          stroke="#ef4444"
          strokeWidth={2}
          activeDot={{ r: 8 }}
          dot={{ r: 4 }}
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

