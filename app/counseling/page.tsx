"use client"

import { useState } from "react"
import { Nav } from "@/components/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MapPin, Star, Clock, Search } from "lucide-react"
import { format, isBefore, startOfDay } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Enhanced therapist data with more details
const therapists = [
  {
    id: "1",
    name: "Dr. Emily Johnson",
    title: "Clinical Psychologist",
    specialization: "Anxiety & Depression",
    approach: "Cognitive Behavioral Therapy (CBT)",
    experience: "12 years",
    education: "Ph.D. in Clinical Psychology, Stanford University",
    languages: ["English", "Spanish"],
    acceptingNewPatients: true,
    rating: 4.9,
    reviews: 124,
    image: "/placeholder.svg",
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      address: "123 Therapy St, New York, NY",
      distance: 2.3,
    },
    insurance: ["Blue Cross", "Aetna", "United Healthcare", "Medicare"],
    nextAvailable: "Tomorrow",
    sessionTypes: ["in-person", "video"],
    price: 150,
    bio: "Dr. Johnson specializes in helping students manage anxiety and depression through evidence-based approaches. Her warm and empathetic style creates a safe space for exploring challenges and developing effective coping strategies.",
    areas: ["Anxiety", "Depression", "Stress Management", "Academic Pressure", "Life Transitions"],
    availability: {
      monday: ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"],
      tuesday: ["10:00 AM", "11:00 AM", "1:00 PM", "4:00 PM"],
      wednesday: ["9:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"],
      thursday: ["10:00 AM", "1:00 PM", "3:00 PM", "4:00 PM"],
      friday: ["9:00 AM", "10:00 AM", "2:00 PM"],
    },
  },
  {
    id: "2",
    name: "Dr. Michael Lee",
    title: "Licensed Therapist",
    specialization: "Stress Management",
    approach: "Mindfulness-Based Stress Reduction (MBSR)",
    experience: "8 years",
    education: "Psy.D. in Clinical Psychology, UC Berkeley",
    languages: ["English", "Mandarin"],
    acceptingNewPatients: true,
    rating: 4.8,
    reviews: 98,
    image: "/placeholder.svg",
    location: {
      latitude: 40.7328,
      longitude: -74.026,
      address: "456 Wellness Ave, New York, NY",
      distance: 3.1,
    },
    insurance: ["Blue Cross", "Cigna", "Kaiser"],
    nextAvailable: "Today",
    sessionTypes: ["video"],
    price: 130,
    bio: "Dr. Lee helps students develop practical stress management techniques through mindfulness practices. He specializes in academic stress and performance anxiety, with a focus on balancing achievement with well-being.",
    areas: ["Stress", "Anxiety", "Mindfulness", "Academic Performance", "Work-Life Balance"],
    availability: {
      monday: ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"],
      tuesday: ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"],
      wednesday: ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"],
      thursday: ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"],
      friday: ["9:00 AM", "11:00 AM", "1:00 PM"],
    },
  },
  {
    id: "3",
    name: "Dr. Sarah Thompson",
    title: "Counseling Psychologist",
    specialization: "Academic Pressure & Burnout",
    approach: "Solution-Focused Brief Therapy",
    experience: "15 years",
    education: "Ph.D. in Counseling Psychology, University of Michigan",
    languages: ["English"],
    acceptingNewPatients: true,
    rating: 4.7,
    reviews: 156,
    image: "/placeholder.svg",
    location: {
      latitude: 40.7028,
      longitude: -73.986,
      address: "789 Campus Dr, Brooklyn, NY",
      distance: 4.5,
    },
    insurance: ["Aetna", "United Healthcare", "Student Health Plan"],
    nextAvailable: "In 2 days",
    sessionTypes: ["in-person", "video"],
    price: 140,
    bio: "Dr. Thompson specializes in helping high-achieving students navigate academic pressure and prevent burnout. Her practical, solution-focused approach helps students develop sustainable study habits and self-care practices.",
    areas: ["Academic Stress", "Burnout", "Perfectionism", "Time Management", "Self-Care"],
    availability: {
      monday: ["10:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
      tuesday: ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"],
      wednesday: ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"],
      thursday: ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"],
      friday: ["10:00 AM", "12:00 PM", "2:00 PM"],
    },
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    title: "Clinical Psychologist",
    specialization: "Trauma & PTSD",
    approach: "EMDR & Trauma-Focused CBT",
    experience: "20 years",
    education: "Ph.D. in Clinical Psychology, Columbia University",
    languages: ["English", "French"],
    acceptingNewPatients: false,
    rating: 4.9,
    reviews: 210,
    image: "/placeholder.svg",
    location: {
      latitude: 40.7428,
      longitude: -73.996,
      address: "321 Healing Blvd, New York, NY",
      distance: 1.8,
    },
    insurance: ["Blue Cross", "Aetna", "Cigna", "Medicare", "Medicaid"],
    nextAvailable: "In 3 weeks",
    sessionTypes: ["in-person", "video"],
    price: 175,
    bio: "Dr. Wilson is a trauma specialist with extensive experience treating PTSD and complex trauma. He uses evidence-based approaches including EMDR and trauma-focused CBT to help clients process traumatic experiences and develop resilience.",
    areas: ["Trauma", "PTSD", "Anxiety", "Depression", "Grief & Loss"],
    availability: {
      monday: ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"],
      tuesday: ["10:00 AM", "11:00 AM", "1:00 PM", "4:00 PM"],
      wednesday: ["9:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"],
      thursday: ["10:00 AM", "1:00 PM", "3:00 PM", "4:00 PM"],
      friday: ["9:00 AM", "10:00 AM", "2:00 PM"],
    },
  },
  {
    id: "5",
    name: "Dr. Olivia Thompson",
    title: "Licensed Psychologist",
    specialization: "Eating Disorders",
    approach: "Integrative & Health at Every Size",
    experience: "10 years",
    education: "Psy.D. in Clinical Psychology, NYU",
    languages: ["English", "Spanish", "Portuguese"],
    acceptingNewPatients: true,
    rating: 4.8,
    reviews: 87,
    image: "/placeholder.svg",
    location: {
      latitude: 40.7228,
      longitude: -74.016,
      address: "555 Wellness Way, New York, NY",
      distance: 2.7,
    },
    insurance: ["Blue Cross", "United Healthcare", "Aetna"],
    nextAvailable: "In 1 week",
    sessionTypes: ["in-person", "video"],
    price: 160,
    bio: "Dr. Rodriguez specializes in treating eating disorders and body image concerns using an integrative approach that emphasizes Health at Every Size principles. She creates a compassionate, non-judgmental space for healing.",
    areas: ["Eating Disorders", "Body Image", "Self-Esteem", "Anxiety", "Depression"],
    availability: {
      monday: ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"],
      tuesday: ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"],
      wednesday: ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"],
      thursday: ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"],
      friday: ["10:00 AM", "12:00 PM", "2:00 PM"],
    },
  },
  {
    id: "6",
    name: "Dr. Robert Kim",
    title: "Licensed Marriage and Family Therapist",
    specialization: "Relationship & Family Therapy",
    approach: "Emotionally-Focused Therapy",
    experience: "15 years",
    education: "Ph.D. in Marriage and Family Therapy, University of Washington",
    languages: ["English", "Korean"],
    acceptingNewPatients: true,
    rating: 4.7,
    reviews: 92,
    image: "/placeholder.svg",
    location: {
      latitude: 40.7328,
      longitude: -74.026,
      address: "789 Harmony Lane, Seattle, WA",
      distance: 3.5,
    },
    insurance: ["Premera", "Regence", "Cigna"],
    nextAvailable: "In 2 days",
    sessionTypes: ["in-person", "video"],
    price: 165,
    bio: "Dr. Kim is a licensed marriage and family therapist who helps couples and families improve communication, resolve conflicts, and strengthen relationships. He uses emotionally-focused therapy and systemic approaches.",
    areas: ["Relationship Issues", "Family Conflict", "Communication Problems", "Cultural Adjustment", "Parenting"],
    availability: {
      monday: ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"],
      tuesday: ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"],
      wednesday: ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"],
      thursday: ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"],
      friday: ["9:00 AM", "11:00 AM", "1:00 PM"],
    },
  },
]

