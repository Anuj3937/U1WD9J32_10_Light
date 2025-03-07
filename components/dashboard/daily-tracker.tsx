"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { useMentalHealthStore } from "@/lib/data-service"
import { useToast } from "@/components/ui/use-toast"

const activities = [
  { id: "exercise", label: "Exercise", icon: "🏃‍♂️" },
  { id: "meditation", label: "Meditation", icon: "🧘‍♂️" },
  { id: "study", label: "Study", icon: "📚" },
  { id: "social", label: "Social Activity", icon: "👥" },
  { id: "sleep", label: "Good Sleep", icon: "😴" },
  { id: "outdoor", label: "Outdoor Time", icon: "🌳" },
  { id: "hobby", label: "Hobby", icon: "🎨" },
  { id: "healthy-eating", label: "Healthy Eating", icon: "🥗" },
]

export function DailyTracker() {
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])
  const [moodLevel, setMoodLevel] = useState(5)
  const [stressLevel, setStressLevel] = useState(5)
  const addMoodEntry = useMentalHealthStore((state) => state.addMoodEntry)
  const { toast } = useToast()

  const handleActivityToggle = (activityId: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activityId) ? prev.filter((id) => id !== activityId) : [...prev, activityId],
    )
  }

  const handleSubmit = () => {
    // Add the current date to identify which day of the week this entry belongs to
    const today = new Date()
    const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][today.getDay()]

    // Create the mood entry with more detailed information
    const moodEntry = {
      date: today.toISOString(),
      day: dayOfWeek,
      mood: moodLevel,
      stress_level: stressLevel,
      activities: selectedActivities,
      notes: "",
    }

    // Add the mood entry to the store
    addMoodEntry(moodEntry)

    // Show success message
    toast({
      title: "Check-in Saved",
      description: "Your daily check-in has been recorded successfully.",
    })

    // Reset form after submission (optional)
    setSelectedActivities([])
    setMoodLevel(5)
    setStressLevel(5)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Check-in</CardTitle>
        <CardDescription>Track your mood and activities for today</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium">How are you feeling today?</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>😢 Sad</span>
              <span>😊 Happy</span>
            </div>
            <Slider value={[moodLevel]} onValueChange={(value) => setMoodLevel(value[0])} max={10} step={1} />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Stress Level</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>😌 Relaxed</span>
              <span>😰 Stressed</span>
            </div>
            <Slider value={[stressLevel]} onValueChange={(value) => setStressLevel(value[0])} max={10} step={1} />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">What have you done today?</h4>
          <div className="flex flex-wrap gap-2">
            {activities.map((activity) => (
              <Badge
                key={activity.id}
                variant={selectedActivities.includes(activity.id) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleActivityToggle(activity.id)}
              >
                {activity.icon} {activity.label}
              </Badge>
            ))}
          </div>
        </div>

        <Button onClick={handleSubmit} className="w-full">
          Save Daily Check-in
        </Button>
      </CardContent>
    </Card>
  )
}

