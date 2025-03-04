"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Nav } from "@/components/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import {
  Brain,
  AlertTriangle,
  CheckCircle,
  Info,
  ArrowRight,
  Download,
  Share2,
  Calendar,
  BookOpen,
  Video,
  Users,
  BarChart2,
} from "lucide-react"
import Link from "next/link"

// Test result data (in a real app, this would come from your backend)
const testResults = {
  adhd: {
    score: 68,
    severity: "Moderate",
    interpretation:
      "Your responses suggest moderate symptoms consistent with ADHD. While not conclusive, these results indicate that you may benefit from further evaluation by a healthcare professional.",
    recommendations: [
      "Consider scheduling an evaluation with a mental health professional who specializes in ADHD",
      "Explore organizational strategies and tools to help manage daily tasks",
      "Practice mindfulness techniques to improve focus and attention",
      "Consider joining a support group for individuals with ADHD",
    ],
    resources: [
      { title: "Understanding Adult ADHD", type: "article", link: "/resources/adhd-understanding" },
      { title: "ADHD Coping Strategies", type: "video", link: "/resources/adhd-strategies" },
      { title: "ADHD Support Group", type: "community", link: "/community/adhd-support" },
    ],
    chartData: {
      domains: [
        { name: "Attention", score: 72 },
        { name: "Hyperactivity", score: 65 },
        { name: "Impulsivity", score: 58 },
        { name: "Organization", score: 78 },
        { name: "Time Management", score: 67 },
      ],
      comparison: [
        { name: "Your Score", value: 68 },
        { name: "Average", value: 50 },
        { name: "Clinical Threshold", value: 65 },
      ],
    },
  },
  anxiety: {
    score: 72,
    severity: "Moderate to Severe",
    interpretation:
      "Your responses indicate moderate to severe anxiety symptoms. These results suggest that your anxiety levels may be interfering with your daily functioning and well-being.",
    recommendations: [
      "Consider consulting with a mental health professional for a comprehensive evaluation",
      "Learn and practice relaxation techniques such as deep breathing and progressive muscle relaxation",
      "Establish a regular exercise routine, which can help reduce anxiety",
      "Consider cognitive-behavioral therapy (CBT), which is highly effective for anxiety disorders",
    ],
    resources: [
      { title: "Understanding Anxiety Disorders", type: "article", link: "/resources/anxiety-understanding" },
      { title: "Anxiety Management Techniques", type: "video", link: "/resources/anxiety-techniques" },
      { title: "Anxiety Support Group", type: "community", link: "/community/anxiety-support" },
    ],
    chartData: {
      domains: [
        { name: "Worry", score: 80 },
        { name: "Physical Symptoms", score: 65 },
        { name: "Avoidance", score: 70 },
        { name: "Social Anxiety", score: 75 },
        { name: "Panic", score: 60 },
      ],
      comparison: [
        { name: "Your Score", value: 72 },
        { name: "Average", value: 45 },
        { name: "Clinical Threshold", value: 63 },
      ],
    },
  },
  depression: {
    score: 58,
    severity: "Mild to Moderate",
    interpretation:
      "Your responses indicate mild to moderate symptoms of depression. While not severe, these symptoms may be affecting your quality of life and daily functioning.",
    recommendations: [
      "Consider speaking with a mental health professional for a comprehensive evaluation",
      "Establish a regular exercise routine, which can help improve mood",
      "Practice self-care activities that you enjoy and find meaningful",
      "Consider mindfulness meditation to help manage negative thoughts",
    ],
    resources: [
      { title: "Understanding Depression", type: "article", link: "/resources/depression-understanding" },
      { title: "Mood-Boosting Strategies", type: "video", link: "/resources/depression-strategies" },
      { title: "Depression Support Group", type: "community", link: "/community/depression-support" },
    ],
    chartData: {
      domains: [
        { name: "Mood", score: 65 },
        { name: "Interest", score: 60 },
        { name: "Sleep", score: 55 },
        { name: "Energy", score: 50 },
        { name: "Concentration", score: 60 },
      ],
      comparison: [
        { name: "Your Score", value: 58 },
        { name: "Average", value: 40 },
        { name: "Clinical Threshold", value: 60 },
      ],
    },
  },
  // Add more test results for other test types
}

// Helper function to get severity color
const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case "minimal":
      return "text-green-500"
    case "mild":
    case "mild to moderate":
      return "text-yellow-500"
    case "moderate":
      return "text-orange-500"
    case "moderate to severe":
    case "severe":
      return "text-red-500"
    default:
      return "text-blue-500"
  }
}

// Helper function to get alert variant based on severity
const getSeverityVariant = (severity: string) => {
  if (severity.toLowerCase().includes("minimal") || severity.toLowerCase().includes("mild")) {
    return "default"
  } else if (severity.toLowerCase().includes("moderate")) {
    return "warning"
  } else if (severity.toLowerCase().includes("severe")) {
    return "destructive"
  }
  return "default"
}

