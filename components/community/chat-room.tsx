"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

type Message = {
  id: string
  content: string
  sender: {
    id: string
    name: string
    avatar?: string
    role: "user" | "therapist" | "moderator"
  }
  timestamp: string
}

type ChatRoomProps = {
  groupId: string
  groupName: string
  description: string
  therapist: {
    name: string
    avatar?: string
  }
}

export function ChatRoom({ groupId, groupName, description, therapist }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Here you would fetch messages from your API
    // For now, we'll use mock data
    setMessages([
      {
        id: "1",
        content: "Welcome to the support group! I'm here to facilitate our discussion.",
        sender: {
          id: "t1",
          name: therapist.name,
          avatar: therapist.avatar,
          role: "therapist",
        },
        timestamp: new Date().toISOString(),
      },
    ])
  }, [therapist])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message: Message = {
      id: crypto.randomUUID(),
      content: newMessage,
      sender: {
        id: "u1", // This would come from auth context
        name: "Current User",
        role: "user",
      },
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  return (
    <Card className="h-[calc(100vh-12rem)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{groupName}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={therapist.avatar} />
              <AvatarFallback>{therapist.name[0]}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <div className="font-medium">{therapist.name}</div>
              <div className="text-muted-foreground">Group Therapist</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-16rem)] pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.sender.role === "therapist" ? "bg-muted/50 p-2 rounded-lg" : ""}`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.sender.avatar} />
                  <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{message.sender.name}</span>
                    {message.sender.role === "therapist" && <Badge variant="secondary">Therapist</Badge>}
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </form>
      </CardFooter>
    </Card>
  )
}