const sessionTypes = [
  {
    id: "individual",
    title: "Individual Counseling",
    description: "One-on-one sessions with a licensed therapist tailored to your specific needs.",
    duration: "50 minutes",
    price: "$130-150",
    benefits: [
      "Personalized attention and treatment plan",
      "Confidential environment to discuss personal concerns",
      "Flexible scheduling options",
      "Choice of in-person or virtual sessions",
    ],
  },
  {
    id: "group",
    title: "Group Therapy",
    description: "Facilitated sessions with peers facing similar challenges in a supportive environment.",
    duration: "90 minutes",
    price: "$60-80",
    benefits: [
      "Learn from others' experiences and perspectives",
      "Develop social support networks",
      "Practice interpersonal skills in a safe setting",
      "More affordable than individual counseling",
    ],
  },
  {
    id: "crisis",
    title: "Crisis Intervention",
    description: "Immediate support for urgent mental health concerns.",
    duration: "As needed",
    price: "Covered by student health services",
    benefits: [
      "24/7 availability for emergencies",
      "Immediate strategies for managing acute distress",
      "Coordination with other campus resources",
      "Follow-up care planning",
    ],
  },
  {
    id: "assessment",
    title: "Psychological Assessment",
    description: "Comprehensive evaluation to better understand your mental health needs.",
    duration: "2-3 hours (multiple sessions)",
    price: "$200-300",
    benefits: [
      "In-depth understanding of psychological functioning",
      "Specific diagnosis when appropriate",
      "Personalized treatment recommendations",
      "Documentation for academic accommodations if needed",
    ],
  },
]

