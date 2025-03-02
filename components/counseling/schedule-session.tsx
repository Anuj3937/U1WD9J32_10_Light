"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"

const availableTimeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]

const counselors = [
  {
    id: 1,
    name: "Dr. Emily Johnson",
    specialization: "Anxiety & Depression",
    availability: true,
  },
  {
    id: 2,
    name: "Dr. Michael Lee",
    specialization: "Stress Management",
    availability: true,
  },
  {
    id: 3,
    name: "Dr. Sarah Thompson",
    specialization: "Academic Pressure",
    availability: true,
  },
]

export function ScheduleSession() {
  const [date, setDate] = useState<Date>()
  const [timeSlot, setTimeSlot] = useState("")
  const [counselor, setCounselor] = useState("")

  const handleSchedule = () => {
    if (date && timeSlot && counselor) {
      console.log("Scheduling session:", {
        date: format(date, "PPP"),
        timeSlot,
        counselor,
      })
      // Here you would typically make an API call to schedule the session
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule a Counseling Session</CardTitle>
        <CardDescription>Choose a date and time that works for you</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium">Select Counselor</h4>
          <Select value={counselor} onValueChange={setCounselor}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a counselor" />
            </SelectTrigger>
            <SelectContent>
              {counselors.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.name} - {c.specialization}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Select Date</h4>
          <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Select Time</h4>
          <Select value={timeSlot} onValueChange={setTimeSlot}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a time slot" />
            </SelectTrigger>
            <SelectContent>
              {availableTimeSlots.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {slot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSchedule} disabled={!date || !timeSlot || !counselor}>
          Schedule Session
        </Button>
      </CardFooter>
    </Card>
  )
}

