"use client"

import { useState, useEffect } from "react"
import { Nav } from "@/components/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { MapPin, Star, Clock, Video } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Therapist = {
  id: string
  name: string
  specialization: string
  rating: number
  reviews: number
  image: string
  location: {
    latitude: number
    longitude: number
    address: string
  }
  distance?: number
  nextAvailable: string
  sessionTypes: ("in-person" | "video")[]
  price: number
}

const therapists: Therapist[] = [
  {
    id: "1",
    name: "Dr. Emily Johnson",
    specialization: "Anxiety & Depression",
    rating: 4.9,
    reviews: 124,
    image: "/placeholder.svg",
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      address: "123 Therapy St, New York, NY",
    },
    nextAvailable: "2024-02-28",
    sessionTypes: ["in-person", "video"],
    price: 150,
  },
  // Add more therapists...
]

const specializations = [
  { value: "anxiety-depression", label: "Anxiety & Depression" },
  { value: "stress-management", label: "Stress Management" },
  { value: "trauma-ptsd", label: "Trauma & PTSD" },
  { value: "academic-pressure", label: "Academic Pressure" },
  { value: "relationship", label: "Relationship Counseling" },
] as const

export default function Resources() {
  const [userLocation, setUserLocation] = useState<GeolocationPosition | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null)
  const [selectedSessionType, setSelectedSessionType] = useState<"in-person" | "video">("video")
  const [searchQuery, setSearchQuery] = useState("")
  const [specialization, setSpecialization] = useState<string>("")

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation(position),
        (error) => console.error("Error getting location:", error),
      )
    }
  }, [])

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const filteredTherapists = therapists
    .map((therapist) => ({
      ...therapist,
      distance: userLocation
        ? calculateDistance(
            userLocation.coords.latitude,
            userLocation.coords.longitude,
            therapist.location.latitude,
            therapist.location.longitude,
          )
        : undefined,
    }))
    .filter(
      (therapist) =>
        therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!specialization || therapist.specialization === specialization),
    )
    .sort((a, b) => (a.distance || 0) - (b.distance || 0))

  const handleSchedule = (therapist: Therapist) => {
    // Here you would typically make an API call to schedule the session
    console.log("Scheduling session with:", therapist, "on:", selectedDate)
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="container mx-auto p-4 space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Find a Therapist</h1>
            <p className="text-muted-foreground">Connect with licensed professionals near you</p>
          </div>
          <div className="flex gap-4">
            <Input
              placeholder="Search therapists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[200px]"
            />
            <Select value={specialization} onValueChange={setSpecialization}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                {specializations.map((spec) => (
                  <SelectItem key={spec.value} value={spec.value}>
                    {spec.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTherapists.map((therapist) => (
            <Card key={therapist.id}>
              <CardHeader className="flex flex-row items-start gap-4">
                <img
                  src={therapist.image || "/placeholder.svg"}
                  alt={therapist.name}
                  className="rounded-full h-12 w-12 object-cover"
                />
                <div className="flex-1">
                  <CardTitle className="text-xl">{therapist.name}</CardTitle>
                  <CardDescription>{therapist.specialization}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{therapist.rating}</span>
                    <span className="text-muted-foreground">({therapist.reviews} reviews)</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {therapist.distance ? `${therapist.distance.toFixed(1)} km away` : "Distance not available"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Next available: {new Date(therapist.nextAvailable).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-2">
                    {therapist.sessionTypes.map((type) => (
                      <Badge key={type} variant="secondary">
                        {type === "video" ? <Video className="h-3 w-3 mr-1" /> : null}
                        {type === "video" ? "Video Session" : "In-Person"}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium">${therapist.price}/session</span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button onClick={() => setSelectedTherapist(therapist)}>Schedule Session</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Schedule a Session</DialogTitle>
                          <DialogDescription>Choose your preferred date and session type</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <h4 className="font-medium">Session Type</h4>
                            <Select
                              value={selectedSessionType}
                              onValueChange={(value: "in-person" | "video") => setSelectedSessionType(value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {therapist.sessionTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type === "video" ? "Video Session" : "In-Person Session"}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-medium">Select Date</h4>
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              className="rounded-md border"
                              disabled={(date) => date < new Date() || date.getDay() === 0}
                            />
                          </div>

                          <Button className="w-full" onClick={() => handleSchedule(therapist)}>
                            Confirm Booking
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

