"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SplitText from "@/components/landing/SplitText";

export default function Onboarding() {
  const [isSociallyAwkward, setIsSociallyAwkward] = useState<boolean | null>(
    null
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-6 text-center">
        <h1 className="text-4xl font-bold">
          Welcome <br />
          to <br />
          MindScape
        </h1>
        <SplitText
          text="Let's take the first step toward better mental health."
          className="text-lg text-gray-500 dark:text-gray-400 mt-2"
          delay={50}
          animationFrom={{ opacity: 0, transform: "translate3d(0,20px,0)" }}
          animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
        />

        <div className="mt-6 space-y-4">
          <Button asChild size="lg" variant="outline">
            <Link href="/assessment" className="text-lg">
              Take a Quick Mental Health Test
            </Link>
          </Button>

          {/* Added Interactive Story Section */}
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Have 10 minutes? Explore an interactive story to discover more about
            yourself.
          </p>
          <Button asChild size="lg" variant="outline">
            <Link href="/story" className="text-lg">
              Start the Journey
            </Link>
          </Button>
        </div>

        {isSociallyAwkward === null && (
          <div className="mt-6">
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Do you consider yourself socially awkward?
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <Button
                onClick={() => setIsSociallyAwkward(true)}
                variant="outline"
                className="text-lg"
              >
                Yes
              </Button>
              <Button
                onClick={() => setIsSociallyAwkward(false)}
                variant="outline"
                className="text-lg"
              >
                No
              </Button>
            </div>
          </div>
        )}

        {isSociallyAwkward !== null && (
          <div className="mt-6 space-y-4">
            {isSociallyAwkward ? (
              <Button asChild size="lg" className="text-lg">
                <Link href="/chat">Talk to a Chatbot</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="text-lg">
                  <Link href="/community">
                    Join Chatrooms (Sign In Required)
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg">
                  <Link href="/resources">Talk to a Therapist</Link>
                </Button>
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
