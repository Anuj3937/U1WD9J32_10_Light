"use client"

import { useEffect, useRef, useState } from "react"
import { Nav } from "@/components/nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const reels = [
  {
    id: 1,
    video: "videoo0.mp4",
    thumbnail: "/placeholder.svg",
    title: "5-Minute Mindfulness Exercise",
    author: "MindfulnessCoach",
    likes: 1200,
    comments: 45,
    description: "Quick mindfulness exercise to reduce anxiety",
  },
  {
    id: 2,
    video: "/videoo1.mp4",
    thumbnail: "/placeholder.svg",
    title: "Breathing Techniques for Stress",
    author: "StressReliefExpert",
    likes: 890,
    comments: 32,
    description: "Simple breathing exercises to calm your mind",
  },
  {
    id: 3,
    video: "/videoo2.mp4",
    thumbnail: "/placeholder.svg",
    title: "Positive Affirmations for Self-Esteem",
    author: "PositivityCoach",
    likes: 1500,
    comments: 67,
    description: "Daily affirmations to boost your confidence",
  },
  {
    id: 4,
    video: "/videoo3.mp4",
    thumbnail: "/placeholder.svg",
    title: "Quick Desk Stretches for Focus",
    author: "WellnessAtWork",
    likes: 750,
    comments: 28,
    description: "Easy stretches to improve concentration",
  },
  {
    id: 5,
    video: "/videoo4.mp4",
    thumbnail: "/placeholder.svg",
    title: "Positive Affirmations for Self-Esteem",
    author: "PositivityCoach",
    likes: 1500,
    comments: 67,
    description: "Daily affirmations to boost your confidence",
  },
  {
    id: 6,
    video: "/videoo5.mp4",
    thumbnail: "/placeholder.svg",
    title: "Positive Affirmations for Self-Esteem",
    author: "PositivityCoach",
    likes: 1500,
    comments: 67,
    description: "Daily affirmations to boost your confidence",
  },
  {
    id: 7,
    video: "/videoo6.mp4",
    thumbnail: "/placeholder.svg",
    title: "Positive Affirmations for Self-Esteem",
    author: "PositivityCoach",
    likes: 1500,
    comments: 67,
    description: "Daily affirmations to boost your confidence",
  },
  {
    id: 8,
    video: "/videoo7.mp4",
    thumbnail: "/placeholder.svg",
    title: "Positive Affirmations for Self-Esteem",
    author: "PositivityCoach",
    likes: 1500,
    comments: 67,
    description: "Daily affirmations to boost your confidence",
  },
  {
    id: 9,
    video: "/videoo8.mp4",
    thumbnail: "/placeholder.svg",
    title: "Positive Affirmations for Self-Esteem",
    author: "PositivityCoach",
    likes: 1500,
    comments: 67,
    description: "Daily affirmations to boost your confidence",
  },
  {
    id: 10,
    video: "/videoo9.mp4",
    thumbnail: "/placeholder.svg",
    title: "Positive Affirmations for Self-Esteem",
    author: "PositivityCoach",
    likes: 1500,
    comments: 67,
    description: "Daily affirmations to boost your confidence",
  },


]

export default function Reels() {
  const [currentReel, setCurrentReel] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  // Handle scroll-based reel navigation
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      
      // Determine scroll direction
      if (e.deltaY > 0) {
        // Scroll down - next reel
        setCurrentReel((prev) => (prev === reels.length - 1 ? 0 : prev + 1))
      } else {
        // Scroll up - previous reel
        setCurrentReel((prev) => (prev === 0 ? reels.length - 1 : prev - 1))
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    
    return () => {
      container.removeEventListener('wheel', handleWheel)
    }
  }, [])

  // Handle video playback when changing reels
  useEffect(() => {
    // Pause all videos
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentReel) {
          if (isPlaying) video.play().catch(() => {})
        } else {
          video.pause()
          video.currentTime = 0
        }
      }
    })
  }, [currentReel, isPlaying])

  // Toggle play/pause on video click
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="max-w-md mx-auto mt-4 p-0">
        <div className="flex items-center justify-between px-4 mb-2">
          <h1 className="text-xl font-bold">Reels</h1>
        </div>
        
        <div 
          ref={containerRef}
          className="relative h-[85vh] overflow-hidden"
          style={{ scrollSnapType: 'y mandatory' }}
        >
          {reels.map((reel, index) => (
            <Card 
              key={reel.id}
              className={`absolute inset-0 h-full w-full transition-transform duration-500 ease-out ${
                index === currentReel ? 'translate-y-0' : 
                index < currentReel ? '-translate-y-full' : 'translate-y-full'
              }`}
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="absolute inset-0" onClick={togglePlayPause}>
                <video
                  ref={el => videoRefs.current[index] = el}
                  src={reel.video}
                  poster={reel.thumbnail}
                  className="w-full h-full object-cover rounded-lg"
                  loop
                  playsInline
                  muted={false}
                />
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 rounded-b-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{reel.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-white font-medium">{reel.author}</span>
                </div>
                <h2 className="text-white text-lg font-bold">{reel.title}</h2>
                <p className="text-white/80 text-sm">{reel.description}</p>
              </div>

              {/* Instagram-style side action buttons */}
              <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6">
                <div className="flex flex-col items-center">
                  <Button variant="ghost" size="icon" className="text-white">
                    <Heart className="h-7 w-7" />
                  </Button>
                  <span className="text-white text-xs">{reel.likes}</span>
                </div>
                <div className="flex flex-col items-center">
                  <Button variant="ghost" size="icon" className="text-white">
                    <MessageCircle className="h-7 w-7" />
                  </Button>
                  <span className="text-white text-xs">{reel.comments}</span>
                </div>
                <Button variant="ghost" size="icon" className="text-white">
                  <Share2 className="h-7 w-7" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white">
                  <Bookmark className="h-7 w-7" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Reel indicator dots */}
        <div className="flex justify-center mt-2 gap-1.5">
          {reels.map((_, index) => (
            <div
              key={index}
              className={`h-1 w-1 rounded-full ${index === currentReel ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
