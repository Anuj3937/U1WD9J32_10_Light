"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTherapistStore } from "@/lib/therapist-store"
import { Search, FileText, Video, Mic } from "lucide-react"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export function PatientRecords() {
  const [searchQuery, setSearchQuery] = useState("")
  const [patientFilter, setPatientFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const patients = useTherapistStore((state) => state.patients)

  // Get all notes from all patients
  const allNotes = patients
    .flatMap((patient) =>
      (patient.notes || []).map((note) => ({
        ...note,
        patientId: patient.id,
        patientName: patient.name,
      })),
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Filter notes
  const filteredNotes = allNotes.filter((note) => {
    // Search filter
    const matchesSearch =
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.patientName.toLowerCase().includes(searchQuery.toLowerCase())

    // Patient filter
    const matchesPatient = patientFilter === "all" || note.patientId === patientFilter

    // Type filter
    const matchesType = typeFilter === "all" || note.type === typeFilter

    return matchesSearch && matchesPatient && matchesType
  })

  const getNoteTypeIcon = (type: string) => {
    switch (type) {
      case "text":
        return <FileText className="h-4 w-4" />
      case "audio":
        return <Mic className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Records</CardTitle>
        <CardDescription>View and manage all patient notes and records</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full md:w-[300px]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={patientFilter} onValueChange={setPatientFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by patient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patients</SelectItem>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="text">Text Notes</SelectItem>
                <SelectItem value="audio">Audio Recordings</SelectItem>
                <SelectItem value="video">Video Recordings</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Records</TabsTrigger>
            <TabsTrigger value="text">Text Notes</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-4">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No records found matching your criteria.</p>
              </div>
            ) : (
              filteredNotes.map((note) => (
                <Card key={note.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          {getNoteTypeIcon(note.type)}
                          <h3 className="font-medium">{note.title}</h3>
                          <Badge variant="outline" className="capitalize">
                            {note.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Patient: {note.patientName} | {format(new Date(note.date), "MMMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                    <p className="text-sm mt-2 line-clamp-2">{note.content}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="text" className="space-y-4 mt-4">
            {filteredNotes.filter((note) => note.type === "text").length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No text notes found matching your criteria.</p>
              </div>
            ) : (
              filteredNotes
                .filter((note) => note.type === "text")
                .map((note) => (
                  <Card key={note.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <h3 className="font-medium">{note.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Patient: {note.patientName} | {format(new Date(note.date), "MMMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                      <p className="text-sm mt-2">{note.content}</p>
                    </CardContent>
                  </Card>
                ))
            )}
          </TabsContent>

          <TabsContent value="audio" className="space-y-4 mt-4">
            {filteredNotes.filter((note) => note.type === "audio").length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No audio recordings found matching your criteria.</p>
              </div>
            ) : (
              filteredNotes
                .filter((note) => note.type === "audio")
                .map((note) => (
                  <Card key={note.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <Mic className="h-4 w-4" />
                            <h3 className="font-medium">{note.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Patient: {note.patientName} | {format(new Date(note.date), "MMMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Play
                        </Button>
                      </div>
                      <p className="text-sm mt-2">{note.content}</p>
                    </CardContent>
                  </Card>
                ))
            )}
          </TabsContent>

          <TabsContent value="video" className="space-y-4 mt-4">
            {filteredNotes.filter((note) => note.type === "video").length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No video recordings found matching your criteria.</p>
              </div>
            ) : (
              filteredNotes
                .filter((note) => note.type === "video")
                .map((note) => (
                  <Card key={note.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            <h3 className="font-medium">{note.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Patient: {note.patientName} | {format(new Date(note.date), "MMMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Play
                        </Button>
                      </div>
                      <p className="text-sm mt-2">{note.content}</p>
                    </CardContent>
                  </Card>
                ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

