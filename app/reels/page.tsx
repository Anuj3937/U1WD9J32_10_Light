"use client"

import { useState } from "react"
import { Nav } from "@/components/nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const reels = [
  {
    id: 1,
    video: "/placeholder.mp4",
    thumbnail: "/placeholder.svg",
    title: "5-Minute Mindfulness Exercise",
    author: "MindfulnessCoach",
    likes: 1200,
    comments: 45,
    description: "Quick mindfulness exercise to reduce anxiety",
  },
  {
    id: 2,
    video: "/placeholder.mp4",
    thumbnail: "/placeholder.svg",
    title: "Breathing Techniques for Stress",
    author: "StressReliefExpert",
    likes: 890,
    comments: 32,
    description: "Simple breathing exercises to calm your mind",
  },
  {
    id: 3,
    video: "/placeholder.mp4",
    thumbnail: "/placeholder.svg",
    title: "Positive Affirmations for Self-Esteem",
    author: "PositivityCoach",
    likes: 1500,
    comments: 67,
    description: "Daily affirmations to boost your confidence",
  },
  {
    id: 4,
    video: "/placeholder.mp4",
    thumbnail: "/placeholder.svg",
    title: "Quick Desk Stretches for Focus",
    author: "WellnessAtWork",
    likes: 750,
    comments: 28,
    description: "Easy stretches to improve concentration",
  },
]

export default function Reels() {
  const [currentReel, setCurrentReel] = useState(0)

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="max-w-md mx-auto mt-8 p-4">
        <Card className="relative h-[80vh]">
          <div className="absolute inset-0">
            <video
              src={reels[currentReel].video}
              poster={reels[currentReel].thumbnail}
              className="w-full h-full object-cover rounded-lg"
              controls
              loop
            />
          </div>

          {/* Navigation arrows */}
          <button
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 rounded-full p-2 text-white hover:bg-black/50"
            onClick={() => setCurrentReel((prev) => (prev === 0 ? reels.length - 1 : prev - 1))}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6"></path>
            </svg>
          </button>

          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 rounded-full p-2 text-white hover:bg-black/50"
            onClick={() => setCurrentReel((prev) => (prev === reels.length - 1 ? 0 : prev + 1))}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </button>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 rounded-b-lg">
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>{reels[currentReel].author.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-white font-medium">{reels[currentReel].author}</span>
            </div>
            <h2 className="text-white text-lg font-bold">{reels[currentReel].title}</h2>
            <p className="text-white/80 text-sm">{reels[currentReel].description}</p>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="text-white">
                  <Heart className="h-6 w-6" />
                  <span className="sr-only">Like</span>
                </Button>
                <span className="text-white text-sm">{reels[currentReel].likes}</span>
                <Button variant="ghost" size="icon" className="text-white">
                  <MessageCircle className="h-6 w-6" />
                  <span className="sr-only">Comment</span>
                </Button>
                <span className="text-white text-sm">{reels[currentReel].comments}</span>
                <Button variant="ghost" size="icon" className="text-white">
                  <Share2 className="h-6 w-6" />
                  <span className="sr-only">Share</span>
                </Button>
              </div>
              <Button variant="ghost" size="icon" className="text-white">
                <Bookmark className="h-6 w-6" />
                <span className="sr-only">Save</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Reel indicator dots */}
        <div className="flex justify-center mt-4 gap-2">
          {reels.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full ${index === currentReel ? "bg-primary" : "bg-muted"}`}
              onClick={() => setCurrentReel(index)}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

