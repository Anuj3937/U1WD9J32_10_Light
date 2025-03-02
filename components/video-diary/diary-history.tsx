"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Video, FileText } from "lucide-react"
import { format } from "date-fns"

type DiaryEntry = {
  id: string
  type: "video" | "text"
  content: string
  mood: string
  timestamp: string
  thumbnail?: string
}

export function DiaryHistory({ entries }: { entries: DiaryEntry[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Diary History</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map((entry) => (
          <Card key={entry.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{format(new Date(entry.timestamp), "PPP")}</CardTitle>
                {entry.type === "video" ? <Video className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
              </div>
            </CardHeader>
            <CardContent>
              {entry.type === "video" && entry.thumbnail && (
                <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={entry.thumbnail || "/placeholder.svg"}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Mood: {entry.mood}</span>
                <Button variant="outline" size="sm">
                  View Entry
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

