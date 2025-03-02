"use client"

import { useState } from "react"
import { Nav } from "@/components/nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react"

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
  // Add more reels
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
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 rounded-b-lg">
            <h2 className="text-white text-lg font-bold">{reels[currentReel].title}</h2>
            <p className="text-white/80 text-sm">{reels[currentReel].description}</p>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="text-white">
                  <Heart className="h-6 w-6" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white">
                  <MessageCircle className="h-6 w-6" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white">
                  <Share2 className="h-6 w-6" />
                </Button>
              </div>
              <Button variant="ghost" size="icon" className="text-white">
                <Bookmark className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}

