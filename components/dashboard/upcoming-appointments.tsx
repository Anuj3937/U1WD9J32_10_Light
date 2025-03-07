"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Plus } from "lucide-react"
import { format, parseISO } from "date-fns"
import Link from "next/link"

type Appointment = {
  id: string
  therapistName: string
  therapistAvatar?: string
  date: string
  type: string
  status: "confirmed" | "pending" | "cancelled"
}

type UpcomingAppointmentsProps = {
  appointments: Appointment[]
}

export function UpcomingAppointments({ appointments }: UpcomingAppointmentsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>Your scheduled counseling sessions</CardDescription>
        </div>
        <Button asChild>
          <Link href="/counseling">
            <Plus className="mr-2 h-4 w-4" />
            Schedule Session
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">You don't have any upcoming appointments.</p>
            <Button asChild>
              <Link href="/counseling">Schedule Your First Session</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={appointment.therapistAvatar} />
                      <AvatarFallback>{appointment.therapistName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{appointment.therapistName}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-4 w-4" />
                        <span>{format(parseISO(appointment.date), "MMMM d, yyyy")}</span>
                        <Clock className="ml-2 mr-1 h-4 w-4" />
                        <span>{format(parseISO(appointment.date), "h:mm a")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={appointment.status === "confirmed" ? "default" : "outline"}>
                      {appointment.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