const faqs = [
  {
    question: "How do I know if I need counseling?",
    answer:
      "If you're experiencing persistent feelings of sadness, anxiety, or stress that interfere with your daily life, relationships, or academic performance, counseling may be beneficial. Even if you're just feeling overwhelmed or want to improve your mental well-being, talking to a professional can help.",
  },
  {
    question: "Is counseling confidential?",
    answer:
      "Yes, counseling services are confidential. Information shared during sessions is protected by law and ethical guidelines. The only exceptions are situations involving imminent danger to yourself or others, suspected abuse of children or vulnerable adults, or court orders.",
  },
  {
    question: "How long does counseling typically last?",
    answer:
      "The duration varies based on individual needs. Some students benefit from short-term counseling (4-8 sessions), while others may continue for a semester or longer. Your counselor will discuss recommendations during your initial sessions and adjust the plan as needed.",
  },
  {
    question: "Can I choose my counselor?",
    answer:
      "Yes, you can request a specific counselor when scheduling your appointment. We encourage finding a counselor you feel comfortable with, as the therapeutic relationship is an important factor in successful counseling.",
  },
  {
    question: "What if I need to cancel an appointment?",
    answer:
      "Please provide at least 24 hours notice for cancellations when possible. This allows us to offer the time slot to other students. Repeated no-shows may result in a cancellation fee or affect future scheduling options.",
  },
]

