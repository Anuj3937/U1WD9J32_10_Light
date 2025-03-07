"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"

type Comment = {
  id: string
  content: string
  author: {
    name: string
    avatar?: string
  }
  timestamp: string
}

type Post = {
  id: string
  author: {
    name: string
    avatar?: string
  }
  content: string
  image?: string
  likes: number
  comments: Comment[]
  timestamp: string
  group?: string
  isLiked?: boolean
}

type PostCardProps = {
  post: Post
  onLike: () => void
  onComment: (content: string) => void
}

export function PostCard({ post, onLike, onComment }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    onComment(newComment)
    setNewComment("")
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      "day",
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{post.author.name}</div>
            <div className="text-sm text-muted-foreground">
              {post.group && `${post.group} • `}
              {formatTimestamp(post.timestamp)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
        {post.image && (
          <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
            <img src={post.image || "/placeholder.svg"} alt="Post attachment" className="object-cover w-full h-full" />
          </div>
        )}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className={cn(post.isLiked && "text-primary")} onClick={onLike}>
            <Heart className={cn("h-4 w-4 mr-2", post.isLiked && "fill-current")} />
            {post.likes}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)}>
            <MessageCircle className="h-4 w-4 mr-2" />
            {post.comments.length}
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        {showComments && (
          <div className="mt-4 space-y-4">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.author.avatar} />
                  <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-muted p-2 rounded-lg">
                    <div className="font-medium">{comment.author.name}</div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{formatTimestamp(comment.timestamp)}</div>
                </div>
              </div>
            ))}

            <form onSubmit={handleComment} className="flex items-start space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="min-h-[80px]"
                />
                <Button type="submit" size="sm">
                  Post Comment
                </Button>
              </div>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

