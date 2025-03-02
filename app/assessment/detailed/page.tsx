"use client"

import { useState } from "react"
import { Nav } from "@/components/nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

// Define assessment categories and questions
const assessmentSections = [
  {
    id: "emotional",
    title: "Emotional Well-being",
    questions: [
      {
        id: "e1",
        text: "How often have you felt down, depressed, or hopeless in the past two weeks?",
        options: [
          { value: "0", label: "Not at all" },
          { value: "1", label: "Several days" },
          { value: "2", label: "More than half the days" },
          { value: "3", label: "Nearly every day" },
        ],
      },
      // Add more emotional questions
    ],
  },
  {
    id: "academic",
    title: "Academic Stress",
    questions: [
      {
        id: "a1",
        text: "How overwhelmed do you feel by your academic workload?",
        options: [
          { value: "0", label: "Not at all" },
          { value: "1", label: "Slightly" },
          { value: "2", label: "Moderately" },
          { value: "3", label: "Extremely" },
        ],
      },
      // Add more academic questions
    ],
  },
  {
    id: "social",
    title: "Social Support",
    questions: [
      {
        id: "s1",
        text: "How satisfied are you with your social connections and support system?",
        options: [
          { value: "3", label: "Very satisfied" },
          { value: "2", label: "Somewhat satisfied" },
          { value: "1", label: "Somewhat dissatisfied" },
          { value: "0", label: "Very dissatisfied" },
        ],
      },
      // Add more social questions
    ],
  },
]

export default function DetailedAssessment() {
  const [currentSection, setCurrentSection] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [notes, setNotes] = useState<string>("")
  const { toast } = useToast()

  const currentSectionData = assessmentSections[currentSection]
  const progress = (currentSection / assessmentSections.length) * 100

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    const unansweredQuestions = currentSectionData.questions.filter((q) => !answers[q.id])

    if (unansweredQuestions.length > 0) {
      toast({
        title: "Please answer all questions",
        description: "All questions in this section must be answered before proceeding.",
        variant: "destructive",
      })
      return
    }

    if (currentSection < assessmentSections.length - 1) {
      setCurrentSection(currentSection + 1)
    } else {
      // Calculate results and show recommendations
      handleComplete()
    }
  }

  const handleComplete = () => {
    // Here you would typically:
    // 1. Calculate scores for each category
    // 2. Generate personalized recommendations
    // 3. Save results to the user's profile
    // 4. Show appropriate resources and next steps

    // For now, we'll just redirect to a results page
    window.location.href = "/assessment/results"
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="max-w-4xl mx-auto mt-8 p-4">
        <div className="mb-6">
          <Progress value={progress} className="mb-2" />
          <p className="text-sm text-muted-foreground">
            Section {currentSection + 1} of {assessmentSections.length}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{currentSectionData.title}</CardTitle>
            <CardDescription>Please answer honestly for the most accurate assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentSectionData.questions.map((question) => (
              <div key={question.id} className="space-y-4">
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

            {currentSection === assessmentSections.length - 1 && (
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Share any additional thoughts or concerns..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentSection(currentSection - 1)}
              disabled={currentSection === 0}
            >
              Previous
            </Button>
            <Button onClick={handleNext}>
              {currentSection === assessmentSections.length - 1 ? "Complete" : "Next"}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