export default function Counseling() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("")
  const [selectedAvailability, setSelectedAvailability] = useState<string>("")
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [selectedCounselor, setSelectedCounselor] = useState<string | null>(null)
  const [showContactForm, setShowContactForm] = useState(false)
  const [selectedSessionType, setSelectedSessionType] = useState("video")
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [concerns, setConcerns] = useState("")
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null)
  const { toast } = useToast()

  // Filter therapists based on search and filters
  const filteredTherapists = therapists.filter((therapist) => {
    // Search term filter
    if (
      searchTerm &&
      !therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !therapist.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    // Specialty filter
    if (selectedSpecialty && !therapist.specialization.includes(selectedSpecialty)) {
      return false
    }

    // Availability filter
    if (selectedAvailability && !therapist.availability[selectedAvailability as keyof typeof therapist.availability]) {
      return false
    }

    // Location filter
    if (selectedLocation === "virtual" && !therapist.sessionTypes.includes("video")) {
      return false
    } else if (selectedLocation === "in-person" && !therapist.sessionTypes.includes("in-person")) {
      return false
    }

    return true
  })

  const handleTherapistSelect = (id: string) => {
    setSelectedTherapist(id === selectedTherapist ? null : id)
    setSelectedCounselor(id)
  }

  // Get available time slots for the selected date and therapist
  const getAvailableTimeSlots = () => {
    if (!selectedDate || !selectedCounselor) return []

    const therapist = therapists.find((t) => t.id === selectedCounselor)
    if (!therapist) return []

    const dayOfWeek = selectedDate.getDay()
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const dayName = dayNames[dayOfWeek]

    return therapist.availability[dayName as keyof typeof therapist.availability] || []
  }

  // Disable past dates and weekends
  const disabledDates = (date: Date) => {
    const today = startOfDay(new Date())
    return isBefore(date, today) || date.getDay() === 0 || date.getDay() === 6
  }

  const handleSchedule = () => {
    if (selectedDate && selectedTimeSlot && selectedCounselor) {
      const therapist = therapists.find((t) => t.id === selectedCounselor)

      if (!therapist) {
        toast({
          title: "Error",
          description: "Please select a therapist first.",
          variant: "destructive",
        })
        return
      }

      // Create appointment details
      const appointmentInfo = {
        therapist: therapist.name,
        date: format(selectedDate, "EEEE, MMMM d, yyyy"),
        time: selectedTimeSlot,
        type: selectedSessionType,
        concerns: concerns || "No specific concerns mentioned",
        confirmationCode: `APPT-${Math.floor(100000 + Math.random() * 900000)}`,
      }

      setAppointmentDetails(appointmentInfo)
      setShowSuccessDialog(true)
    } else {
      toast({
        title: "Incomplete information",
        description: "Please select a date, time, and therapist to schedule your appointment.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="max-w-7xl mx-auto mt-8 p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Counseling Services</h1>
          <p className="text-muted-foreground">
            Connect with licensed therapists and counselors who can help you navigate life's challenges.
          </p>
        </div>

        <Tabs defaultValue="find-therapist" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="find-therapist">Find a Therapist</TabsTrigger>
            <TabsTrigger value="schedule">Schedule a Session</TabsTrigger>
            <TabsTrigger value="resources">Counseling Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="find-therapist">
            <Card>
              <CardHeader>
                <CardTitle>Find Your Perfect Match</CardTitle>
                <CardDescription>Browse our network of licensed therapists and counselors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search by name or specialty..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Specialties">All Specialties</SelectItem>
                        <SelectItem value="Anxiety">Anxiety</SelectItem>
                        <SelectItem value="Depression">Depression</SelectItem>
                        <SelectItem value="Stress">Stress Management</SelectItem>
                        <SelectItem value="Academic">Academic Pressure</SelectItem>
                        <SelectItem value="Trauma">Trauma & PTSD</SelectItem>
                        <SelectItem value="Eating">Eating Disorders</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Any Day">Any Day</SelectItem>
                        <SelectItem value="monday">Monday</SelectItem>
                        <SelectItem value="tuesday">Tuesday</SelectItem>
                        <SelectItem value="wednesday">Wednesday</SelectItem>
                        <SelectItem value="thursday">Thursday</SelectItem>
                        <SelectItem value="friday">Friday</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Locations">All Locations</SelectItem>
                        <SelectItem value="virtual">Virtual Only</SelectItem>
                        <SelectItem value="in-person">In-Person Available</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Therapist List */}
                <div className="space-y-4">
                  {filteredTherapists.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No therapists found matching your criteria.</p>
                      <Button
                        variant="link"
                        onClick={() => {
                          setSearchTerm("")
                          setSelectedSpecialty("")
                          setSelectedAvailability("")
                          setSelectedLocation("")
                        }}
                      >
                        Clear all filters
                      </Button>
                    </div>
                  ) : (
                    filteredTherapists.map((therapist) => (
                      <Card
                        key={therapist.id}
                        className={`cursor-pointer hover:shadow-md transition-shadow ${selectedTherapist === therapist.id ? "border-primary" : ""}`}
                        onClick={() => handleTherapistSelect(therapist.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row gap-4">
                            <Avatar className="h-24 w-24">
                              <AvatarImage src={therapist.image} alt={therapist.name} />
                              <AvatarFallback>
                                {therapist.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                                <h3 className="text-xl font-semibold">{therapist.name}</h3>
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                                  <span className="font-medium">{therapist.rating}</span>
                                  <span className="text-muted-foreground ml-1">({therapist.reviews} reviews)</span>
                                </div>
                              </div>
                              <Badge className="mb-2">{therapist.specialization}</Badge>
                              <div className="flex items-center text-sm text-muted-foreground mb-2">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{therapist.location.address}</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>Next available: {therapist.nextAvailable}</span>
                              </div>
                            </div>
                          </div>

                          {selectedTherapist === therapist.id && (
                            <div className="mt-4 pt-4 border-t">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <h4 className="font-medium mb-2">About</h4>
                                  <p className="text-sm">{therapist.bio}</p>
                                </div>
                                <div className="space-y-3">
                                  <div>
                                    <h4 className="font-medium">Education</h4>
                                    <p className="text-sm">{therapist.education}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Languages</h4>
                                    <p className="text-sm">{therapist.languages.join(", ")}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Insurance</h4>
                                    <p className="text-sm">{therapist.insurance.join(", ")}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Session Fee</h4>
                                    <p className="text-sm">${therapist.price}/session</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-end">
                                <Button
                                  onClick={() => {
                                    setSelectedCounselor(therapist.id)
                                    document.querySelector('[data-value="schedule"]')?.click()
                                  }}
                                >
                                  Schedule with {therapist.name.split(" ")[0]}
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Select a Date & Time</CardTitle>
                  <CardDescription>Choose when you'd like to meet with your therapist</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="counselor">Select Counselor</Label>
                    <Select value={selectedCounselor || ""} onValueChange={setSelectedCounselor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a counselor" />
                      </SelectTrigger>
                      <SelectContent>
                        {therapists.map((therapist) => (
                          <SelectItem key={therapist.id} value={therapist.id}>
                            {therapist.name} - {therapist.specialization}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    disabled={disabledDates}
                    initialFocus
                  />

                  {selectedDate && selectedCounselor && (
                    <div className="space-y-2">
                      <Label>Select Time</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {getAvailableTimeSlots().length > 0 ? (
                          getAvailableTimeSlots().map((slot) => (
                            <Button
                              key={slot}
                              type="button"
                              variant={selectedTimeSlot === slot ? "default" : "outline"}
                              className="w-full"
                              onClick={() => setSelectedTimeSlot(slot)}
                            >
                              {slot}
                            </Button>
                          ))
                        ) : (
                          <p className="col-span-3 text-center text-muted-foreground">
                            No available time slots for this date. Please select another date.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Session Details</CardTitle>
                  <CardDescription>Tell us about your needs for this session</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Session Type</Label>
                    <RadioGroup
                      value={selectedSessionType}
                      onValueChange={setSelectedSessionType}
                      className="flex gap-4"
                    >
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
                    <Label htmlFor="concerns">Primary Concerns (Optional)</Label>
                    <Textarea
                      id="concerns"
                      placeholder="Briefly describe what you'd like to discuss in your session"
                      value={concerns}
                      onChange={(e) => setConcerns(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={handleSchedule}
                    disabled={!selectedDate || !selectedTimeSlot || !selectedCounselor}
                  >
                    Schedule Session
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resources">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>What to Expect</CardTitle>
                  <CardDescription>First time in therapy? Here's what to know</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Your first session is about getting to know each other</li>
                    <li>You control what you share and the pace of therapy</li>
                    <li>Therapy is a collaborative process</li>
                    <li>Progress takes time and commitment</li>
                    <li>Everything you share is confidential</li>
                  </ul>
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Insurance & Payments</CardTitle>
                  <CardDescription>Understanding coverage and costs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>We accept most major insurance plans and offer flexible payment options.</p>
                  <div className="space-y-2">
                    <h4 className="font-medium">Accepted Insurance</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Blue Cross</Badge>
                      <Badge variant="outline">Aetna</Badge>
                      <Badge variant="outline">Cigna</Badge>
                      <Badge variant="outline">United Healthcare</Badge>
                      <Badge variant="outline">Kaiser</Badge>
                      <Badge variant="outline">Medicare</Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Verify Insurance
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Crisis Support</CardTitle>
                  <CardDescription>Immediate help for urgent situations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="font-medium text-red-500">
                    If you're experiencing a life-threatening emergency, call 911 or go to your nearest emergency room.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-medium">24/7 Crisis Resources</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>National Suicide Prevention Lifeline: 988</li>
                      <li>Crisis Text Line: Text HOME to 741741</li>
                      <li>Veterans Crisis Line: 988, Press 1</li>
                    </ul>
                  </div>
                  <Button variant="destructive" className="w-full">
                    Get Crisis Help Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Appointment Scheduled Successfully!</AlertDialogTitle>
            <AlertDialogDescription>Your appointment has been confirmed. Here are the details:</AlertDialogDescription>
          </AlertDialogHeader>

          {appointmentDetails && (
            <div className="py-4 space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Therapist:</span>
                  <span>{appointmentDetails.therapist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Date:</span>
                  <span>{appointmentDetails.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Time:</span>
                  <span>{appointmentDetails.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Session Type:</span>
                  <span className="capitalize">{appointmentDetails.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Confirmation Code:</span>
                  <span className="font-mono">{appointmentDetails.confirmationCode}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                You will receive a confirmation email with these details. Please arrive 10 minutes before your scheduled
                time.
              </p>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Button
                onClick={() => {
                  setShowSuccessDialog(false)
                  // Reset form
                  setSelectedDate(new Date())
                  setSelectedTimeSlot(null)
                  setConcerns("")
                }}
              >
                Done
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

