import { Nav } from "@/components/nav"
import { ChatRoom } from "@/components/community/chat-room"

// This would come from your API
const getGroupDetails = (groupId: string) => ({
  id: groupId,
  name: "Anxiety Support",
  description: "A safe space to discuss anxiety and coping mechanisms",
  therapist: {
    name: "Dr. Emily Johnson",
    avatar: "/placeholder.svg",
  },
})

export default function GroupPage({ params }: { params: { groupId: string } }) {
  const group = getGroupDetails(params.groupId)

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="container mx-auto p-4">
        <ChatRoom
          groupId={group.id}
          groupName={group.name}
          description={group.description}
          therapist={group.therapist}
        />
      </main>
    </div>
  )
}

