"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Nav } from "@/components/nav"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
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
  video?: string
  question?: string
  choices: StoryChoice[]
}

const videoList = [
  "public/video1.mp4",
  "public/video2.mp4",
  "public/video1.mp4"
]

const getRandomVideo = (current?: string) => {
  // Choose a video from the list that is different from the current one
  let filtered = videoList
  if (current) {
    filtered = videoList.filter((video) => video !== current)
  }
  return filtered[Math.floor(Math.random() * filtered.length)]
}

const story: Record<string, StoryScene> = {
  start: {
    id: "start",
    title: "The First Day",
    description:
      "You're standing at the entrance of your new university. The campus is bustling with students, and you can feel the mix of excitement and nervousness in your stomach.",
    video: "/video1.mp4",
    question: "What was your first impression of the video?",
    choices: [
      {
        text: "Find a quiet spot to gather your thoughts",
        impact: { anxiety: -1, confidence: 1, socialComfort: 0, resilience: 1 },
        nextScene: "quiet_spot",
      },
      {
        text: "Join a group heading to orientation",
        impact: { anxiety: 1, confidence: 1, socialComfort: 2, resilience: 0 },
        nextScene: "orientation",
      },
      {
        text: "Ask for directions",
        impact: { anxiety: 0, confidence: 1, socialComfort: 1, resilience: 1 },
        nextScene: "directions",
      },
    ],
  },
  quiet_spot: {
    id: "quiet_spot",
    title: "A Moment of Peace",
    description:
      "You find a peaceful spot away from the crowd. A reflective video plays, inviting introspection.",
    video: "/video2.mp4",
    question: "How did the reflective video make you feel?",
    choices: [
      {
        text: "Invite someone to join you",
        impact: { anxiety: 1, confidence: 2, socialComfort: 2, resilience: 1 },
        nextScene: "end",
      },
      {
        text: "Enjoy the solitude and think quietly",
        impact: { anxiety: -1, confidence: 1, socialComfort: -1, resilience: 0 },
        nextScene: "end",
      },
    ],
  },
  orientation: {
    id: "orientation",
    title: "Group Orientation",
    description:
      "You join the group heading to orientation while a dynamic video on social connections plays.",
    video: "/video3.mp4",
    question: "Did the dynamic video encourage you to interact?",
    choices: [
      {
        text: "Introduce yourself to someone",
        impact: { anxiety: 1, confidence: 2, socialComfort: 2, resilience: 1 },
        nextScene: "end",
      },
      {
        text: "Just observe quietly",
        impact: { anxiety: -1, confidence: 0, socialComfort: 0, resilience: 1 },
        nextScene: "end",
      },
    ],
  },
  directions: {
    id: "directions",
    title: "Finding Your Way",
    description:
      "A campus guide video is playing while a staff member assists you with directions.",
    video: "/video1.mp4",
    question: "Was the guide video helpful in directing you?",
    choices: [
      {
        text: "Thank them and head to class early",
        impact: { anxiety: -1, confidence: 1, socialComfort: 0, resilience: 1 },
        nextScene: "end",
      },
      {
        text: "Ask for additional support information",
        impact: { anxiety: 0, confidence: 1, socialComfort: 1, resilience: 2 },
        nextScene: "end",
      },
    ],
  },
  end: {
    id: "end",
    title: "Journey's End",
    description:
      "You've completed your challenge! Review your insights into your emotional metrics.",
    choices: [],
  },
}

