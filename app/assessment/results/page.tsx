"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Nav } from "@/components/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import Link from "next/link"
import { ArrowLeft, Download, Share2, Calendar, BookOpen, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Test result interpretation ranges
const resultRanges = {
  adhd: [
    { min: 0, max: 10, severity: "Minimal", description: "Your symptoms are minimal and likely don't indicate ADHD." },
    { min: 11, max: 20, severity: "Mild", description: "You show some symptoms that may indicate mild ADHD traits." },
    {
      min: 21,
      max: 30,
      severity: "Moderate",
      description: "Your symptoms suggest moderate ADHD. Consider consulting a professional.",
    },
    {
      min: 31,
      max: 40,
      severity: "Severe",
      description: "Your symptoms indicate severe ADHD. Professional evaluation is recommended.",
    },
  ],
  anxiety: [
    { min: 0, max: 7, severity: "Minimal", description: "Your anxiety levels are within the normal range." },
    {
      min: 8,
      max: 15,
      severity: "Mild",
      description: "You're experiencing mild anxiety that may benefit from self-care strategies.",
    },
    {
      min: 16,
      max: 25,
      severity: "Moderate",
      description: "Your anxiety levels are moderate. Consider professional support.",
    },
    {
      min: 26,
      max: 36,
      severity: "Severe",
      description: "You're experiencing severe anxiety. Professional help is recommended.",
    },
  ],
  depression: [
    {
      min: 0,
      max: 9,
      severity: "Minimal",
      description: "Your symptoms are minimal and likely don't indicate depression.",
    },
    { min: 10, max: 18, severity: "Mild", description: "You show some symptoms that may indicate mild depression." },
    {
      min: 19,
      max: 25,
      severity: "Moderate",
      description: "Your symptoms suggest moderate depression. Consider consulting a professional.",
    },
    {
      min: 26,
      max: 30,
      severity: "Severe",
      description: "Your symptoms indicate severe depression. Professional evaluation is recommended.",
    },
  ],
  // Add ranges for other test types
}

// Sample data for visualizations
const sampleData = {
  adhd: {
    score: 18,
    maxScore: 40,
    categoryScores: [
      { name: "Inattention", score: 12, maxScore: 20 },
      { name: "Hyperactivity", score: 6, maxScore: 20 },
    ],
    recommendations: [
      "Consider organizational strategies like planners and reminders",
      "Practice mindfulness meditation to improve focus",
      "Establish consistent daily routines",
      "Consider a professional evaluation for a formal diagnosis",
    ],
    resources: [
      { title: "Understanding Adult ADHD", type: "article" },
      { title: "ADHD Coping Strategies", type: "video" },
      { title: "ADHD Support Group", type: "community" },
    ],
  },
  anxiety: {
    score: 14,
    maxScore: 36,
    categoryScores: [
      { name: "Worry", score: 8, maxScore: 12 },
      { name: "Physical Symptoms", score: 6, maxScore: 12 },
      { name: "Social Anxiety", score: 0, maxScore: 12 },
    ],
    recommendations: [
      "Practice deep breathing exercises when feeling anxious",
      "Gradually expose yourself to anxiety-triggering situations",
      "Maintain a regular sleep schedule",
      "Consider cognitive-behavioral therapy techniques",
    ],
    resources: [
      { title: "Anxiety Management Techniques", type: "article" },
      { title: "Guided Meditation for Anxiety", type: "video" },
      { title: "Anxiety Support Group", type: "community" },
    ],
  },
  depression: {
    score: 12,
    maxScore: 30,
    categoryScores: [
      { name: "Mood", score: 5, maxScore: 10 },
      { name: "Interest", score: 3, maxScore: 10 },
      { name: "Energy", score: 4, maxScore: 10 },
    ],
    recommendations: [
      "Engage in regular physical activity",
      "Maintain social connections even when you don't feel like it",
      "Practice self-compassion and challenge negative thoughts",
      "Consider speaking with a mental health professional",
    ],
    resources: [
      { title: "Understanding Depression", type: "article" },
      { title: "Mood-Boosting Activities", type: "video" },
      { title: "Depression Support Group", type: "community" },
    ],
  },
  // Add data for other test types
}

// Colors for charts
const COLORS = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b"]

export default function AssessmentResults() {
  const searchParams = useSearchParams()
  const testType = searchParams.get("test") || "depression"
  const [resultData, setResultData] = useState<any>(null)

  useEffect(() => {
    // In a real app, you would fetch the actual test results from your backend
    // For now, we'll use the sample data
    setResultData(sampleData[testType as keyof typeof sampleData])
  }, [testType])

  if (!resultData) {
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <main className="max-w-7xl mx-auto mt-8 p-4">
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    )
  }

  // Calculate the severity based on the score
  const testRanges = resultRanges[testType as keyof typeof resultRanges] || []
  const resultRange = testRanges.find((range) => resultData.score >= range.min && resultData.score <= range.max) || {
    severity: "Unknown",
    description: "Could not determine severity level.",
  }

  // Prepare data for the pie chart
  const pieData = [
    { name: "Score", value: resultData.score },
    { name: "Remaining", value: resultData.maxScore - resultData.score },
  ]

  // Prepare data for the bar chart
  const barData = resultData.categoryScores.map((category: any) => ({
    name: category.name,
    score: category.score,
    maxScore: category.maxScore - category.score,
  }))

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="max-w-7xl mx-auto mt-8 p-4">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/assessment/detailed">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Assessments
            </Link>
          </Button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                {testType.charAt(0).toUpperCase() + testType.slice(1)} Assessment Results
              </h1>
              <p className="text-muted-foreground">Completed on {new Date().toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share Results
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Overall Score</CardTitle>
              <CardDescription>Your assessment results</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-32 h-32 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell key={`cell-0`} fill={COLORS[0]} />
                      <Cell key={`cell-1`} fill="#e2e8f0" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {resultData.score}/{resultData.maxScore}
                </div>
                <div className="text-lg font-medium text-primary">{resultRange.severity}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interpretation</CardTitle>
              <CardDescription>What your score means</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{resultRange.description}</p>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Minimal</span>
                  <span>Severe</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(resultData.score / resultData.maxScore) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>Recommended actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/counseling">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Consultation
                  </Link>
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/resources">
                    <BookOpen className="mr-2 h-4 w-4" />
                    View Resources
                  </Link>
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/community">
                    <Users className="mr-2 h-4 w-4" />
                    Join Support Group
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="breakdown" className="space-y-6">
          <TabsList>
            <TabsTrigger value="breakdown">Score Breakdown</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="breakdown">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Analysis</CardTitle>
                <CardDescription>Breakdown of your assessment by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, "dataMax"]} />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" stackId="a" fill={COLORS[0]} name="Your Score" />
                      <Bar dataKey="maxScore" stackId="a" fill="#e2e8f0" name="Remaining" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6 space-y-4">
                  {resultData.categoryScores.map((category: any, index: number) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{category.name}</span>
                        <span>
                          {category.score}/{category.maxScore}
                        </span>
                      </div>
                      <Progress value={(category.score / category.maxScore) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle>Personalized Recommendations</CardTitle>
                <CardDescription>Based on your assessment results</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {resultData.recommendations.map((recommendation: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        {index + 1}
                      </div>
                      <p>{recommendation}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  These recommendations are based on your assessment results and are not a substitute for professional
                  medical advice.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle>Helpful Resources</CardTitle>
                <CardDescription>Educational materials and support options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resultData.resources.map((resource: any, index: number) => (
                    <Card key={index}>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">{resource.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <Badge variant="outline" className="mb-2">
                          {resource.type === "article" && "Article"}
                          {resource.type === "video" && "Video"}
                          {resource.type === "community" && "Community"}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {resource.type === "article" && "Read about strategies and insights"}
                          {resource.type === "video" && "Watch guided exercises and explanations"}
                          {resource.type === "community" && "Connect with others sharing similar experiences"}
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button variant="outline" size="sm" className="w-full">
                          View Resource
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Remember, this assessment is a screening tool and not a diagnostic instrument.
            <br />
            If you're concerned about your mental health, please consult with a qualified healthcare professional.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/counseling">Schedule a Consultation</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/assessment/detailed">Take Another Assessment</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

