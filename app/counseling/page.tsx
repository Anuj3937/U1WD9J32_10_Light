"use client"

import { useState } from "react"
import { Nav } from "@/components/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScheduleSession } from "@/components/counseling/schedule-session"
import { Clock, MapPin, MessageSquare, Phone, Star, Video } from 'lucide-react'

const counselors = [
  {
    id: "1",
    name: "Dr. Emily Johnson",
    title: "Clinical Psychologist",
    specialization: "Anxiety & Depression",
    approach: "Cognitive Behavioral Therapy (CBT)",
    experience: "12 years",
    education: "Ph.D. in Clinical Psychology, Stanford University",
    languages: ["English", "Spanish"],
    rating: 4.9,
    reviews: 124,
    image: "/placeholder.svg",
    availability: {
      nextAvailable: "Tomorrow",
      schedule: "Mon-Fri, 9AM-5PM",
    },
    sessionTypes: ["in-person", "video"],
    price: 150,
    bio: "Dr. Johnson specializes in helping students manage anxiety and depression through evidence-based approaches. Her warm and empathetic style creates a safe space for exploring challenges and developing effective coping strategies.",
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
    rating: 4.8,
    reviews: 98,
    image: "/placeholder.svg",
    availability: {
      nextAvailable: "Today",
      schedule: "Mon-Thu, 10AM-6PM",
    },
    sessionTypes: ["video"],
    price: 130,
    bio: "Dr. Lee helps students develop practical stress management techniques through mindfulness practices. He specializes in academic stress and performance anxiety, with a focus on balancing achievement with well-being.",
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
    rating: 4.7,
    reviews: 156,
    image: "/placeholder.svg",
    availability: {
      nextAvailable: "In 2 days",
      schedule: "Tue-Sat, 11AM-7PM",
    },
    sessionTypes: ["in-person", "video"],
    price: 140,
    bio: "Dr. Thompson specializes in helping high-achieving students navigate academic pressure and prevent burnout. Her practical, solution-focused approach helps students develop sustainable study habits and self-care practices.",
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
  const [selectedCounselor, setSelectedCounselor] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [showContactForm, setShowContactForm] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="max-w-7xl mx-auto mt-8 p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Counseling Services</h1>
          <p className="text-muted-foreground">
            Connect with licensed mental health professionals for personalized support and guidance.
          </p>
        </div>

        <Tabs defaultValue="services" className="space-y-8">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="counselors">Our Counselors</TabsTrigger>
            <TabsTrigger value="schedule">Schedule a Session</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sessionTypes.map((type) => (
                <Card key={type.id}>
                  <CardHeader>
                    <CardTitle>{type.title}</CardTitle>
                    <CardDescription>{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="font-medium">Duration:</span>
                        <span>{type.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Price:</span>
                        <span>{type.price}</span>
                      </div>
                      <div className="space-y-2">
                        <span className="font-medium">Benefits:</span>
                        <ul className="list-disc pl-5 space-y-1">
                          {type.benefits.map((benefit, index) => (
                            <li key={index} className="text-sm">{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        document.getElementById("schedule-tab")?.click();
                      }}
                    >
                      Schedule {type.title}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Insurance & Payment Options</CardTitle>
                <CardDescription>We strive to make mental health care accessible to all students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Accepted Insurance Plans</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Student Health Insurance Plan (SHIP)</li>
                      <li>Blue Cross Blue Shield</li>
                      <li>Aetna Student Health</li>
                      <li>United Healthcare Student Resources</li>
                      <li>Cigna</li>
                      <li>Kaiser Permanente</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Additional Payment Options</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Sliding scale fees based on financial need</li>
                      <li>Student assistance fund for uninsured students</li>
                      <li>Payment plans available</li>
                      <li>Health Savings Account (HSA) eligible</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Counselors Tab */}
          <TabsContent value="counselors" className="space-y-6">
            {counselors.map((counselor) => (
              <Card key={counselor.id} className="overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3 p-6 flex flex-col items-center justify-center bg-muted/30">
                    <Avatar className="w-32 h-32 mb-4">
                      <AvatarImage src={counselor.image} alt={counselor.name} />
                      <AvatarFallback>{counselor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold text-center">{counselor.name}</h3>
                    <p className="text-center text-muted-foreground mb-2">{counselor.title}</p>
                    <div className="flex items-center mb-4">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 font-medium">{counselor.rating}</span>
                      <span className="ml-1 text-muted-foreground">({counselor.reviews} reviews)</span>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Badge variant="outline">{counselor.specialization}</Badge>
                      {counselor.languages.map(lang => (
                        <Badge key={lang} variant="secondary">{lang}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold">About</h4>
                        <p className="text-sm">{counselor.bio}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold">Approach</h4>
                          <p className="text-sm">{counselor.approach}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Experience</h4>
                          <p className="text-sm">{counselor.experience}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Education</h4>
                          <p className="text-sm">{counselor.education}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Availability</h4>
                          <p className="text-sm">Next available: {counselor.availability.nextAvailable}</p>
                          <p className="text-sm">{counselor.availability.schedule}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {counselor.sessionTypes.includes('video') && (
                          <Badge className="flex items-center gap-1">
                            <Video className="h-3 w-3" />
                            Video Sessions
                          </Badge>
                        )}
                        {counselor.sessionTypes.includes('in-person') && (
                          <Badge className="flex items-center gap-1" variant="outline">
                            <MapPin className="h-3 w-3" />
                            In-Person
                          </Badge>
                        )}
                        <Badge variant="secondary">${counselor.price}/session</Badge>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button 
                          onClick={() => {
                            setSelectedCounselor(counselor.id);
                            document.getElementById("schedule-tab")?.click();
                          }}
                        >
                          Schedule Session
                        </Button>
                        <Button variant="outline">View Full Profile</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6" id="schedule-tab">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <ScheduleSession preselectedCounselor={selectedCounselor} />
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Us</CardTitle>
                    <CardDescription>Need help scheduling or have questions?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>(555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>counseling@mindfulstudent.edu</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Office Hours: Mon-Fri, 9AM-5PM</span>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-2"
                      onClick={() => setShowContactForm(!showContactForm)}
                    >
                      Send a Message
                    </Button>
                  </CardContent>
                </Card>

                {showContactForm && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>Send a Message</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="name">Name</label>
                          <Input id="name" placeholder="Your name" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email">Email</label>
                          <Input id="email" type="email" placeholder="Your email" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="message">Message</label>
                          <Textarea id="message" placeholder="How can we help you?" className="min-h-[100px]" />
                        </div>
                        <Button className="w-full">Send Message</Button>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Find answers to common questions about our counseling services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-semibold">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                    {index < faqs.length - 1 && <hr className="my-4" />}
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Still have questions? Contact our counseling center at{" "}
                  <a href="mailto:counseling@mindfulstudent.edu" className="text-primary hover:underline">
                    counseling@mindfulstudent.edu
                  </a>{" "}
                  or call (555) 123-4567.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}