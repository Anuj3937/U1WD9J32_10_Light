"use client"

import { useState, useRef } from "react"
import { Nav } from "@/components/nav"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Video, Square, Upload, Play } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Update the diary entry type
type DiaryEntry = {
  id: string
  type: "video" | "text"
  content: string
  mood: string
  timestamp: string
  thumbnail?: string
  insights?: {
    sentiment: string
    emotionalState: string
    recommendations: string[]
    suggestedResources: {
      type: "article" | "video" | "professional"
      title: string
      link: string
    }[]
    triggers?: string[]
    copingMechanisms?: string[]
  }
}

// Mock data for diary entries
const diaryEntries = [
  {
    id: "1",
    date: "2024-02-22",
    type: "video",
    thumbnail: "/placeholder.svg",
    mood: "Happy",
    analysis: {
      sentiment: "Positive",
      keywords: ["accomplishment", "progress", "motivation"],
      recommendations: [
        "Continue with current positive activities",
        "Share experiences with support group",
        "Document successful strategies",
      ],
    },
  },
  // Add more entries
]

// Mock data for saved videos
const savedVideos = [
  {
    id: 1,
    date: "2024-02-22",
    thumbnail: "/placeholder.svg",
    duration: "2:30",
    mood: "Happy",
    title: "Morning Reflection",
  },
  {
    id: 2,
    date: "2024-02-21",
    thumbnail: "/placeholder.svg",
    duration: "3:15",
    mood: "Anxious",
    title: "Evening Thoughts",
  },
  {
    id: 3,
    date: "2024-02-20",
    thumbnail: "/placeholder.svg",
    duration: "1:45",
    mood: "Calm",
    title: "Midday Check-in",
  },
]

