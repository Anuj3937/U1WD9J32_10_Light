"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Background from "@/components/landing/background";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center bg-background text-center">
      <header className="relative z-10 border-b w-full shadow-sm flex justify-center backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-6 md:px-8 max-w-6xl w-full">
          <span className="text-3xl font-bold text-primary">
            MindScape
          </span>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>
      <Background
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />

      <main className="relative z-10 container px-6 md:px-8 flex flex-col items-center py-16 space-y-12">
        {/* Hero Section */}
        <section className="space-y-6 max-w-3xl">
          <h1 className="text-5xl font-bold leading-tight sm:text-6xl text-white">
            Your Mental Health Matters
          </h1>
          <p className="text-lg text-gray-200 dark:text-gray-400">
            Connect with licensed therapists, join supportive communities, and
            take control of your mental well-being.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/onboarding">Start Your Journey</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/therapist/signup">Join as Therapist</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl">
          {[
            {
              title: "Therapist Sessions",
              description:
                "One-on-one therapy from home or in person with verified professionals.",
            },
            {
              title: "AI Therapist Chatbot",
              description:
                "Get 24/7 support with our intelligent and empathetic chatbot.",
            },
            {
              title: "Mental Health Chatrooms",
              description:
                "Join supportive communities and share your experiences anonymously.",
            },
            {
              title: "Video Diaries + AI Insights",
              description:
                "Track your journey with private video entries and AI-powered reflections.",
            },
            {
              title: "Interactive Story Sessions",
              description:
                "Engage in guided narratives that help improve mindfulness and resilience.",
            },
          ].map((feature, index) => (
            <Card key={index}>
              <CardContent className="p-6 flex flex-col items-center">
                <CheckCircle2 className="w-10 h-10 text-primary" />
                <h3 className="text-xl font-bold mt-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-300 dark:text-gray-400 mt-1">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* For Therapists */}
        <section className="max-w-4xl text-left">
          <h2 className="text-4xl font-bold text-center">For Therapists</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mt-3">
            Expand your practice and reach more clients with our tools designed
            to support you.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mt-6">
            <ul className="space-y-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                <span>Secure video sessions & flexible scheduling</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                <span>Detailed patient insights with AI analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                <span>Community moderation opportunities</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                <span>Access to various patient demographics</span>
              </li>
            </ul>
            <div className="relative h-[300px] rounded-lg overflow-hidden">
              <img
                src="https://www.talktoangel.com/images/BecomeTeam.svg?height=300&width=500"
                alt="Therapist dashboard preview"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          <div className="text-center mt-6">
            <Button asChild>
              <Link href="/auth/therapist/signup">Join as Therapist</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
