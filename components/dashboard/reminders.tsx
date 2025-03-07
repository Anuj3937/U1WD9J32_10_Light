"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Bell, Plus } from "lucide-react"
import { useMentalHealthStore } from "@/lib/data-service"

export function Reminders() {
  const reminders = useMentalHealthStore((state) => state.reminders)
  const toggleReminder = useMentalHealthStore((state) => state.toggleReminder)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Daily Reminders</CardTitle>
          <CardDescription>Stay on track with your well-being routine</CardDescription>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Reminder
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="flex items-center space-x-2">
              <Checkbox checked={reminder.completed} onCheckedChange={() => toggleReminder(reminder.id)} />
              <div className="flex-1">
                <p className="font-medium">{reminder.title}</p>
                <p className="text-sm text-muted-foreground">{reminder.time}</p>
              </div>
              <Bell className="w-4 h-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

