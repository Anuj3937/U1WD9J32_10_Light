"use client"

import { useState } from "react"
import { Nav } from "@/components/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import {
  Users,
  CalendarIcon,
  BarChart2,
  MessageCircle,
  Clock,
  UserCheck,
  AlertTriangle,
  Plus,
  Search,
} from "lucide-react"
import { PatientList } from "@/components/therapist/patient-list"
import { AppointmentList } from "@/components/therapist/appointment-list"
import { TherapistAnalytics } from "@/components/therapist/analytics"
import { CommunityModeration } from "@/components/therapist/community-moderation"
import { PatientRecords } from "@/components/therapist/patient-records"
import { AddPatientDialog } from "@/components/therapist/add-patient-dialog"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { format, isSameDay, parseISO } from "date-fns"
import { useTherapistStore } from "@/lib/therapist-store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PatientDetails } from "@/components/therapist/patient-details"
import { cn } from "@/lib/utils"

export default function TherapistDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [showAddPatient, setShowAddPatient] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [showPatientDetails, setShowPatientDetails] = useState(false)

  const patients = useTherapistStore((state) => state.patients)
  const appointments = useTherapistStore((state) => state.appointments)
  const urgentCases = useTherapistStore((state) => state.urgentCases)

  // Get appointments for the selected date
  const todaysAppointments = appointments.filter((appointment) => date && isSameDay(parseISO(appointment.date), date))

  // Get today's appointments for the dashboard
  const currentDayAppointments = appointments
    .filter((appointment) => isSameDay(parseISO(appointment.date), new Date()))
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())

  // Calculate appointment load for each day
  const getAppointmentLoad = (day: Date) => {
    const appointmentsOnDay = appointments.filter((appointment) => isSameDay(parseISO(appointment.date), day))

    if (appointmentsOnDay.length === 0) return "free"
    if (appointmentsOnDay.length >= 8) return "full"
    if (appointmentsOnDay.length >= 5) return "busy"
    return "light"
  }

  const handlePatientClick = (patientId: string) => {
    setSelectedPatient(patientId)
    setShowPatientDetails(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Therapist Dashboard</h1>
            <p className="text-muted-foreground">Manage your practice and patients</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Clock className="mr-2 h-4 w-4" />
              Set Availability
            </Button>
            <Button onClick={() => setShowAddPatient(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patients.length}</div>
              <p className="text-xs text-muted-foreground">+3 this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Sessions</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {appointments.filter((a) => isSameDay(parseISO(a.date), new Date())).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {
                  appointments.filter(
                    (a) => isSameDay(parseISO(a.date), new Date()) && parseISO(a.date).getTime() > Date.now(),
                  ).length
                }{" "}
                remaining
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98%</div>
              <p className="text-xs text-muted-foreground">+2.5% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Patient Progress</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">76%</div>
              <p className="text-xs text-muted-foreground">Showing improvement</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule Card */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your appointments for {format(new Date(), "MMMM d, yyyy")}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentDayAppointments.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No appointments scheduled for today.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentDayAppointments.map((appointment) => (
                    <Card key={appointment.id} className="overflow-hidden">
                      <div
                        className={cn(
                          "h-2 w-full",
                          appointment.status === "confirmed"
                            ? "bg-blue-500"
                            : appointment.status === "completed"
                              ? "bg-green-500"
                              : appointment.status === "cancelled"
                                ? "bg-red-500"
                                : "bg-yellow-500",
                        )}
                      ></div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={appointment.patientAvatar} />
                              <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{appointment.patientName}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(parseISO(appointment.date), "h:mm a")} - {appointment.duration} min
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant={
                              appointment.status === "confirmed"
                                ? "default"
                                : appointment.status === "completed"
                                  ? "secondary"
                                  : appointment.status === "cancelled"
                                    ? "destructive"
                                    : "outline"
                            }
                          >
                            {appointment.status}
                          </Badge>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Type:</span> {appointment.type}
                        </div>
                        {appointment.notes && (
                          <div className="text-sm mt-1">
                            <span className="font-medium">Notes:</span> {appointment.notes}
                          </div>
                        )}
                        <div className="flex justify-end mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const patient = patients.find((p) => p.id === appointment.patientId)
                              if (patient) {
                                setSelectedPatient(patient.id)
                                setShowPatientDetails(true)
                              }
                            }}
                          >
                            View Patient
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="patients">
              <TabsList>
                <TabsTrigger value="patients">Patients</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="records">Patient Records</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="moderation">Community Moderation</TabsTrigger>
              </TabsList>
              <TabsContent value="patients">
                <PatientList onPatientClick={handlePatientClick} />
              </TabsContent>
              <TabsContent value="appointments">
                <AppointmentList selectedDate={date} />
              </TabsContent>
              <TabsContent value="records">
                <PatientRecords />
              </TabsContent>
              <TabsContent value="analytics">
                <TherapistAnalytics />
              </TabsContent>
              <TabsContent value="moderation">
                <CommunityModeration />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Calendar */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule</CardTitle>
                <CardDescription>Your upcoming appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  modifiers={{
                    free: (date) => getAppointmentLoad(date) === "free",
                    light: (date) => getAppointmentLoad(date) === "light",
                    busy: (date) => getAppointmentLoad(date) === "busy",
                    full: (date) => getAppointmentLoad(date) === "full",
                  }}
                  modifiersClassNames={{
                    free: "bg-green-100 text-green-800 hover:bg-green-200",
                    light: "bg-blue-100 text-blue-800 hover:bg-blue-200",
                    busy: "bg-orange-100 text-orange-800 hover:bg-orange-200",
                    full: "bg-red-100 text-red-800 hover:bg-red-200",
                  }}
                />

                {date && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Appointments for {format(date, "MMMM d, yyyy")}</h3>
                    {todaysAppointments.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No appointments scheduled for this day.</p>
                    ) : (
                      <div className="space-y-2">
                        {todaysAppointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className="flex items-center justify-between p-2 rounded-md bg-muted"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={appointment.patientAvatar} />
                                <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{appointment.patientName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {format(parseISO(appointment.date), "h:mm a")} - {appointment.type}
                                </p>
                              </div>
                            </div>
                            <Badge variant={appointment.status === "confirmed" ? "default" : "outline"}>
                              {appointment.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs">Available</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs">Few Appointments</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-xs">Busy</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-xs">Full</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Urgent Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Requires Attention</CardTitle>
                <CardDescription>Urgent patient updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {urgentCases.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No urgent cases at the moment.</p>
                  ) : (
                    urgentCases.map((urgentCase) => (
                      <div
                        key={urgentCase.id}
                        className={`flex items-center gap-4 p-3 rounded-lg ${
                          urgentCase.severity === "high"
                            ? "bg-red-500/10"
                            : urgentCase.severity === "medium"
                              ? "bg-yellow-500/10"
                              : "bg-blue-500/10"
                        }`}
                      >
                        {urgentCase.severity === "high" ? (
                          <AlertTriangle className={`h-5 w-5 text-red-500`} />
                        ) : urgentCase.severity === "medium" ? (
                          <UserCheck className={`h-5 w-5 text-yellow-500`} />
                        ) : (
                          <MessageCircle className={`h-5 w-5 text-blue-500`} />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{urgentCase.title}</p>
                          <p className="text-xs text-muted-foreground">Patient: {urgentCase.patientName}</p>
                        </div>
                        <Button
                          size="sm"
                          variant={urgentCase.severity === "high" ? "destructive" : "outline"}
                          onClick={() => {
                            const patient = patients.find((p) => p.name === urgentCase.patientName)
                            if (patient) {
                              setSelectedPatient(patient.id)
                              setShowPatientDetails(true)
                            }
                          }}
                        >
                          View
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Search */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Search</CardTitle>
                <CardDescription>Find patients or appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search by name or ID..." className="pl-8" />
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Recent Patients</h4>
                  <div className="space-y-2">
                    {patients.slice(0, 3).map((patient) => (
                      <div
                        key={patient.id}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer"
                        onClick={() => handlePatientClick(patient.id)}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={patient.avatar} />
                          <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{patient.name}</p>
                          <p className="text-xs text-muted-foreground">Last visit: {patient.lastVisit}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <AddPatientDialog open={showAddPatient} onOpenChange={setShowAddPatient} />

      {selectedPatient && (
        <PatientDetails open={showPatientDetails} onOpenChange={setShowPatientDetails} patientId={selectedPatient} />
      )}
    </div>
  )
}

