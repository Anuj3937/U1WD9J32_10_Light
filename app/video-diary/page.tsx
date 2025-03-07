"use client";

import { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import { Nav } from "@/components/nav";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Video, Square, Upload, Play } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Diary Entry Type
type DiaryEntry = {
  id: string;
  type: "video" | "text";
  content: string;
  mood: string;
  timestamp: string;
  thumbnail?: string;
  insights?: {
    sentiment: string;
    emotionalState: string;
    recommendations: string[];
    triggers?: string[];
    copingMechanisms?: string[];
  };
};

export default function VideoDiary() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [mode, setMode] = useState<"video" | "text">("video");
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [mood, setMood] = useState("");
  const [textEntry, setTextEntry] = useState("");
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [currentEmotion, setCurrentEmotion] = useState<string>(""); // Detected emotion
  const [showInsights, setShowInsights] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<DiaryEntry | null>(null);

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models"; // Path to face-api.js models
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };
    loadModels();
  }, []);

  // Start Recording Video
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const videoURL = URL.createObjectURL(blob);
        setRecordedVideo(videoURL);
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);

      detectEmotions(); // Start detecting emotions
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  // Stop Recording Video
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      const tracks = videoRef.current?.srcObject as MediaStream;
      tracks?.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  // Detect Emotions Using face-api.js
  const detectEmotions = async () => {
    if (!videoRef.current) return;

    const intervalId = setInterval(async () => {
      if (!videoRef.current || !isRecording) {
        clearInterval(intervalId);
        return;
      }

      const detectionsWithExpressions = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detectionsWithExpressions.length > 0) {
        // Get the most dominant emotion
        const emotions = detectionsWithExpressions[0].expressions;
        const dominantEmotion = Object.keys(emotions).reduce((a, b) =>
          emotions[a] > emotions[b] ? a : b
        );
        setCurrentEmotion(dominantEmotion); // Update current emotion
      }
    }, 500); // Detect every half second
  };

  // Generate Insights Based on Emotion and Mood
  const generateInsights = (entry: DiaryEntry) => ({
    sentiment:
      entry.mood === "great" || entry.mood === "good"
        ? "Positive"
        : "Needs Attention",
    emotionalState: currentEmotion || entry.mood,
    recommendations: [
      currentEmotion === "happy"
        ? "Keep up the positive activities!"
        : "Consider mindfulness exercises or talking to a friend.",
      "Document your thoughts in a journal.",
      currentEmotion === "sad" ? "Try some light physical activity." : "",
    ].filter(Boolean),
    triggers: ["Work stress", "Social interactions"],
    copingMechanisms: ["Deep breathing", "Journaling", "Exercise"],
  });

  // Handle Submission of Entry
  const handleSubmit = () => {
    if ((mode === "video" && recordedVideo) || (mode === "text" && textEntry)) {
      const newEntry: DiaryEntry = {
        id: crypto.randomUUID(),
        type: mode,
        content: mode === "text" ? textEntry : recordedVideo!,
        mood,
        timestamp: new Date().toISOString(),
        insights: generateInsights({ id: "", type: mode, content: "", mood }),
      };

      setEntries((prev) => [...prev, newEntry]);
      setRecordedVideo(null);
      setTextEntry("");
      setMood("");
      setCurrentEntry(newEntry);
      setShowInsights(true); // Show insights dialog
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="max-w-7xl mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-6">Video Diary</h1>

        <Card>
          <CardHeader>
            <CardTitle>Record Your Entry</CardTitle>
            <CardDescription>Share your thoughts and emotions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Button
                variant={mode === "video" ? "default" : "outline"}
                onClick={() => setMode("video")}
              >
                <Video className="mr-2 h-4 w-4" />
                Video Entry
              </Button>
              <Button
                variant={mode === "text" ? "default" : "outline"}
                onClick={() => setMode("text")}
              >
                📝 Text Entry
              </Button>
            </div>

            {mode === "video" && (
              <div className="space-y-4">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  {!recordedVideo ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={recordedVideo}
                      controls
                      className="w-full h-full object-cover"
                    />
                  )}
                  {isRecording && (
                    <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-md">
                      Detecting Emotion: {currentEmotion || "Loading..."}
                    </div>
                  )}
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
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setRecordedVideo(null)}
                      >
                        Record Again
                      </Button>
                      <Button onClick={handleSubmit}>Save Entry</Button>
                    </>
                  )}
                </div>
              </div>
            )}

            {mode === "text" && (
              <div className="space-y-4">
                <Label>Your thoughts</Label>
                <Textarea
                  placeholder="How was your day? What's on your mind?"
                  value={textEntry}
                  onChange={(e) => setTextEntry(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>
            )}

            {/* Mood Selection */}
            <div className="space-y-2 mt-4">
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

          {/* Save Button */}
          <CardFooter>
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={
                (mode === "video" && !recordedVideo) ||
                (mode === "text" && !textEntry) ||
                !mood
              }
            >
              Save Entry
            </Button>
          </CardFooter>
        </Card>

        {/* Insights Dialog */}
        {currentEntry && showInsights && (
          <AlertDialog open={showInsights} onOpenChange={setShowInsights}>
            <AlertDialogContent className="max-w-lg">
              <AlertDialogHeader>
                <AlertDialogTitle>Insights from Your Entry</AlertDialogTitle>
                <AlertDialogDescription>
                  Here's what we've learned:
                </AlertDialogDescription>
              </AlertDialogHeader>

              {/* Insights Content */}
              {currentEntry.insights && (
                <>
                  {/* Sentiment */}
                  <p>
                    <strong>Sentiment:</strong>{" "}
                    {currentEntry.insights.sentiment}
                  </p>

                  {/* Emotional State */}
                  <p>
                    <strong>Emotional State:</strong>{" "}
                    {currentEntry.insights.emotionalState}
                  </p>

                  {/* Recommendations */}
                  {currentEntry.insights.recommendations.length > 0 && (
                    <>
                      <p>
                        <strong>Recommendations:</strong>
                      </p>
                      <ul className="list-disc pl-6 space-y-1">
                        {currentEntry.insights.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </>
              )}
            </AlertDialogContent>
          </AlertDialog>
        )}
      </main>
    </div>
  );
}