export default function AssessmentResults() {
  const searchParams = useSearchParams()
  const [testType, setTestType] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    const test = searchParams.get("test")
    if (test && testResults[test as keyof typeof testResults]) {
      setTestType(test)
      setResult(testResults[test as keyof typeof testResults])
    } else {
      // Default to a random test if none specified
      const defaultTest = Object.keys(testResults)[0]
      setTestType(defaultTest)
      setResult(testResults[defaultTest as keyof typeof testResults])
    }
  }, [searchParams])

  if (!result) {
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <main className="max-w-4xl mx-auto mt-8 p-4">
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <p>Loading results...</p>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const testTitle = testType ? testType.charAt(0).toUpperCase() + testType.slice(1) : ""
  const severityColor = getSeverityColor(result.severity)
  const alertVariant = getSeverityVariant(result.severity)

  // Custom colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="max-w-4xl mx-auto mt-8 p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{testTitle} Assessment Results</h1>
          <p className="text-muted-foreground">
            Completed on {new Date().toLocaleDateString()} • These results are for informational purposes only and do
            not constitute a diagnosis
          </p>
        </div>

        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>Your assessment results at a glance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold mb-2">
                      {result.score}
                      <span className="text-xl">/100</span>
                    </div>
                    <div className={`text-xl font-semibold ${severityColor}`}>{result.severity}</div>
                  </div>
                  <Progress
                    value={result.score}
                    className="h-3"
                    // Add gradient color based on score
                    style={{
                      background: "linear-gradient(to right, #22c55e, #eab308, #ef4444)",
                    }}
                  />
                  <div className="flex justify-between text-sm mt-1">
                    <span>Minimal</span>
                    <span>Moderate</span>
                    <span>Severe</span>
                  </div>
                </div>
                <div className="flex-1">
                   <Alert variant={alertVariant === "warning" ? "default" : alertVariant}>
                    {alertVariant === "destructive" ? (
                      <AlertTriangle className="h-4 w-4" />
                    ) : alertVariant === "warning" ? (
                      <Info className="h-4 w-4" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    <AlertTitle>Interpretation</AlertTitle>
                    <AlertDescription>{result.interpretation}</AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/counseling">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Consultation
                </Link>
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Results
              </Button>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share with Provider
              </Button>
            </CardFooter>
          </Card>

          {/* Detailed Results */}
          <Tabs defaultValue="breakdown">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="breakdown">Detailed Breakdown</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="breakdown" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Domain Scores</CardTitle>
                  <CardDescription>Breakdown of your results by specific areas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={result.chartData.domains} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="score" name="Score" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Comparison</CardTitle>
                  <CardDescription>How your scores compare to reference points</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={result.chartData.comparison}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {result.chartData.comparison.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations">
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                  <CardDescription>Based on your assessment results</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {result.recommendations.map((recommendation: string, index: number) => (
                      <li key={index} className="flex gap-2">
                        <div className="flex-shrink-0 mt-1">
                          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm">
                            {index + 1}
                          </div>
                        </div>
                        <p>{recommendation}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/counseling">
                      <Brain className="mr-2 h-4 w-4" />
                      Talk to a Professional
                    </Link>
                  </Button>
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
                  <div className="space-y-4">
                    {result.resources.map((resource: any, index: number) => (
                      <Card key={index} className="overflow-hidden">
                        <div className="flex items-center p-4">
                          <div className="mr-4">
                            {resource.type === "article" ? (
                              <BookOpen className="h-8 w-8 text-blue-500" />
                            ) : resource.type === "video" ? (
                              <Video className="h-8 w-8 text-red-500" />
                            ) : (
                              <Users className="h-8 w-8 text-green-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{resource.title}</h3>
                            <p className="text-sm text-muted-foreground capitalize">{resource.type}</p>
                          </div>
                          <Button asChild variant="ghost" size="icon">
                            <Link href={resource.link}>
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/resources">View All Resources</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>Continue your mental health journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button asChild className="h-auto py-4 flex flex-col">
                  <Link href="/assessment/detailed">
                    <Brain className="mb-2 h-6 w-6" />
                    <span className="font-semibold">Take Another Assessment</span>
                    <span className="text-xs mt-1">Explore different aspects of your mental health</span>
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="h-auto py-4 flex flex-col">
                  <Link href="/dashboard">
                    <BarChart2 className="mb-2 h-6 w-6" />
                    <span className="font-semibold">View Your Dashboard</span>
                    <span className="text-xs mt-1">Track your progress over time</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto py-4 flex flex-col">
                  <Link href="/resources">
                    <BookOpen className="mb-2 h-6 w-6" />
                    <span className="font-semibold">Explore Resources</span>
                    <span className="text-xs mt-1">Find helpful articles, videos, and tools</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Disclaimer: These results are for informational purposes only and do not constitute a diagnosis. Please
              consult with a qualified mental health professional for a proper evaluation.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}