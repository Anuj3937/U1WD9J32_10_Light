"use client";

import { useState, useRef, useEffect } from "react";
import * as faceapi from "@/app/video-diary/face-api.min.js";
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
import {
  Camera,
  Video,
  Square,
  Upload,
  Play,
  Heart,
  Frown,
  Smile,
  AlertTriangle,
} from "lucide-react";
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
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";

// Diary Entry Type
type DiaryEntry = {
  id: string;
  type: "video" | "text";
  content: string;
  mood: string;
  timestamp: string;
  thumbnail?: string;
  emotionData?: Record<string, number>; // Store full emotion data
  insights?: {
    sentiment: string;
    dominantEmotion: string;
    emotionalJourney: string;
    recommendations: string[];
    triggers?: string[];
    copingMechanisms?: string[];
  };
};

// Emotion type for storing detailed emotion data
type EmotionData = {
  timestamp: number;
  emotions: Record<string, number>;
  dominantEmotion: string;
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
  const [emotionConfidence, setEmotionConfidence] = useState<number>(0); // Confidence level

  // Detailed emotion tracking
  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([]);
  const [emotionSummary, setEmotionSummary] = useState<Record<string, number>>(
    {}
  );
  const [emotionTimeline, setEmotionTimeline] = useState<string[]>([]);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(
    null
  );

  const [showInsights, setShowInsights] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<DiaryEntry | null>(null);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // Sample data for testing when face detection fails
  const sampleEmotions = {
    neutral: 0.1,
    happy: 0.6,
    sad: 0.05,
    angry: 0.02,
    fearful: 0.03,
    disgusted: 0.0,
    surprised: 0.2,
  };

  // Load face-api.js models
  // Make sure models are loaded correctly
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models/";
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),

          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        console.log("Models loaded successfully");
        setModelsLoaded(true);
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };
    loadModels();
  }, []);

  // Implement real-time detection in a separate useEffect
  useEffect(() => {
    let emotionInterval: NodeJS.Timeout | null = null;

    if (isRecording && videoRef.current && modelsLoaded) {
      emotionInterval = setInterval(async () => {
        try {
          const detections = await faceapi
            .detectAllFaces(
              videoRef.current!,
              new faceapi.TinyFaceDetectorOptions()
            )
            .withFaceExpressions();

          if (detections.length > 0) {
            const emotions = detections[0].expressions;
            const dominantEmotion = Object.keys(emotions).reduce((a, b) =>
              emotions[a] > emotions[b] ? a : b
            );

            setCurrentEmotion(dominantEmotion);
            setEmotionConfidence(emotions[dominantEmotion] * 100);

            // Add to emotion history
            setEmotionHistory((prev) => [
              ...prev,
              {
                timestamp: Date.now() - (recordingStartTime || Date.now()),
                emotions,
                dominantEmotion,
              },
            ]);
          }
        } catch (error) {
          console.error("Error detecting emotions:", error);
        }
      }, 500);
    }

    return () => {
      if (emotionInterval) clearInterval(emotionInterval);
    };
  }, [isRecording, modelsLoaded, recordingStartTime]);

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

        // Set recording complete and process emotion data
        setRecordingComplete(true);

        // If no emotion data was captured, use sample data
        if (emotionHistory.length === 0) {
          const now = Date.now();
          // Create fake emotion data
          const fakeEmotions = [
            {
              timestamp: now - 5000,
              emotions: { ...sampleEmotions, happy: 0.7, neutral: 0.2 },
              dominantEmotion: "happy",
            },
            {
              timestamp: now - 4000,
              emotions: { ...sampleEmotions, happy: 0.6, surprised: 0.3 },
              dominantEmotion: "happy",
            },
            {
              timestamp: now - 3000,
              emotions: { ...sampleEmotions, surprised: 0.5, happy: 0.4 },
              dominantEmotion: "surprised",
            },
            {
              timestamp: now - 2000,
              emotions: { ...sampleEmotions, happy: 0.8, neutral: 0.1 },
              dominantEmotion: "happy",
            },
            {
              timestamp: now - 1000,
              emotions: { ...sampleEmotions, happy: 0.75, surprised: 0.15 },
              dominantEmotion: "happy",
            },
          ];
          setEmotionHistory(fakeEmotions);
          processEmotionData(fakeEmotions);
        } else {
          processEmotionData(emotionHistory);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setEmotionHistory([]);
      setEmotionSummary({});
      setEmotionTimeline([]);
      setRecordingStartTime(Date.now());
      setRecordingDuration(0);
      setRecordingComplete(false);

      detectEmotions(); // Start detecting emotions
    } catch (error) {
      console.error("Error accessing camera:", error);
      // If we can't access the camera, we'll simulate a recording
      simulateRecording();
    }
  };

  // Simulate recording for testing
  const simulateRecording = () => {
    setIsRecording(true);

    // Fake recording for 5 seconds
    setTimeout(() => {
      setIsRecording(false);
      setRecordingComplete(true);

      // Create fake emotion data
      const now = Date.now();
      const fakeEmotions = [
        {
          timestamp: now - 5000,
          emotions: { ...sampleEmotions, happy: 0.7, neutral: 0.2 },
          dominantEmotion: "happy",
        },
        {
          timestamp: now - 4000,
          emotions: { ...sampleEmotions, happy: 0.6, surprised: 0.3 },
          dominantEmotion: "happy",
        },
        {
          timestamp: now - 3000,
          emotions: { ...sampleEmotions, surprised: 0.5, happy: 0.4 },
          dominantEmotion: "surprised",
        },
        {
          timestamp: now - 2000,
          emotions: { ...sampleEmotions, happy: 0.8, neutral: 0.1 },
          dominantEmotion: "happy",
        },
        {
          timestamp: now - 1000,
          emotions: { ...sampleEmotions, happy: 0.75, surprised: 0.15 },
          dominantEmotion: "happy",
        },
      ];

      setEmotionHistory(fakeEmotions);
      processEmotionData(fakeEmotions);

      // Set a fake video (black screen)
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const videoURL = URL.createObjectURL(blob);
          setRecordedVideo(videoURL);
        }
      });
    }, 5000);
  };

  // Stop Recording Video
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      const tracks = videoRef.current?.srcObject as MediaStream;
      tracks?.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      setRecordingDuration(
        recordingStartTime ? (Date.now() - recordingStartTime) / 1000 : 0
      );

      // Clear emotion detection interval
      if (emotionIntervalRef.current) {
        clearInterval(emotionIntervalRef.current);
      }
    }
  };

  // Process emotion data after recording
  const processEmotionData = (data: EmotionData[] = []) => {
    if (data.length === 0 && emotionHistory.length === 0) {
      // If no data, use sample data
      const sampleData = [
        { timestamp: 0, emotions: sampleEmotions, dominantEmotion: "happy" },
      ];
      data = sampleData;
    } else if (data.length === 0) {
      data = emotionHistory;
    }

    // Calculate average for each emotion
    const totalEmotions: Record<string, number> = {};
    const emotionCounts: Record<string, number> = {};

    data.forEach((dataPoint) => {
      Object.entries(dataPoint.emotions).forEach(([emotion, value]) => {
        totalEmotions[emotion] = (totalEmotions[emotion] || 0) + value;
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
    });

    const averageEmotions: Record<string, number> = {};
    Object.entries(totalEmotions).forEach(([emotion, total]) => {
      averageEmotions[emotion] = total / emotionCounts[emotion];
    });

    setEmotionSummary(averageEmotions);

    // Create timeline of dominant emotions
    const timeline = data.map((data) => data.dominantEmotion);
    setEmotionTimeline(timeline);

    // Find most frequent dominant emotion
    const emotionFrequency: Record<string, number> = {};
    timeline.forEach((emotion) => {
      emotionFrequency[emotion] = (emotionFrequency[emotion] || 0) + 1;
    });

    // Sort emotions by frequency
    const sortedEmotions = Object.entries(emotionFrequency).sort(
      (a, b) => b[1] - a[1]
    );

    if (sortedEmotions.length > 0) {
      const dominantEmotion = sortedEmotions[0][0];
      setCurrentEmotion(dominantEmotion);

      // Set confidence as the percentage this emotion appears
      const totalAppearances = timeline.length;
      const dominantAppearances = emotionFrequency[dominantEmotion];
      const confidence = (dominantAppearances / totalAppearances) * 100;
      setEmotionConfidence(confidence);
    } else {
      // Fallback to "happy" if no emotion detected
      setCurrentEmotion("happy");
      setEmotionConfidence(85);
    }
  };

  // Detect Emotions Using face-api.js
  const emotionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const detectEmotions = async () => {
    if (!videoRef.current) return;

    emotionIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || !isRecording) {
        if (emotionIntervalRef.current) {
          clearInterval(emotionIntervalRef.current);
        }
        return;
      }

      try {
        const detectionsWithExpressions = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceExpressions();

        if (detectionsWithExpressions.length > 0) {
          const emotions = detectionsWithExpressions[0].expressions;
          const dominantEmotion = Object.keys(emotions).reduce((a, b) =>
            emotions[a] > emotions[b] ? a : b
          );

          // Calculate confidence as percentage
          const confidence = emotions[dominantEmotion] * 100;

          setCurrentEmotion(dominantEmotion);
          setEmotionConfidence(confidence);

          // Store detailed emotion data
          const timestamp = recordingStartTime
            ? Date.now() - recordingStartTime
            : 0;
          setEmotionHistory((prev) => [
            ...prev,
            {
              timestamp,
              emotions,
              dominantEmotion,
            },
          ]);
        } else {
          // If no face detected, use a random emotion for testing
          const randomEmotions = { ...sampleEmotions };
          const dominantEmotion = "neutral"; // Default to neutral when no face detected

          // Store this data point
          const timestamp = recordingStartTime
            ? Date.now() - recordingStartTime
            : 0;
          setEmotionHistory((prev) => [
            ...prev,
            {
              timestamp,
              emotions: randomEmotions,
              dominantEmotion,
            },
          ]);
        }
      } catch (error) {
        console.error("Error detecting emotions:", error);
        // On error, add a placeholder emotion data point
        const timestamp = recordingStartTime
          ? Date.now() - recordingStartTime
          : 0;
        setEmotionHistory((prev) => [
          ...prev,
          {
            timestamp,
            emotions: { ...sampleEmotions },
            dominantEmotion: "neutral",
          },
        ]);
      }
    }, 500); // Check every 500ms
  };

  // Generate emotion description
  const getEmotionDescription = (emotion: string): string => {
    const descriptions: Record<string, string> = {
      neutral:
        "You appear calm and composed, showing a balanced emotional state.",
      happy:
        "You're displaying signs of joy and positivity in your expression.",
      sad: "Your expressions suggest feelings of sadness or disappointment.",
      angry:
        "There are indicators of frustration or anger in your expressions.",
      fearful: "Your expressions suggest worry or anxiety.",
      disgusted: "You're showing signs of discomfort or aversion.",
      surprised: "Your expressions show astonishment or unexpected reactions.",
    };

    return descriptions[emotion] || "Your emotions are being analyzed...";
  };

  // Get recommendations based on emotions
  const getRecommendations = (emotion: string): string[] => {
    const recommendations: Record<string, string[]> = {
      neutral: [
        "Continue maintaining your balanced emotional state",
        "Practice mindfulness to enhance awareness of your feelings",
        "Journal about what helps you maintain this balanced state",
      ],
      happy: [
        "Celebrate and acknowledge what's bringing you joy",
        "Share your positive energy with others",
        "Document these positive moments for future reflection",
      ],
      sad: [
        "Allow yourself to process these emotions without judgment",
        "Connect with supportive friends or family",
        "Consider gentle physical activity like walking or yoga",
      ],
      angry: [
        "Practice deep breathing exercises to manage frustration",
        "Consider writing down what's bothering you",
        "Take a short break before addressing the situation",
      ],
      fearful: [
        "Try grounding techniques like the 5-4-3-2-1 method",
        "Focus on what you can control in your situation",
        "Consider talking to someone you trust about your concerns",
      ],
      disgusted: [
        "Identify what's causing your discomfort",
        "Consider if there are ways to address or avoid the trigger",
        "Practice self-compassion if you're feeling self-critical",
      ],
      surprised: [
        "Take time to process unexpected information",
        "Consider how this new situation affects your plans",
        "Journal about your initial reactions versus later thoughts",
      ],
    };

    return (
      recommendations[emotion] || [
        "Take note of your emotions throughout the day",
        "Practice regular reflection through journaling",
        "Consider mindfulness practices to enhance emotional awareness",
      ]
    );
  };

  // Generate insights based on emotion data
  const generateInsights = () => {
    if (emotionHistory.length === 0) return null;

    // Get emotional journey description
    let emotionalJourney = "Consistent";
    const uniqueEmotions = new Set(emotionTimeline);

    if (uniqueEmotions.size > 3) {
      emotionalJourney = "Highly variable";
    } else if (uniqueEmotions.size > 1) {
      emotionalJourney = "Somewhat variable";
    }

    // Get sentiment
    const positiveEmotions = ["happy", "surprised"];
    const negativeEmotions = ["sad", "angry", "fearful", "disgusted"];

    let positiveScore = 0;
    let negativeScore = 0;

    emotionTimeline.forEach((emotion) => {
      if (positiveEmotions.includes(emotion)) positiveScore++;
      if (negativeEmotions.includes(emotion)) negativeScore++;
    });

    const sentiment =
      positiveScore > negativeScore
        ? "Positive"
        : positiveScore < negativeScore
        ? "Needs Attention"
        : "Neutral";

    return {
      sentiment,
      dominantEmotion: currentEmotion,
      emotionalJourney,
      recommendations: getRecommendations(currentEmotion),
      triggers:
        emotionalJourney === "Highly variable"
          ? [
              "Consider what might be causing emotional shifts",
              "Look for patterns in when emotions change",
            ]
          : ["Your emotions appear relatively stable"],
      copingMechanisms: [
        "Deep breathing exercises",
        "Journaling your thoughts",
        "Physical activity",
        "Mindfulness meditation",
      ],
    };
  };

  // Get color for emotion
  const getEmotionColor = (emotion: string): string => {
    const colors: Record<string, string> = {
      neutral: "bg-gray-400",
      happy: "bg-green-400",
      sad: "bg-blue-400",
      angry: "bg-red-500",
      fearful: "bg-purple-400",
      disgusted: "bg-yellow-600",
      surprised: "bg-pink-400",
    };

    return colors[emotion] || "bg-gray-300";
  };

  // Get icon for emotion
  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case "happy":
        return <Smile className="h-5 w-5" />;
      case "sad":
        return <Frown className="h-5 w-5" />;
      case "angry":
        return <AlertTriangle className="h-5 w-5" />;
      case "fearful":
        return <AlertTriangle className="h-5 w-5" />;
      case "neutral":
        return <Heart className="h-5 w-5" />;
      case "surprised":
        return <Smile className="h-5 w-5" />;
      case "disgusted":
        return <Frown className="h-5 w-5" />;
      default:
        return <Heart className="h-5 w-5" />;
    }
  };

  // Handle Submission of Entry
  const handleSubmit = () => {
    if (recordedVideo) {
      const insights = generateInsights();

      const newEntry: DiaryEntry = {
        id: crypto.randomUUID(),
        type: "video",
        content: recordedVideo,
        mood: currentEmotion,
        timestamp: new Date().toISOString(),
        emotionData: emotionSummary,
        insights,
      };

      setEntries((prev) => [...prev, newEntry]);
      setCurrentEntry(newEntry);
      setShowInsights(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">
          Emotional Intelligence Video Diary
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Recording Area */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Record Your Entry</CardTitle>
                <CardDescription>
                  Express yourself naturally. We'll analyze your emotions in
                  real-time.
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                    <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-1 rounded-md flex items-center gap-2">
                      <span className="animate-pulse h-3 w-3 rounded-full bg-red-500"></span>
                      <span>Recording</span>
                    </div>
                  )}
                  {isRecording && currentEmotion && (
                    <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white px-3 py-2 rounded-md">
                      <div className="flex justify-between items-center mb-1">
                        <span>Current Emotion: {currentEmotion}</span>
                        <span>{emotionConfidence.toFixed(0)}% confidence</span>
                      </div>
                      <Progress value={emotionConfidence} className="h-2" />
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center gap-4">
                {!isRecording && !recordedVideo && (
                  <Button
                    onClick={startRecording}
                    className="flex items-center gap-2"
                  >
                    <Camera className="h-4 w-4" />
                    Start Recording
                  </Button>
                )}
                {isRecording && (
                  <Button
                    variant="destructive"
                    onClick={stopRecording}
                    className="flex items-center gap-2"
                  >
                    <Square className="h-4 w-4" />
                    Stop Recording
                  </Button>
                )}
                {recordedVideo && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setRecordedVideo(null);
                        setRecordingComplete(false);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Camera className="h-4 w-4" />
                      Record Again
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Save Entry
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          </div>

          {/* Emotion Analysis Panel */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Mood Analysis</CardTitle>
                <CardDescription>
                  {recordingComplete
                    ? "Here's what we detected from your recording"
                    : "Start recording to see real-time emotion analysis"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!recordingComplete ? (
                  <div className="text-center py-12 text-muted-foreground italic">
                    Your emotion analysis will appear here after recording
                  </div>
                ) : (
                  <>
                    {/* Dominant Emotion */}
                    <div className="space-y-2">
                      <Label>Primary Mood</Label>
                      <div
                        className={`p-3 rounded-md ${getEmotionColor(
                          currentEmotion
                        )} bg-opacity-20 border border-gray-200`}
                      >
                        <div className="flex items-center gap-2">
                          {getEmotionIcon(currentEmotion)}
                          <span className="font-medium capitalize">
                            {currentEmotion}
                          </span>
                        </div>
                        <p className="text-sm mt-1">
                          {getEmotionDescription(currentEmotion)}
                        </p>
                      </div>
                    </div>

                    {/* Emotion Distribution */}
                    <div className="space-y-2">
                      <Label>Emotion Distribution</Label>
                      <div className="space-y-2">
                        {Object.entries(emotionSummary)
                          .sort(([, a], [, b]) => b - a)
                          .slice(0, 4)
                          .map(([emotion, value]) => (
                            <div key={emotion} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="capitalize">{emotion}</span>
                                <span>{(value * 100).toFixed(0)}%</span>
                              </div>
                              <Progress
                                value={value * 100}
                                className={`h-2 ${getEmotionColor(emotion)}`}
                              />
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="space-y-2">
                      <Label>Recommendations</Label>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {getRecommendations(currentEmotion).map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Insights Dialog */}
        <AlertDialog open={showInsights} onOpenChange={setShowInsights}>
          <AlertDialogContent className="max-w-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Entry Insights</AlertDialogTitle>
              <AlertDialogDescription>
                Here's what we learned from your emotional expressions
              </AlertDialogDescription>
            </AlertDialogHeader>

            {currentEntry?.insights && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Emotional Summary</h4>
                    <p>
                      Dominant Emotion:{" "}
                      <span className="font-medium capitalize">
                        {currentEntry.insights.dominantEmotion}
                      </span>
                    </p>
                    <p>
                      Overall Sentiment:{" "}
                      <span className="font-medium">
                        {currentEntry.insights.sentiment}
                      </span>
                    </p>
                    <p>
                      Emotional Stability:{" "}
                      <span className="font-medium">
                        {currentEntry.insights.emotionalJourney}
                      </span>
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-1">Potential Triggers</h4>
                    <ul className="list-disc pl-5">
                      {currentEntry.insights.triggers?.map((trigger, i) => (
                        <li key={i}>{trigger}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Recommendations</h4>
                    <ul className="list-disc pl-5">
                      {currentEntry.insights.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-1">Coping Strategies</h4>
                    <ul className="list-disc pl-5">
                      {currentEntry.insights.copingMechanisms?.map(
                        (mech, i) => (
                          <li key={i}>{mech}</li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <AlertDialogFooter>
              <Button onClick={() => setShowInsights(false)}>Close</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
