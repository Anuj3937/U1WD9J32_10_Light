"use client"

import { Button } from "@/components/ui/button"
import { Video, MessageCircle, BookOpen, Users, BarChart2 } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <div className="space-y-4">
      <Button asChild variant="default" className="w-full">
        <Link href="/assessment">
          <BarChart2 className="h-4 w-4 mr-2" />
          Take Mental Health Assessment
        </Link>
      </Button>

      <div className="grid grid-cols-2 gap-4">
        <Button asChild variant="outline" className="h-20 flex flex-col">
          <Link href="/video-diary">
            <Video className="h-6 w-6 mb-2" />
            Record Diary
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-20 flex flex-col">
          <Link href="/chat">
            <MessageCircle className="h-6 w-6 mb-2" />
            Chat Support
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-20 flex flex-col">
          <Link href="/community">
            <Users className="h-6 w-6 mb-2" />
            Join Groups
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-20 flex flex-col">
          <Link href="/reels">
            <BookOpen className="h-6 w-6 mb-2" />
            Self Help
          </Link>
        </Button>
      </div>
    </div>
  )
}

