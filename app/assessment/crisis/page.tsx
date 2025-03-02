"use client"

import { useState } from "react"
import { Nav } from "@/components/nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Phone, MessageSquare, AlertTriangle } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const emergencyQuestions = [
  {
    id: "crisis1",
    text: "Are you having thoughts of harming yourself or others?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
    requiresImmediate: "yes",
  },
  {
    id: "crisis2",
    text: "Do you feel safe in your current environment?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
    requiresImmediate: "no",
  },
  // Add more crisis assessment questions
]

export default function CrisisAssessment() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showEmergencyContact, setShowEmergencyContact] = useState(false)

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))

    // Check if any answers require immediate attention
    const requiresImmediate = emergencyQuestions.some((q) => answers[q.id] === q.requiresImmediate)

    setShowEmergencyContact(requiresImmediate)
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="max-w-4xl mx-auto mt-8 p-4">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Crisis Support Available</AlertTitle>
          <AlertDescription>
            If you're experiencing a mental health emergency, immediate help is available. Call emergency services or
            our crisis hotline.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contacts</CardTitle>
              <CardDescription>24/7 support available</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" size="lg">
                <Phone className="mr-2 h-4 w-4" />
                Call Crisis Hotline
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                <MessageSquare className="mr-2 h-4 w-4" />
                Text Crisis Line
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Assessment</CardTitle>
              <CardDescription>Help us understand how to best support you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {emergencyQuestions.map((question) => (
                <div key={question.id} className="space-y-2">
                  <p className="font-medium">{question.text}</p>
                  <RadioGroup value={answers[question.id]} onValueChange={(value) => handleAnswer(question.id, value)}>
                    {question.options.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                        <Label htmlFor={`${question.id}-${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}

              <div className="space-y-2">
                <Label htmlFor="situation">Describe your situation (optional)</Label>
                <Textarea id="situation" placeholder="Tell us what's troubling you..." className="min-h-[100px]" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Get Immediate Support</Button>
            </CardFooter>
          </Card>
        </div>

        {showEmergencyContact && (
          <Alert className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Please Contact Emergency Services</AlertTitle>
            <AlertDescription>
              Based on your responses, we strongly recommend speaking with a crisis counselor immediately. Our crisis
              hotline is available 24/7.
            </AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  )
}

