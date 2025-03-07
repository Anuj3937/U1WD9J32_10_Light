"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts"

const sessionData = [
  { month: "Jan", sessions: 45, completion: 42, satisfaction: 4.5 },
  { month: "Feb", sessions: 52, completion: 48, satisfaction: 4.7 },
  { month: "Mar", sessions: 48, completion: 45, satisfaction: 4.6 },
  { month: "Apr", sessions: 55, completion: 52, satisfaction: 4.8 },
  { month: "May", sessions: 59, completion: 55, satisfaction: 4.7 },
  { month: "Jun", sessions: 58, completion: 54, satisfaction: 4.9 },
]

const patientProgress = [
  { category: "Anxiety", improved: 75, stable: 20, declined: 5 },
  { category: "Depression", improved: 68, stable: 25, declined: 7 },
  { category: "Stress", improved: 82, stable: 15, declined: 3 },
  { category: "Sleep", improved: 60, stable: 30, declined: 10 },
]

export function TherapistAnalytics() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="sessions">Sessions</TabsTrigger>
        <TabsTrigger value="outcomes">Patient Outcomes</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Session Completion Rate</CardTitle>
              <CardDescription>Average completion rate over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sessionData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="completion" stroke="#0ea5e9" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Patient Satisfaction</CardTitle>
              <CardDescription>Average rating out of 5</CardDescription>
            </CardHeader>
            <CardContent className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sessionData}>
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="satisfaction" stroke="#0ea5e9" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Treatment Progress</CardTitle>
              <CardDescription>Patient improvement by category</CardDescription>
            </CardHeader>
            <CardContent className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patientProgress}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="improved" stackId="a" fill="#22c55e" />
                  <Bar dataKey="stable" stackId="a" fill="#eab308" />
                  <Bar dataKey="declined" stackId="a" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
            <CardDescription>Analysis of your practice performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">Average Sessions/Week</div>
                  <div className="text-2xl font-bold">12.5</div>
                  <div className="text-xs text-green-500">↑ 15% increase</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">Patient Retention</div>
                  <div className="text-2xl font-bold">89%</div>
                  <div className="text-xs text-green-500">↑ 5% increase</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">Average Session Length</div>
                  <div className="text-2xl font-bold">52 min</div>
                  <div className="text-xs text-muted-foreground">On target</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">Treatment Success Rate</div>
                  <div className="text-2xl font-bold">78%</div>
                  <div className="text-xs text-green-500">↑ 8% increase</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="sessions">{/* Detailed session analytics would go here */}</TabsContent>

      <TabsContent value="outcomes">{/* Detailed patient outcomes would go here */}</TabsContent>
    </Tabs>
  )
}

