"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format, parseISO } from "date-fns"
import { FileText, Video, Target, Users, BarChart2 } from "lucide-react"

type Activity = {
  id: string
  type: "assessment" | "diary" | "goal" | "community"
  title: string
  date: string
  score?: number
}

type RecentActivitiesProps = {
  activities: Activity[]
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "assessment":
        return <BarChart2 className="h-4 w-4" />
      case "diary":
        return <Video className="h-4 w-4" />
      case "goal":
        return <Target className="h-4 w-4" />
      case "community":
        return <Users className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "assessment":
        return "bg-blue-100 text-blue-800"
      case "diary":
        return "bg-purple-100 text-purple-800"
      case "goal":
        return "bg-green-100 text-green-800"
      case "community":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Your latest interactions with the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-center text-muted-foreground">No recent activities to display.</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50">
                <div className={`rounded-full p-2 ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">{activity.title}</p>
                    <Badge variant="outline">{format(parseISO(activity.date), "MMM d")}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(activity.date), "h:mm a")}
                    {activity.score && ` • Score: ${activity.score}/100`}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

