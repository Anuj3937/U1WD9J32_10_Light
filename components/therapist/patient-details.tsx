"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTherapistStore } from "@/lib/therapist-store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { Calendar, Clock, Mail, Phone, MapPin, FileText, Video, Mic, Plus } from "lucide-react"

type PatientDetailsProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientId: string
}

export function PatientDetails({ open, onOpenChange, patientId }: PatientDetailsProps) {
  const { toast } = useToast()
  const patients = useTherapistStore((state) => state.patients)
  const addPatientNote = useTherapistStore((state) => state.addPatientNote)
  const appointments = useTherapistStore((state) => state.appointments)

  const [patient, setPatient] = useState<any>(null)
  const [patientAppointments, setPatientAppointments] = useState<any[]>([])
  const [noteType, setNoteType] = useState<"text" | "audio" | "video">("text")
  const [noteContent, setNoteContent] = useState("")
  const [isRecording, setIsRecording] = useState(false)

  useEffect(() => {
    if (open && patientId) {
      const foundPatient = patients.find((p) => p.id === patientId)
      if (foundPatient) {
        setPatient(foundPatient)

        // Get patient appointments
        const foundAppointments = appointments
          .filter((a) => a.patientId === patientId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        setPatientAppointments(foundAppointments)
      }
    }
  }, [open, patientId, patients, appointments])

  const handleAddNote = () => {
    if (!noteContent.trim() && noteType === "text") {
      toast({
        title: "Empty note",
        description: "Please enter some content for your note.",
        variant: "destructive",
      })
      return
    }

    addPatientNote(patientId, {
      id: crypto.randomUUID(),
      type: noteType,
      content: noteContent,
      date: new Date().toISOString(),
      title: `${noteType.charAt(0).toUpperCase() + noteType.slice(1)} note - ${format(new Date(), "MMM d, yyyy")}`,
    })

    toast({
      title: "Note added",
      description: "Your note has been added to the patient's record.",
    })

    setNoteContent("")
  }

  const simulateRecording = () => {
    setIsRecording(true)

    // Simulate recording for 3 seconds
    setTimeout(() => {
      setIsRecording(false)
      setNoteContent(
        noteType === "audio"
          ? "Audio recording captured on " + format(new Date(), "MMM d, yyyy 'at' h:mm a")
          : "Video recording captured on " + format(new Date(), "MMM d, yyyy 'at' h:mm a"),
      )

      toast({
        title: `${noteType.charAt(0).toUpperCase() + noteType.slice(1)} recorded`,
        description: `Your ${noteType} has been recorded successfully.`,
      })
    }, 3000)
  }

  if (!patient) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Patient Profile</DialogTitle>
          <DialogDescription>View and manage patient information</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Patient Info */}
          <div className="md:w-1/3">
            <div className="flex flex-col items-center text-center mb-4">
              <Avatar className="h-24 w-24 mb-2">
                <AvatarImage src={patient.avatar} />
                <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{patient.name}</h2>
              <p className="text-muted-foreground">{patient.age} years old</p>
              <Badge className="mt-2 capitalize">{patient.status}</Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{patient.email}</span>
              </div>
              {patient.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{patient.phone}</span>
                </div>
              )}
              {patient.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{patient.address}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Next session: {format(new Date(patient.nextSession), "MMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Last visit: {format(new Date(patient.lastVisit), "MMM d, yyyy")}</span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-2">Diagnosis</h3>
              <p className="text-sm">{patient.diagnosis || "No diagnosis recorded"}</p>
            </div>

            <div className="mt-4">
              <h3 className="font-medium mb-2">Treatment Plan</h3>
              <p className="text-sm">{patient.treatmentPlan || "No treatment plan recorded"}</p>
            </div>

            <div className="mt-4">
              <h3 className="font-medium mb-2">Insurance</h3>
              <p className="text-sm">{patient.insurance || "No insurance information"}</p>
            </div>
          </div>

          {/* Patient Tabs */}
          <div className="md:w-2/3">
            <Tabs defaultValue="notes">
              <TabsList className="w-full">
                <TabsTrigger value="notes">Session Notes</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
              </TabsList>

              <TabsContent value="notes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Add Session Note</CardTitle>
                    <CardDescription>Record your observations from the session</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Button variant={noteType === "text" ? "default" : "outline"} onClick={() => setNoteType("text")}>
                        <FileText className="h-4 w-4 mr-2" />
                        Text
                      </Button>
                      <Button
                        variant={noteType === "audio" ? "default" : "outline"}
                        onClick={() => setNoteType("audio")}
                      >
                        <Mic className="h-4 w-4 mr-2" />
                        Audio
                      </Button>
                      <Button
                        variant={noteType === "video" ? "default" : "outline"}
                        onClick={() => setNoteType("video")}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Video
                      </Button>
                    </div>

                    {noteType === "text" ? (
                      <div className="space-y-2">
                        <Label htmlFor="note">Session Notes</Label>
                        <Textarea
                          id="note"
                          value={noteContent}
                          onChange={(e) => setNoteContent(e.target.value)}
                          placeholder="Enter your session notes here..."
                          className="min-h-[150px]"
                        />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="border rounded-md p-4 flex flex-col items-center justify-center min-h-[150px]">
                          {isRecording ? (
                            <div className="flex flex-col items-center">
                              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
                                {noteType === "audio" ? (
                                  <Mic className="h-8 w-8 text-red-500" />
                                ) : (
                                  <Video className="h-8 w-8 text-red-500" />
                                )}
                              </div>
                              <p className="mt-2 text-sm">Recording...</p>
                            </div>
                          ) : noteContent ? (
                            <div className="text-center">
                              <p className="text-sm">{noteContent}</p>
                              <Button variant="outline" size="sm" className="mt-2" onClick={() => setNoteContent("")}>
                                Clear
                              </Button>
                            </div>
                          ) : (
                            <Button onClick={simulateRecording}>
                              {noteType === "audio" ? (
                                <>
                                  <Mic className="h-4 w-4 mr-2" />
                                  Start Recording Audio
                                </>
                              ) : (
                                <>
                                  <Video className="h-4 w-4 mr-2" />
                                  Start Recording Video
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    <Button onClick={handleAddNote} disabled={isRecording}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Note
                    </Button>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <h3 className="font-medium">Previous Notes</h3>

                  {patient.notes && patient.notes.length > 0 ? (
                    patient.notes.map((note: any) => (
                      <Card key={note.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base">{note.title}</CardTitle>
                              <CardDescription>
                                {format(new Date(note.date), "MMMM d, yyyy 'at' h:mm a")}
                              </CardDescription>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {note.type}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{note.content}</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No notes recorded yet.</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="appointments">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Upcoming & Past Appointments</h3>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule New
                    </Button>
                  </div>

                  {patientAppointments.length > 0 ? (
                    <div className="space-y-3">
                      {patientAppointments.map((appointment) => (
                        <Card key={appointment.id}>
                          <CardContent className="p-4 flex justify-between items-center">
                            <div>
                              <p className="font-medium">
                                {format(new Date(appointment.date), "MMMM d, yyyy 'at' h:mm a")}
                              </p>
                              <p className="text-sm text-muted-foreground">{appointment.type}</p>
                            </div>
                            <Badge variant={new Date(appointment.date) > new Date() ? "outline" : "secondary"}>
                              {new Date(appointment.date) > new Date() ? "Upcoming" : "Completed"}
                            </Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No appointments scheduled.</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="progress">
                <div className="space-y-4">
                  <h3 className="font-medium">Treatment Progress</h3>

                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium mb-1">Current Status</p>
                          <Badge
                            variant={
                              patient.progress === "Improving"
                                ? "default"
                                : patient.progress === "Stable"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {patient.progress}
                          </Badge>
                        </div>

                        <div>
                          <p className="font-medium mb-1">Treatment Goals</p>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            <li>Reduce anxiety symptoms by 50%</li>
                            <li>Develop 3 effective coping strategies</li>
                            <li>Improve sleep quality</li>
                          </ul>
                        </div>

                        <div>
                          <p className="font-medium mb-1">Progress Notes</p>
                          <p className="text-sm">
                            Patient has shown consistent attendance and engagement in therapy. Anxiety symptoms have
                            decreased from severe to moderate. Sleep quality has improved with implementation of sleep
                            hygiene practices.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end">
                    <Button>Update Progress</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="medications">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Current Medications</h3>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Medication
                    </Button>
                  </div>

                  {patient.medications && patient.medications.length > 0 ? (
                    <div className="space-y-3">
                      {patient.medications.map((medication: any) => (
                        <Card key={medication.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{medication.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {medication.dosage} - {medication.frequency}
                                </p>
                              </div>
                              <Badge variant="outline">{medication.status}</Badge>
                            </div>
                            {medication.notes && <p className="text-sm mt-2">{medication.notes}</p>}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No medications recorded.</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

