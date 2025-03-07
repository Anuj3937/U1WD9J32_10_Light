"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertTriangle, CheckCircle, Flag, MessageCircle, Shield } from "lucide-react"

type Report = {
  id: string
  type: "post" | "comment" | "user"
  content: string
  reporter: {
    name: string
    avatar?: string
  }
  reported: {
    name: string
    avatar?: string
  }
  reason: string
  status: "pending" | "resolved" | "dismissed"
  timestamp: string
  group: string
}

const reports: Report[] = [
  {
    id: "1",
    type: "post",
    content: "This post contains inappropriate content...",
    reporter: {
      name: "John Doe",
      avatar: "/placeholder.svg",
    },
    reported: {
      name: "Jane Smith",
      avatar: "/placeholder.svg",
    },
    reason: "Inappropriate content",
    status: "pending",
    timestamp: new Date().toISOString(),
    group: "Anxiety Support",
  },
  // Add more reports...
]

export function CommunityModeration() {
  const [activeReports, setActiveReports] = useState(reports)

  const handleReportAction = (reportId: string, action: "resolve" | "dismiss") => {
    setActiveReports((prev) =>
      prev.map((report) =>
        report.id === reportId ? { ...report, status: action === "resolve" ? "resolved" : "dismissed" } : report,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Community Moderation</h2>
          <p className="text-muted-foreground">Monitor and manage community content</p>
        </div>
        <Button variant="outline">
          <Shield className="mr-2 h-4 w-4" />
          Moderation Settings
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">4 high priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Moderators</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 currently online</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resolution Time</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5h</div>
            <p className="text-xs text-muted-foreground">Average response time</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Review and manage reported content</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
              <TabsTrigger value="dismissed">Dismissed</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {activeReports
                .filter((report) => report.status === "pending")
                .map((report) => (
                  <Alert key={report.id}>
                    <Flag className="h-4 w-4" />
                    <AlertTitle className="flex items-center gap-2">
                      <span>Report from {report.reporter.name}</span>
                      <Badge variant="outline">{report.type}</Badge>
                    </AlertTitle>
                    <AlertDescription>
                      <div className="mt-2 space-y-2">
                        <p className="text-sm">{report.content}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MessageCircle className="h-4 w-4" />
                          <span>{report.group}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={report.reported.avatar} />
                            <AvatarFallback>{report.reported.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">Reported user: {report.reported.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReportAction(report.id, "resolve")}
                          >
                            Take Action
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleReportAction(report.id, "dismiss")}>
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
            </TabsContent>

            <TabsContent value="resolved">{/* Resolved reports */}</TabsContent>

            <TabsContent value="dismissed">{/* Dismissed reports */}</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

