"use client"

import { useState } from "react"
import { Nav } from "@/components/nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const scenarios: { id: number; question: string; options: { text: string; value: number }[] }[] = [
  {
    id: 1,
    question: "Over the last 2 weeks, how often have you had little interest or pleasure in doing things?",
    options: [
      { text: "Not at all", value: 0 },
      { text: "Several days", value: 1 },
      { text: "More than half the days", value: 2 },
      { text: "Nearly every day", value: 3 },
    ],
  },
  {
    id: 2,
    question: "Over the last 2 weeks, how often have you been feeling down, depressed, or hopeless?",
    options: [
      { text: "Not at all", value: 0 },
      { text: "Several days", value: 1 },
      { text: "More than half the days", value: 2 },
      { text: "Nearly every day", value: 3 },
    ],
  },
  {
    id: 3,
    question: "Over the last 2 weeks, how often have you had trouble falling or staying asleep, or sleeping too much?",
    options: [
      { text: "Not at all", value: 0 },
      { text: "Several days", value: 1 },
      { text: "More than half the days", value: 2 },
      { text: "Nearly every day", value: 3 },
    ],
  },
  {
    id: 4,
    question: "Over the last 2 weeks, how often have you been feeling tired or having little energy?",
    options: [
      { text: "Not at all", value: 0 },
      { text: "Several days", value: 1 },
      { text: "More than half the days", value: 2 },
      { text: "Nearly every day", value: 3 },
    ],
  },
  {
    id: 5,
    question: "Over the last 2 weeks, how often have you had poor appetite or overeating?",
    options: [
      { text: "Not at all", value: 0 },
      { text: "Several days", value: 1 },
      { text: "More than half the days", value: 2 },
      { text: "Nearly every day", value: 3 },
    ],
  },
  {
    id: 6,
    question: "Over the last 2 weeks, how often have you been feeling bad about yourself - or that you are a failure or have let yourself or your family down?",
    options: [
      { text: "Not at all", value: 0 },
      { text: "Several days", value: 1 },
      { text: "More than half the days", value: 2 },
      { text: "Nearly every day", value: 3 },
    ],
  },
  {
    id: 7,
    question: "Over the last 2 weeks, how often have you had trouble concentrating on things, such as reading the newspaper or watching television?",
    options: [
      { text: "Not at all", value: 0 },
      { text: "Several days", value: 1 },
      { text: "More than half the days", value: 2 },
      { text: "Nearly every day", value: 3 },
    ],
  },
  {
    id: 8,
    question: "Over the last 2 weeks, how often have you been moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual?",
    options: [
      { text: "Not at all", value: 0 },
      { text: "Several days", value: 1 },
      { text: "More than half the days", value: 2 },
      { text: "Nearly every day", value: 3 },
    ],
  },
  {
    id: 9,
    question: "Over the last 2 weeks, how often have you had thoughts that you would be better off dead, or of hurting yourself?",
    options: [
      { text: "Not at all", value: 0 },
      { text: "Several days", value: 1 },
      { text: "More than half the days", value: 2 },
      { text: "Nearly every day", value: 3 },
    ],
  },
];


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
    const total = Object.values(answers).reduce((sum, value) => sum + value, 0);
    return total;
  };
  

  if (isComplete) {
    const score = calculateScore();
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <main className="max-w-4xl mx-auto mt-8 p-4">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Complete</CardTitle>
              <CardDescription>Here's your depression severity score</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">{score}</div>
                <div className="text-lg">
                  {score >= 20 && "Severe Depression"}
                  {score >= 15 && score < 20 && "Moderately Severe Depression"}
                  {score >= 10 && score < 15 && "Moderate Depression"}
                  {score >= 5 && score < 10 && "Mild Depression"}
                  {score >= 1 && score < 5 && "Minimal Depression"}
                  {score === 0 && "No Depression"}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Recommendations:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {score >= 20 && (
                    <>
                      <li>Seek immediate professional help from a mental health expert.</li>
                      <li>Consider therapy or counseling.</li>
                      <li>Follow a treatment plan as advised by your healthcare provider.</li>
                    </>
                  )}
                  {score >= 15 && score < 20 && (
                    <>
                      <li>Consult with a mental health professional for guidance.</li>
                      <li>Engage in stress management techniques.</li>
                      <li>Practice self-care activities regularly.</li>
                    </>
                  )}
                  {score >= 10 && score < 15 && (
                    <>
                      <li>Continue building healthy coping strategies.</li>
                      <li>Explore stress management resources.</li>
                      <li>Regularly practice mindfulness or meditation.</li>
                    </>
                  )}
                  {score >= 5 && score < 10 && (
                    <>
                      <li>Maintain a daily mood journal.</li>
                      <li>Engage in regular physical activity.</li>
                      <li>Consider seeking support from friends or family.</li>
                    </>
                  )}
                  {score >= 1 && score < 5 && (
                    <>
                      <li>Monitor your mood and symptoms.</li>
                      <li>Engage in activities you enjoy.</li>
                      <li>Stay connected with supportive people.</li>
                    </>
                  )}
                  {score === 0 && (
                    <>
                      <li>Maintain your current mental health practices.</li>
                      <li>Continue engaging in activities that promote well-being.</li>
                      <li>Stay connected with friends and family.</li>
                    </>
                  )}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentQuestion(0);
                  setAnswers({});
                  setIsComplete(false);
                }}
              >
                Retake Assessment
              </Button>
              <Button asChild>
                <a href="/resources">View Resources</a>
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    );
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
