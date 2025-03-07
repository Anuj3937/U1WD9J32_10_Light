"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Video, Play, Download, Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type SavedVideo = {
  id: string
  title: string
  date: string
  duration: string
  mood: string
  videoUrl: string
  thumbnail: string
  insights?: {
    sentiment: string
    recommendations: string[]
  }
}

type SavedVideosDrawerProps = {
  videos: SavedVideo[]
  onDeleteVideo: (id: string) => void
}

export function SavedVideosDrawer({ videos, onDeleteVideo }: SavedVideosDrawerProps) {
  const [selectedVideo, setSelectedVideo] = useState<SavedVideo | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">
            <Video className="w-4 h-4 mr-2" />
            View Saved Videos
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Your Video Diary</SheetTitle>
            <SheetDescription>Browse through your previous diary entries</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {videos.map((video) => (
              <Card key={video.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                <div className="p-4">
                  <div className="relative aspect-video mb-3 rounded-lg overflow-hidden group">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-12 w-12 rounded-full"
                        onClick={() => setSelectedVideo(video)}
                      >
                        <Play className="h-6 w-6" />
                      </Button>
                    </div>
                    <Badge className="absolute bottom-2 right-2 bg-black/70">{video.duration}</Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{video.title}</h3>
                      <Badge variant="secondary">{video.mood}</Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(video.date)}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedVideo(video)}>
                      <Play className="h-4 w-4 mr-2" />
                      Play
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        const link = document.createElement("a")
                        link.href = video.videoUrl
                        link.download = `${video.title}.mp4`
                        link.click()
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
            <DialogDescription>Recorded on {selectedVideo && formatDate(selectedVideo.date)}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
              <video
                src={selectedVideo?.videoUrl}
                controls
                className="w-full h-full"
                autoPlay
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>
            {selectedVideo?.insights && (
              <div className="space-y-2">
                <h4 className="font-semibold">AI Insights</h4>
                <Badge variant={selectedVideo.insights.sentiment === "positive" ? "default" : "secondary"}>
                  {selectedVideo.insights.sentiment} mood detected
                </Badge>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {selectedVideo.insights.recommendations.map((rec, index) => (
                    <li key={index}>• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

