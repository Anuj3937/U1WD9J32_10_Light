"use client"

import { useState, useRef, useEffect } from "react"
import { Nav } from "@/components/nav"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function MeditationPage() {
  // State to track if a meditation session is in progress
  const [isMeditating, setIsMeditating] = useState(false)
  // Timer for the ongoing meditation session
  const [timer, setTimer] = useState(0)
  // State for the current breath instruction: "Breathe In", "Hold", "Breathe Out"
  const [breathState, setBreathState] = useState("Breathe In")
  // Ref for the video element
  const videoRef = useRef<HTMLVideoElement>(null)
  // State for selected video
  const [selectedVideo, setSelectedVideo] = useState("/meditation-video1.mp4")

  // List of available meditation videos
  const videoOptions = [
    { value: "/meditation-video1.mp4", label: "Calm Ocean Waves" },
    { value: "/meditation-video2.mp4", label: "Forest Ambience" },
    { value: "/meditation-video3.mp4", label: "Guided Breathing Exercise" },
    // To include your uploaded video, uncomment the line below and adjust the file path accordingly:
    // { value: "/WhatsApp Video 2025-03-09 at 00.59.54_316a2ad1.mp4", label: "Uploaded Meditation Video" },
  ]

  const totalTime = 7500;
  const breatheTime = (totalTime / 5) * 2;
  const holdTime = totalTime / 5;

  // useEffect to update the timer and alternate breath instructions during meditation
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isMeditating) {
      intervalId = setInterval(() => {
        setTimer((prev) => {
          const newVal = prev + 1;
          if (newVal % 5 === 0) {
            setBreathState((prevState) => {
              if (prevState === "Breathe In") return "Hold";
              if (prevState === "Hold") return "Breathe Out";
              return "Breathe In"; // Default case, should not be reached in normal flow
            });
          } else if ((newVal - 3) % 5 === 0) { // Change to "Breathe In" after "Breathe Out"
            setBreathState("Breathe In");
          }
          return newVal;
        });
      }, 1000);
    } else {
      setTimer(0);
      setBreathState("Breathe In");
      if (intervalId) {
        clearInterval(intervalId);
      }
    }
    return () => { if (intervalId) clearInterval(intervalId); };
  }, [isMeditating]);


  // Starts the meditation session
  const startMeditation = () => {
    setIsMeditating(true)
    if (videoRef.current) {
      videoRef.current.play()
    }
  }

  // Stops the meditation session
  const stopMeditation = () => {
    setIsMeditating(false)
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Nav />
      <main className="max-w-4xl mx-auto p-8">
        {/* Descriptive paragraph */}
        <section className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Meditation & Its Benefits</h1>
          <p className="text-lg">
            Meditation is a powerful practice that helps calm your mind, reduce stress, and improve focus.
            By dedicating just a few minutes each day to mindfulness and breathing exercises, you can enhance
            your mental clarity, emotional stability, and overall well-being.
          </p>
        </section>

        <Card className="bg-gray-800 shadow-lg rounded-lg p-6 bg-transparent border-none">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Start Your Meditation Session</CardTitle>
            <p className="text-center text-gray-400">
              Select a video and begin your journey to inner peace.
            </p>
          </CardHeader>
          <CardContent>
            {/* Dropdown menu for selecting a video */}
            <div className="mb-4">
              <label htmlFor="video-select" className="block text-gray-300 font-medium mb-2">
                Choose Your Meditation Video:
              </label>
              <select
                id="video-select"
                value={selectedVideo}
                onChange={(e) => setSelectedVideo(e.target.value)}
                className="w-full border border-gray-600 rounded-lg p-2 bg-black text-white"
              >
                {videoOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Video player */}
            <div className="aspect-video relative rounded-lg overflow-hidden mb-8">
              <video
                ref={videoRef}
                src={selectedVideo}
                controls
                className="object-cover w-full h-full"
                style={{ maxHeight: "500px" }}
              />
            </div>

            {/* Breathing animation */}
            {isMeditating && (
              <div className="container-modified">
                <div className="outer-circle">
                  <div className="inner-circle">
                    <div className="breathing-text" id="text">
                      {breathState}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Timer and instructions */}
            <div className="text-center text-gray-400 mb-4">
              {isMeditating ? (
                <>
                  Meditation in progress...<br />
                  Session Duration: {timer} seconds
                </>
              ) : (
                "Press Start to begin your meditation session."
              )}
            </div>
          </CardContent>

          {/* Buttons */}
          <CardFooter className="flex justify-center gap-4">
            <Button onClick={startMeditation} disabled={isMeditating}>
              Start Meditation
            </Button>
            <Button onClick={stopMeditation} disabled={!isMeditating} variant="outline">
              Stop Meditation
            </Button>
          </CardFooter>
        </Card>
      </main>

      {/* Add custom styles for breathing animation using styled-jsx */}
      <style jsx>{`

        .container-modified {
          width: 200px; /* Adjusted size */
          height: 200px; /* Adjusted size */
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 20px auto; /* Center the container */
        }

        .outer-circle {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 3px solid white; /* White border */
          display: flex;
          align-items: center;
          justify-content: center;
          animation: breathe 7.5s linear infinite; /* Renamed animation */
        }

        .inner-circle {
          width: 80%; /* Inner circle size */
          height: 80%; /* Inner circle size */
          background-color: white; /* White fill */
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .breathing-text {
          color: #333; /* Darker text color inside */
          font-size: 1.2rem; /* Adjusted font size */
          font-weight: bold;
        }


        @keyframes breathe { /* Renamed keyframes to avoid conflict and more clarity */
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1); /* Scale up slightly */
          }
          100% {
            transform: scale(1);
          }
        }


      `}</style>
    </div>
  )
}