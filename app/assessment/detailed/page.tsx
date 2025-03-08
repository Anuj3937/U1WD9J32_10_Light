"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { testTypes } from "./testTypes";
import { testQuestions } from "./testQuestions";

export default function DetailedAssessment() {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();

  // If a test is selected, get its questions
  const questions = selectedTest
    ? testQuestions[selectedTest as keyof typeof testQuestions] || []
    : [];
  const progress = selectedTest
    ? ((currentQuestion + 1) / questions.length) * 100
    : 0;

  const handleTestSelect = (testId: string) => {
    setSelectedTest(testId);
    setCurrentQuestion(0);
    setAnswers({});
    setNotes("");
  };

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    const currentQuestionData = questions[currentQuestion];

    if (!answers[currentQuestionData.id]) {
      toast({
        title: "Please answer the question",
        description: "You need to select an option before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Last question, complete the test
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      // First question, go back to test selection
      setSelectedTest(null);
    }
  };

  const handleComplete = () => {
    // Store test results in localStorage or state management
    const testResults = {
      testType: selectedTest,
      answers,
      notes,
      timestamp: new Date().toISOString(),
    };

    // In a real app, you would save this to your backend
    console.log("Test results:", testResults);

    // Navigate to results page with the test type
    router.push(`/assessment/results?test=${selectedTest}`);
  };

  // If no test is selected, show the test selection screen
  if (!selectedTest) {
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <main className="max-w-7xl mx-auto mt-8 p-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Detailed Mental Health Assessments
            </h1>
            <p className="text-muted-foreground">
              Select a specific assessment to gain deeper insights into your
              mental well-being.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testTypes.map((test) => (
              <Card
                key={test.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleTestSelect(test.id)}
              >
                <CardHeader className="flex flex-row items-start space-y-0 pb-2">
                  <div className="flex-1">
                    <CardTitle>{test.title}</CardTitle>
                    <CardDescription>{test.description}</CardDescription>
                  </div>
                  <div className="ml-4">{test.icon}</div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{test.questions} questions</span>
                    <span>Takes {test.time}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Start Assessment</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Show the selected test questions
  const currentQuestionData = questions[currentQuestion];
  const selectedTestInfo = testTypes.find((t) => t.id === selectedTest);

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="max-w-4xl mx-auto mt-8 p-4">
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Button
              variant="ghost"
              onClick={() => setSelectedTest(null)}
              className="mr-2"
            >
              â† Back to Tests
            </Button>
            <h1 className="text-2xl font-bold">{selectedTestInfo?.title}</h1>
          </div>
          <Progress value={progress} className="mb-2" />
          <p className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{selectedTestInfo?.title} Assessment</CardTitle>
            <CardDescription>
              Please answer honestly for the most accurate results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentQuestionData && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage
                      src={`/placeholder.svg?height=100&width=100`}
                    />
                    <AvatarFallback>Q</AvatarFallback>
                  </Avatar>
                  <p className="text-lg">{currentQuestionData.text}</p>
                </div>
                <RadioGroup
                  value={answers[currentQuestionData.id]}
                  onValueChange={(value) =>
                    handleAnswer(currentQuestionData.id, value)
                  }
                  className="space-y-2"
                >
                  {currentQuestionData.options.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={`${currentQuestionData.id}-${option.value}`}
                      />
                      <Label
                        htmlFor={`${currentQuestionData.id}-${option.value}`}
                        className="w-full p-3 rounded-md hover:bg-muted cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {currentQuestion === questions.length - 1 && (
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Share any additional thoughts or concerns..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious}>
              Previous
            </Button>
            <Button onClick={handleNext}>
              {currentQuestion === questions.length - 1 ? "Complete" : "Next"}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
