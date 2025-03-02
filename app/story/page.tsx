"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Nav } from "@/components/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type StoryChoice = {
  text: string
  impact: {
    anxiety: number
    confidence: number
    socialComfort: number
    resilience: number
  }
  nextScene: string
}

type StoryScene = {
  id: string
  title: string
  description: string
  image?: string
  choices: StoryChoice[]
}

const story: Record<string, StoryScene> = {
  start: {
    id: "start",
    title: "The First Day",
    description: `You're standing at the entrance of your new university. The campus is bustling with students, 
    and you can feel the mix of excitement and nervousness in your stomach. What do you do first?`,
    image: "/placeholder.svg",
    choices: [
      {
        text: "Find a quiet spot to gather your thoughts and plan your day",
        impact: { anxiety: -1, confidence: 1, socialComfort: 0, resilience: 1 },
        nextScene: "quiet_spot",
      },
      {
        text: "Join a group of students who seem to be heading to orientation",
        impact: { anxiety: 1, confidence: 1, socialComfort: 2, resilience: 0 },
        nextScene: "orientation",
      },
      {
        text: "Ask a staff member for directions to your first class",
        impact: { anxiety: 0, confidence: 1, socialComfort: 1, resilience: 1 },
        nextScene: "directions",
      },
    ],
  },
  quiet_spot: {
    id: "quiet_spot",
    title: "A Moment of Peace",
    description: `You find a peaceful spot under a tree. As you sit there, you notice another student 
    sitting alone nearby, looking somewhat lost.`,
    image: "/placeholder.svg",
    choices: [
      {
        text: "Invite them to join you and share experiences",
        impact: { anxiety: 1, confidence: 2, socialComfort: 2, resilience: 1 },
        nextScene: "end",
      },
      {
        text: "Continue with your planning, focusing on your goals",
        impact: { anxiety: -1, confidence: 1, socialComfort: -1, resilience: 0 },
        nextScene: "end",
      },
    ],
  },
  orientation: {
    id: "orientation",
    title: "Group Orientation",
    description: "You join the group heading to orientation. Everyone seems just as nervous as you.",
    image: "/placeholder.svg",
    choices: [
      {
        text: "Introduce yourself to someone nearby",
        impact: { anxiety: 1, confidence: 2, socialComfort: 2, resilience: 1 },
        nextScene: "end",
      },
      {
        text: "Listen quietly and observe",
        impact: { anxiety: -1, confidence: 0, socialComfort: 0, resilience: 1 },
        nextScene: "end",
      },
    ],
  },
  directions: {
    id: "directions",
    title: "Finding Your Way",
    description: "A friendly staff member helps you with directions.",
    image: "/placeholder.svg",
    choices: [
      {
        text: "Thank them and head to class early",
        impact: { anxiety: -1, confidence: 1, socialComfort: 0, resilience: 1 },
        nextScene: "end",
      },
      {
        text: "Ask them about student support services",
        impact: { anxiety: 0, confidence: 1, socialComfort: 1, resilience: 2 },
        nextScene: "end",
      },
    ],
  },
  end: {
    id: "end",
    title: "Journey's End",
    description: "You've completed your first challenge!",
    image: "/placeholder.svg",
    choices: [],
  },
}

export default function StoryPage() {
  const [currentScene, setCurrentScene] = useState<string>("start")
  const [showResults, setShowResults] = useState(false)
  const [metrics, setMetrics] = useState({
    anxiety: 5,
    confidence: 5,
    socialComfort: 5,
    resilience: 5,
  })
  const [choices, setChoices] = useState<string[]>([])
  const router = useRouter()

  const handleChoice = (choice: StoryChoice) => {
    // Update metrics based on choice impact
    setMetrics((prev) => ({
      anxiety: Math.max(0, Math.min(10, prev.anxiety + choice.impact.anxiety)),
      confidence: Math.max(0, Math.min(10, prev.confidence + choice.impact.confidence)),
      socialComfort: Math.max(0, Math.min(10, prev.socialComfort + choice.impact.socialComfort)),
      resilience: Math.max(0, Math.min(10, prev.resilience + choice.impact.resilience)),
    }))

    // Track choices
    setChoices((prev) => [...prev, choice.text])

    // Move to next scene or show results
    if (choice.nextScene === "end") {
      setShowResults(true)
    } else {
      setCurrentScene(choice.nextScene)
    }
  }

  const scene = story[currentScene]

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="max-w-4xl mx-auto mt-8 p-4">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{scene.title}</CardTitle>
            <CardDescription>Interactive Story Experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {scene.image && (
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <img src={scene.image || "/placeholder.svg"} alt="Scene" className="object-cover w-full h-full" />
              </div>
            )}
            <p className="text-lg">{scene.description}</p>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="w-full space-y-2">
              {scene.choices.map((choice, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start h-auto p-4"
                  onClick={() => handleChoice(choice)}
                >
                  {choice.text}
                </Button>
              ))}
            </div>
          </CardFooter>
        </Card>

        <AlertDialog open={showResults}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Your Story Insights</AlertDialogTitle>
              <AlertDialogDescription>
                Based on your choices, here's what we've learned about your approach to challenges
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Emotional Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Anxiety Management</span>
                      <span>{metrics.anxiety}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Self-Confidence</span>
                      <span>{metrics.confidence}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Social Comfort</span>
                      <span>{metrics.socialComfort}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Resilience</span>
                      <span>{metrics.resilience}/10</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics.anxiety > 7 && (
                      <p>Consider exploring anxiety management techniques in our resources section.</p>
                    )}
                    {metrics.confidence < 5 && <p>Working with a counselor could help build your self-confidence.</p>}
                    {metrics.socialComfort < 5 && (
                      <p>Join our community groups to practice social interactions in a safe space.</p>
                    )}
                    <div className="flex gap-4">
                      <Button onClick={() => window.location.reload()}>Try Another Story</Button>
                      <Button variant="outline" onClick={() => router.push("/resources")}>
                        View Resources
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  )
}