export default function VideoDiary() {
  const router = useRouter()
  const [mode, setMode] = useState<"video" | "text">("video")
  const [isRecording, setIsRecording] = useState(false)
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const [mood, setMood] = useState("")
  const [textEntry, setTextEntry] = useState("")
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [showInsights, setShowInsights] = useState(false)
  const [currentEntry, setCurrentEntry] = useState<DiaryEntry | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" })
        const videoURL = URL.createObjectURL(blob)
        setRecordedVideo(videoURL)
        if (videoRef.current) {
          videoRef.current.srcObject = null
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      const tracks = videoRef.current?.srcObject as MediaStream
      tracks?.getTracks().forEach((track) => track.stop())
      setIsRecording(false)
    }
  }

  // Function to generate insights
  const generateInsights = (entry: DiaryEntry) => {
    // In a real app, this would be an API call to an AI service
    return {
      sentiment: entry.mood === "great" || entry.mood === "good" ? "Positive" : "Needs Attention",
      emotionalState: entry.mood,
      recommendations: [
        "Practice daily mindfulness exercises",
        "Connect with supportive friends or family",
        "Consider scheduling a counseling session",
      ],
      suggestedResources: [
        {
          type: "video",
          title: "5-Minute Mindfulness Exercise",
          link: "/resources#mindfulness",
        },
        {
          type: "professional",
          title: "Schedule a Session",
          link: "/counseling",
        },
      ],
      triggers: ["Academic pressure", "Social situations"],
      copingMechanisms: ["Deep breathing", "Journaling", "Exercise"],
    }
  }

  const handleSubmit = () => {
    if ((mode === "video" && recordedVideo) || (mode === "text" && textEntry)) {
      // Save the video entry
      const videoEntry = {
        id: crypto.randomUUID(),
        title: `Diary Entry - ${new Date().toLocaleDateString()}`,
        date: new Date().toISOString(),
        duration: "2:30", // You would calculate this from the actual video
        mood,
        videoUrl: recordedVideo!,
        thumbnail: "/placeholder.svg", // You would generate this from the video
        insights: generateInsights({ mood, content: textEntry }),
      }

      // Reset form and show insights
      setRecordedVideo(null)
      setTextEntry("")
      setMood("")
      setCurrentEntry(videoEntry)
      setShowInsights(true)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="max-w-7xl mx-auto mt-8 p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Video Diary</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Video className="w-4 h-4 mr-2" />
                View Saved Videos
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Your Video History</SheetTitle>
                <SheetDescription>Browse through your previous diary entries</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {savedVideos.map((video) => (
                  <Card key={video.id} className="cursor-pointer hover:bg-accent">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="relative w-32 h-24">
                          <img
                            src={video.thumbnail || "/placeholder.svg"}
                            alt={video.title}
                            className="rounded-md object-cover w-full h-full"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-md">
                            <Play className="w-8 h-8 text-white" />
                          </div>
                          <span className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                            {video.duration}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{video.title}</h3>
                          <p className="text-sm text-muted-foreground">{video.date}</p>
                          <div className="flex items-center mt-2">
                            <span className="text-sm bg-secondary px-2 py-0.5 rounded-full">Mood: {video.mood}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Tabs defaultValue="record" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="record">New Entry</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="record">
            <Card>
              <CardHeader>
                <CardTitle>Daily Reflection</CardTitle>
                <CardDescription>Share how your day went through video or text</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 mb-4">
                  <Button variant={mode === "video" ? "default" : "outline"} onClick={() => setMode("video")}>
                    <Video className="mr-2 h-4 w-4" />
                    Video Entry
                  </Button>
                  <Button variant={mode === "text" ? "default" : "outline"} onClick={() => setMode("text")}>
                    <span className="mr-2">📝</span>
                    Text Entry
                  </Button>
                </div>

                {mode === "video" && (
                  <div className="space-y-4">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                      <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                      {recordedVideo && <video src={recordedVideo} className="w-full h-full object-cover" controls />}
                    </div>
                    <div className="flex justify-center gap-4">
                      {!isRecording && !recordedVideo && (
                        <Button onClick={startRecording}>
                          <Camera className="mr-2 h-4 w-4" />
                          Start Recording
                        </Button>
                      )}
                      {isRecording && (
                        <Button variant="destructive" onClick={stopRecording}>
                          <Square className="mr-2 h-4 w-4" />
                          Stop Recording
                        </Button>
                      )}
                      {recordedVideo && (
                        <Button variant="outline" onClick={() => setRecordedVideo(null)}>
                          Record Again
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {mode === "text" && (
                  <div className="space-y-4">
                    <div className="grid w-full gap-1.5">
                      <Label htmlFor="diary-entry">Your thoughts</Label>
                      <Textarea
                        id="diary-entry"
                        placeholder="How was your day? What's on your mind?"
                        value={textEntry}
                        onChange={(e) => setTextEntry(e.target.value)}
                        className="min-h-[200px]"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>How are you feeling?</Label>
                  <Select value={mood} onValueChange={setMood}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your mood" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="great">Great 😊</SelectItem>
                      <SelectItem value="good">Good 🙂</SelectItem>
                      <SelectItem value="okay">Okay 😐</SelectItem>
                      <SelectItem value="down">Down 😔</SelectItem>
                      <SelectItem value="stressed">Stressed 😰</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={(mode === "video" && !recordedVideo) || (mode === "text" && !textEntry) || !mood}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Save Entry
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {diaryEntries.map((entry) => (
                <Card key={entry.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{new Date(entry.date).toLocaleDateString()}</span>
                      {entry.type === "video" ? <Video className="h-4 w-4" /> : null}
                    </CardTitle>
                    <CardDescription>Mood: {entry.mood}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {entry.type === "video" && (
                      <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={entry.thumbnail || "/placeholder.svg"}
                          alt="Video thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>Your Mental Health Journey</CardTitle>
                <CardDescription>AI-powered insights from your diary entries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Mood Trends</CardTitle>
                    </CardHeader>
                    <CardContent>{/* Add mood trend visualization */}</CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Common Triggers</CardTitle>
                    </CardHeader>
                    <CardContent>{/* Add triggers analysis */}</CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Coping Strategies</CardTitle>
                    </CardHeader>
                    <CardContent>{/* Add recommended strategies */}</CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Insights Dialog */}
      <AlertDialog open={showInsights} onOpenChange={setShowInsights}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Entry Insights</AlertDialogTitle>
            <AlertDialogDescription>Here's what we've learned from your diary entry</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            {currentEntry?.insights && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Emotional Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium">Sentiment:</span> {currentEntry.insights.sentiment}
                        </div>
                        <div>
                          <span className="font-medium">Emotional State:</span> {currentEntry.insights.emotionalState}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Identified Patterns</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium">Triggers:</span>
                          <ul className="list-disc pl-4">
                            {currentEntry.insights.triggers?.map((trigger, i) => (
                              <li key={i}>{trigger}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <ul className="list-disc pl-4 space-y-2">
                        {currentEntry.insights.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                      <div className="flex gap-4">
                        <Button onClick={() => router.push("/resources")}>View Resources</Button>
                        <Button variant="outline" onClick={() => router.push("/counseling")}>
                          Schedule Session
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

