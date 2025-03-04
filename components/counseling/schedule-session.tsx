"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { format, addDays, isAfter, isBefore, startOfDay } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

const availableTimeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]

const counselors = [
  {
    id: "1",
    name: "Dr. Emily Johnson",
    specialization: "Anxiety & Depression",
    availability: true,
  },
  {
    id: "2",
    name: "Dr. Michael Lee",
    specialization: "Stress Management",
    availability: true,
  },
  {
    id: "3",
    name: "Dr. Sarah Thompson",
    specialization: "Academic Pressure",
    availability: true,
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    specialization: "Trauma & PTSD",
    availability: true,
  },
  {
    id: "5",
    name: "Dr. Maria Rodriguez",
    specialization: "Eating Disorders",
    availability: true,
  },
]

type ScheduleSessionProps = {
  preselectedCounselor?: string | null;
}

export function ScheduleSession({ preselectedCounselor }: ScheduleSessionProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [timeSlot, setTimeSlot] = useState("")
  const [counselor, setCounselor] = useState("")
  const [sessionType, setSessionType] = useState("video")
  const [concerns, setConcerns] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Set preselected counselor if provided
  useEffect(() => {
    if (preselectedCounselor) {
      setCounselor(preselectedCounselor)
    }
  }, [preselectedCounselor])

  const handleSchedule = () => {
    if (date && timeSlot && counselor) {
      setIsSubmitting(true)
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false)
        
        toast({
          title: "Session scheduled successfully",
          description: `Your ${sessionType} session with ${counselors.find(c => c.id === counselor)?.name} is scheduled for ${format(date, "EEEE, MMMM d")} at ${timeSlot}.`,
        })
        
        // Reset form
        setDate(undefined)
        setTimeSlot("")
        setCounselor("")
        setSessionType("video")
        setConcerns("")
      }, 1500)
    }
  }

  // Disable past dates and weekends
  const disabledDates = (date: Date) => {
    const today = startOfDay(new Date())
    return isBefore(date, today) || date.getDay() === 0 || date.getDay() === 6
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule a Counseling Session</CardTitle>
        <CardDescription>Choose a counselor, date, and time that works for you</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="counselor">Select Counselor</Label>
          <Select value={counselor} onValueChange={setCounselor}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a counselor" />
            </SelectTrigger>
            <SelectContent>
              {counselors.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name} - {c.specialization}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Session Type</Label>
          <RadioGroup value={sessionType} onValueChange={setSessionType} className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="video" id="video" />
              <Label htmlFor="video">Video Session</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="in-person" id="in-person" />
              <Label htmlFor="in-person">In-Person</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Select Date</Label>
          <Calendar 
            mode="single" 
            selected={date} 
            onSelect={setDate} 
            className="rounded-md border"
            disabled={disabledDates}
            initialFocus
          />
        </div>

        {date && (
          <div className="space-y-2">
            <Label>Select Time</Label>
            <div className="grid grid-cols-3 gap-2">
              {availableTimeSlots.map((slot) => (
                <Button
                  key={slot}
                  type="button"
                  variant={timeSlot === slot ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setTimeSlot(slot)}
                >
                  {slot}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="concerns">Primary Concerns (Optional)</Label>
          <Textarea
            id="concerns"
            placeholder="Briefly describe what you'd like to discuss in your session"
            value={concerns}
            onChange={(e) => setConcerns(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSchedule} 
          disabled={!date || !timeSlot || !counselor || isSubmitting}
        >
          {isSubmitting ? "Scheduling..." : "Schedule Session"}
        </Button>
      </CardFooter>
    </Card>
  )
}