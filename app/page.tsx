"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Background from "@/components/landing/background";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-background text-center">
      <header className="relative border-b w-full shadow-sm flex justify-center backdrop-blur-lg bg-white/10 border-white/20 overflow-visible">
        <div className="absolute inset-0 -z-10 overflow-visible">
          <Background
            colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
            blend={0.5}
            amplitude={2.0}
            speed={0.9}
          />
        </div>
        <div className="container flex h-16 items-center justify-between px-6 md:px-8 max-w-6xl w-full">
          <span className="text-3xl font-bold text-primary">MindScape</span>
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

      <main className="container px-6 md:px-8 flex flex-col items-center py-16 space-y-12">
        {/* Hero Section */}
        <section className="space-y-6 max-w-3xl">
          <h1 className="text-5xl font-bold leading-tight sm:text-6xl">
            Take One Step at a Time
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            No pressure, no rush—just support. Let’s start with what you need
            today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/onboarding">Get Started</Link>
            </Button>
          </div>
        </section>

        {/* Personalized Choices */}
        <section className="space-y-6 max-w-xl">
          <h2 className="text-3xl font-bold">What brings you here today?</h2>
          <div className="grid gap-6">
            {[
              { text: "I need someone to talk to", link: "/chat" },
              {
                text: "I want to track my mental health",
                link: "/video-diary",
              },
              {
                text: "I’d like to explore a supportive community",
                link: "/auth/login",
              },
              // { text: "I just want to look around", link: "/onboarding" },
              {
                text: "I feel I might be about to do self harm.",
                link: "/assessment/crisis",
              },
            ].map((option, index) => (
              <Button
                key={index}
                asChild
                variant="outline"
                className="w-full py-4 text-lg"
              >
                <Link href={option.link}>{option.text}</Link>
              </Button>
            ))}
          </div>
        </section>

        {/* Gentle Introduction to Features */}
        <section className="max-w-5xl space-y-12">
          <h2 className="text-3xl font-bold">How MindfulStudent Can Help</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "One-on-One Therapy",
                description:
                  "Talk to a professional therapist from home or in person, whenever you’re ready.",
              },
              {
                title: "AI Chat Companion",
                description:
                  "Get gentle, supportive conversations anytime with our AI-powered assistant.",
              },
              {
                title: "Supportive Communities",
                description:
                  "Join anonymous chatrooms where you can share and listen safely.",
              },
            ].map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6 flex flex-col items-center">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                  <h3 className="text-xl font-bold mt-3">{feature.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* For Therapists (Separate Section) */}
        <section className="max-w-4xl text-left py-16 rounded-lg px-6">
          <h2 className="text-4xl font-bold text-center">For Therapists</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mt-3">
            Expand your practice and reach more clients with our intuitive
            platform.
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
                <span>Access to various patient demographics</span>
              </li>
            </ul>
            <div className="relative h-[300px] rounded-lg overflow-hidden">
              <img
                src="landing_therapist.svg"
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
