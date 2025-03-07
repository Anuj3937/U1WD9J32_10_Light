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
import { Progress } from "@/components/ui/progress"

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
        {/* Story progress indicator */}
        <div className="mb-4 flex items-center gap-2">
          <div className="flex-1 h-1 bg-muted overflow-hidden rounded-full">
            <div
              className="h-full bg-primary"
              style={{
                width: `${(Object.keys(story).indexOf(currentScene) / (Object.keys(story).length - 1)) * 100}%`,
                transition: "width 0.5s ease-in-out",
              }}
            ></div>
          </div>
          <span className="text-sm text-muted-foreground">
            {Math.round((Object.keys(story).indexOf(currentScene) / (Object.keys(story).length - 1)) * 100)}%
          </span>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{scene.title}</CardTitle>
                <CardDescription>Interactive Story Experience</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                    <path d="M3 3v5h5"></path>
                  </svg>
                  <span className="ml-1">Restart</span>
                </Button>
                <Button variant="ghost" size="sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                  <span className="ml-1">Journal</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {scene.image && (
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <img src={scene.image || "/placeholder.svg"} alt="Scene" className="object-cover w-full h-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            )}
            <p className="text-lg">{scene.description}</p>

            {/* Character emotions visualization */}
            {currentScene !== "end" && (
              <div className="flex justify-center gap-4 py-2">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xl">😊</span>
                  </div>
                  <span className="text-xs mt-1">Confidence</span>
                  <span className="text-sm font-medium">{metrics.confidence}/10</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xl">😰</span>
                  </div>
                  <span className="text-xs mt-1">Anxiety</span>
                  <span className="text-sm font-medium">{metrics.anxiety}/10</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xl">👥</span>
                  </div>
                  <span className="text-xs mt-1">Social</span>
                  <span className="text-sm font-medium">{metrics.socialComfort}/10</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xl">💪</span>
                  </div>
                  <span className="text-xs mt-1">Resilience</span>
                  <span className="text-sm font-medium">{metrics.resilience}/10</span>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="w-full space-y-2">
              {scene.choices.map((choice, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start h-auto p-4 hover:bg-muted transition-colors"
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
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Anxiety Management</span>
                        <span>{metrics.anxiety}/10</span>
                      </div>
                      <Progress value={metrics.anxiety * 10} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Self-Confidence</span>
                        <span>{metrics.confidence}/10</span>
                      </div>
                      <Progress value={metrics.confidence * 10} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Social Comfort</span>
                        <span>{metrics.socialComfort}/10</span>
                      </div>
                      <Progress value={metrics.socialComfort * 10} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Resilience</span>
                        <span>{metrics.resilience}/10</span>
                      </div>
                      <Progress value={metrics.resilience * 10} className="h-2" />
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

