"use client"

import { useState } from "react"
import { PostCard } from "@/components/community/post-card"

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

type Comment = {
  id: string
  content: string
  author: {
    name: string
    avatar?: string
  }
  timestamp: string
}

const initialPosts: Post[] = [
  {
    id: "1",
    author: {
      name: "Sarah M.",
      avatar: "/placeholder.svg",
    },
    content:
      "Finally managed to complete a full week of meditation! It's amazing how much difference it makes in managing anxiety. 🧘‍♀️ #MentalHealthJourney",
    likes: 12,
    comments: [
      {
        id: "c1",
        content: "That's amazing! Keep it up! 💪",
        author: {
          name: "John D.",
          avatar: "/placeholder.svg",
        },
        timestamp: new Date().toISOString(),
      },
    ],
    timestamp: new Date().toISOString(),
    group: "Anxiety Support",
  },
  {
    id: "2",
    author: {
      name: "Mike R.",
      avatar: "/placeholder.svg",
    },
    content:
      "Just had my first therapy session. Feeling nervous but hopeful. Anyone else remember their first session?",
    image: "/placeholder.svg",
    likes: 24,
    comments: [],
    timestamp: new Date().toISOString(),
  },
]

export function CommunityFeed() {
  const [posts, setPosts] = useState(initialPosts)

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked,
            }
          : post,
      ),
    )
  }

  const handleComment = (postId: string, content: string) => {
    const newComment: Comment = {
      id: crypto.randomUUID(),
      content,
      author: {
        name: "Current User", // This would come from auth context
        avatar: "/placeholder.svg",
      },
      timestamp: new Date().toISOString(),
    }

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...post.comments, newComment],
            }
          : post,
      ),
    )
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={() => handleLike(post.id)}
          onComment={(content) => handleComment(post.id, content)}
        />
      ))}
    </div>
  )
}

