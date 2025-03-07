"use client"

import { useState } from "react"
import { Nav } from "@/components/nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const scenarios = [
  {
    id: 1,
    question: "You have multiple assignments due this week and an upcoming exam. How do you handle this situation?",
    image: "/placeholder.svg?height=100&width=100",
    options: [
      { text: "I create a detailed schedule and prioritize tasks", value: 4 },
      { text: "I feel overwhelmed and have trouble starting", value: 1 },
      { text: "I work on whatever feels most urgent", value: 2 },
      { text: "I seek help from classmates or professors", value: 3 },
    ],
  },
  {
    id: 2,
    question: "You received a lower grade than expected on an important project. What's your typical reaction?",
    image: "/placeholder.svg?height=100&width=100",
    options: [
      { text: "I become very self-critical and discouraged", value: 1 },
      { text: "I analyze what went wrong and plan improvements", value: 4 },
      { text: "I avoid thinking about it", value: 2 },
      { text: "I discuss it with my professor for feedback", value: 3 },
    ],
  },
  {
    id: 3,
    question: "During social gatherings, you usually find yourself:",
    image: "/placeholder.svg?height=100&width=100",
    options: [
      { text: "Feeling anxious and wanting to leave", value: 1 },
      { text: "Enjoying conversations with a small group", value: 3 },
      { text: "Preferring to observe from a distance", value: 2 },
      { text: "Actively engaging with many people", value: 4 },
    ],
  },
  {
    id: 4,
    question: "When facing a personal challenge, your first instinct is to:",
    image: "/placeholder.svg?height=100&width=100",
    options: [
      { text: "Keep it to myself and try to handle it alone", value: 1 },
      { text: "Share with close friends or family", value: 4 },
      { text: "Distract myself with other activities", value: 2 },
      { text: "Seek professional guidance", value: 3 },
    ],
  },
  {
    id: 5,
    question: "How do you typically handle stress-induced sleep issues?",
    image: "/placeholder.svg?height=100&width=100",
    options: [
      { text: "I follow a consistent bedtime routine", value: 4 },
      { text: "I stay up late worrying", value: 1 },
      { text: "I use my phone/devices until I fall asleep", value: 2 },
      { text: "I try relaxation techniques", value: 3 },
    ],
  },
  {
    id: 6,
    question: "When you make a mistake in public, you typically:",
    image: "/placeholder.svg?height=100&width=100",
    options: [
      { text: "Feel extremely embarrassed and ruminate on it", value: 1 },
      { text: "Acknowledge it and move on", value: 4 },
      { text: "Avoid similar situations in the future", value: 2 },
      { text: "Use humor to diffuse the situation", value: 3 },
    ],
  },
  {
    id: 7,
    question: "During periods of high stress, your eating habits:",
    image: "/placeholder.svg?height=100&width=100",
    options: [
      { text: "Become irregular or I forget to eat", value: 1 },
      { text: "Remain consistent and balanced", value: 4 },
      { text: "I eat more than usual", value: 2 },
      { text: "I try to maintain healthy choices", value: 3 },
    ],
  },
  {
    id: 8,
    question: "When feeling overwhelmed with emotions, you usually:",
    image: "/placeholder.svg?height=100&width=100",
    options: [
      { text: "Practice mindfulness or meditation", value: 4 },
      { text: "Feel trapped by the emotions", value: 1 },
      { text: "Try to suppress the feelings", value: 2 },
      { text: "Express them through creative activities", value: 3 },
    ],
  },
  {
    id: 9,
    question: "In group projects, you typically find yourself:",
    image: "/placeholder.svg?height=100&width=100",
    options: [
      { text: "Taking the lead confidently", value: 4 },
      { text: "Feeling anxious about team dynamics", value: 1 },
      { text: "Following others' directions", value: 2 },
      { text: "Contributing but not leading", value: 3 },
    ],
  },
  {
    id: 10,
    question: "When thinking about the future, you most often:",
    image: "/placeholder.svg?height=100&width=100",
    options: [
      { text: "Feel optimistic and motivated", value: 4 },
      { text: "Experience anxiety and worry", value: 1 },
      { text: "Avoid thinking about it", value: 2 },
      { text: "Plan while managing expectations", value: 3 },
    ],
  },
]

export default function Assessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [isComplete, setIsComplete] = useState(false)

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))

    if (currentQuestion < scenarios.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setIsComplete(true)
    }
  }

  const calculateScore = () => {
    const total = Object.values(answers).reduce((sum, value) => sum + value, 0)
    return (total / (scenarios.length * 4)) * 100
  }

  if (isComplete) {
    const score = calculateScore()
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <main className="max-w-4xl mx-auto mt-8 p-4">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Complete</CardTitle>
              <CardDescription>Here's your mental wellness score</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">{Math.round(score)}%</div>
                <Progress value={score} className="w-full" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Recommendations:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {score < 50 && (
                    <>
                      <li>Consider scheduling a consultation with our counselors</li>
                      <li>Try our guided meditation exercises</li>
                      <li>Start a daily mood journal</li>
                    </>
                  )}
                  {score >= 50 && score < 75 && (
                    <>
                      <li>Continue building healthy coping strategies</li>
                      <li>Explore our stress management resources</li>
                      <li>Practice regular self-care activities</li>
                    </>
                  )}
                  {score >= 75 && (
                    <>
                      <li>Maintain your positive mental health practices</li>
                      <li>Share your strategies with peers</li>
                      <li>Consider becoming a peer mentor</li>
                    </>
                  )}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentQuestion(0)
                  setAnswers({})
                  setIsComplete(false)
                }}
              >
                Retake Assessment
              </Button>
              <Button asChild>
                <a href="/dashboard">View Dashboard</a>
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    )
  }

  const currentScenario = scenarios[currentQuestion]

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="max-w-4xl mx-auto mt-8 p-4">
        <div className="mb-4">
          <Progress value={(currentQuestion / scenarios.length) * 100} />
          <p className="text-sm text-muted-foreground mt-2">
            Question {currentQuestion + 1} of {scenarios.length}
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Mental Health Assessment</CardTitle>
            <CardDescription>Answer honestly for the most accurate results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={currentScenario.image} />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <p className="text-lg">{currentScenario.question}</p>
            </div>
            <div className="space-y-2">
              {currentScenario.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto p-4"
                  onClick={() => handleAnswer(currentScenario.id, option.value)}
                >
                  {option.text}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