export default function StoryPage() {
  // Manage state for the current scene, metrics, selected choices, video, and playback rate.
  const [currentScene, setCurrentScene] = useState<string>("start")
  const [showResults, setShowResults] = useState(false)
  const [metrics, setMetrics] = useState({
    anxiety: 5,
    confidence: 5,
    socialComfort: 5,
    resilience: 5,
  })
  const [choices, setChoices] = useState<string[]>([])
  const [currentVideo, setCurrentVideo] = useState<string>(
    story.start.video || getRandomVideo()
  )
  const [playbackRate, setPlaybackRate] = useState<number>(1)
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()

  const handleChoice = (choice: StoryChoice) => {
    // Update metrics based on the chosen option while keeping them within the range 0-10.
    setMetrics((prev) => ({
      anxiety: Math.max(0, Math.min(10, prev.anxiety + choice.impact.anxiety)),
      confidence: Math.max(0, Math.min(10, prev.confidence + choice.impact.confidence)),
      socialComfort: Math.max(0, Math.min(10, prev.socialComfort + choice.impact.socialComfort)),
      resilience: Math.max(0, Math.min(10, prev.resilience + choice.impact.resilience)),
    }))
    setChoices((prev) => [...prev, choice.text])
    if (choice.nextScene === "end") {
      setShowResults(true)
    } else {
      setCurrentScene(choice.nextScene)
    }
  }

  const handlePlaybackRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRate = parseFloat(e.target.value)
    setPlaybackRate(newRate)
    if (videoRef.current) {
      videoRef.current.playbackRate = newRate
    }
  }

  const handleFullscreen = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen()
    }
  }

  const resetStory = () => {
    // Reset the story state and pick a new video for a fresh playthrough.
    setCurrentScene("start")
    setShowResults(false)
    setMetrics({
      anxiety: 5,
      confidence: 5,
      socialComfort: 5,
      resilience: 5,
    })
    setChoices([])
    const newVideo = getRandomVideo(currentVideo)
    setCurrentVideo(newVideo)
  }

  // In active scenes, override the video property with the current video selection.
  const scene = {
    ...story[currentScene],
    video: currentScene !== "end" ? currentVideo : undefined,
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="max-w-4xl mx-auto mt-8 p-4">
        {/* Display story progress */}
        <div className="mb-4 flex items-center gap-2">
          <div className="flex-1 h-1 bg-muted overflow-hidden rounded-full">
            <div
              className="h-full bg-primary"
              style={{
                width: `${(Object.keys(story).indexOf(currentScene) /
                  (Object.keys(story).length - 1)) * 100}%`,
                transition: "width 0.5s ease-in-out",
              }}
            ></div>
          </div>
          <span className="text-sm text-muted-foreground">
            {Math.round(
              (Object.keys(story).indexOf(currentScene) /
                (Object.keys(story).length - 1)) *
                100
            )}
            %
          </span>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{scene.title}</CardTitle>
                <CardHeader>
                  <p>Interactive Story Experience</p>
                </CardHeader>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={resetStory}>
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
                <Button variant="ghost" size="sm" onClick={resetStory}>
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
                  <span className="ml-1">Try Another Story</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {scene.video && (
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  src={scene.video}
                  className="object-cover w-full h-full"
                  controls
                  style={{ maxHeight: "500px" }}
                />
                <div className="flex gap-2 mt-2">
                  <select value={playbackRate} onChange={handlePlaybackRateChange}>
                    <option value={0.5}>0.5x</option>
                    <option value={1}>1x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2}>2x</option>
                  </select>
                  <Button variant="outline" size="sm" onClick={handleFullscreen}>
                    Fullscreen
                  </Button>
                </div>
              </div>
            )}
            {scene.question && <p className="text-lg">{scene.question}</p>}
            <p className="text-lg">{scene.description}</p>
            {currentScene !== "end" && (
              <div className="flex justify-center gap-4 py-2">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xl">😊</span>
                  </div>
                  <span className="text-xs mt-1">Confidence</span>
                  <span className="text-sm font-medium">
                    {metrics.confidence}/10
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xl">😰</span>
                  </div>
                  <span className="text-xs mt-1">Anxiety</span>
                  <span className="text-sm font-medium">
                    {metrics.anxiety}/10
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xl">👥</span>
                  </div>
                  <span className="text-xs mt-1">Social</span>
                  <span className="text-sm font-medium">
                    {metrics.socialComfort}/10
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xl">💪</span>
                  </div>
                  <span className="text-xs mt-1">Resilience</span>
                  <span className="text-sm font-medium">
                    {metrics.resilience}/10
                  </span>
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
                Based on your choices, here's an evaluation of your emotional metrics.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Emotional Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Anxiety</span>
                      <span>{metrics.anxiety}/10</span>
                    </div>
                    <Progress value={metrics.anxiety * 10} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Confidence</span>
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics.anxiety > 7 && (
                      <p>
                        Consider exploring our anxiety management resources.
                      </p>
                    )}
                    {metrics.confidence < 5 && (
                      <p>
                        You might benefit from speaking with a counselor to boost your confidence.
                      </p>
                    )}
                    {metrics.socialComfort < 5 && (
                      <p>
                        Joining community groups could help improve your social comfort.
                      </p>
                    )}
                    <div className="flex gap-4">
                      <Button onClick={resetStory}>Try Another Story</Button>
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