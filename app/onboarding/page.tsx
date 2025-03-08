"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Onboarding() {
  const [isSociallyAwkward, setIsSociallyAwkward] = useState<boolean | null>(
    null
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-6 text-center">
        <h1 className="text-3xl font-bold">Welcome to MindfulStudent</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Let's take the first step toward better mental health.
        </p>
        <div className="mt-6 space-y-4">
          <Button asChild size="lg" variant="outline">
            <Link href="/assessment">Take a Quick Mental Health Test</Link>
          </Button>
        </div>
        {isSociallyAwkward === null && (
          <div className="mt-6">
            <p className="text-gray-500 dark:text-gray-400">
              Do you consider yourself socially awkward?
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <Button
                onClick={() => setIsSociallyAwkward(true)}
                variant="outline"
              >
                Yes
              </Button>
              <Button
                onClick={() => setIsSociallyAwkward(false)}
                variant="outline"
              >
                No
              </Button>
            </div>
          </div>
        )}
        {isSociallyAwkward !== null && (
          <div className="mt-6 space-y-4">
            {isSociallyAwkward ? (
              <Button asChild size="lg">
                <Link href="/chat">Talk to a Chatbot</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link href="/community">
                    Join Chatrooms (Sign In Required)
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
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
