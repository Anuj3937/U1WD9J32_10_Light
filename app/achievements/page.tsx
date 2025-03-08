"use client";

import { useState } from "react";
import { Nav } from "@/components/nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { Rewards } from "@/components/gamification/rewards";

export default function Achievements() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="max-w-5xl mx-auto mt-8 p-4 space-y-6">
        <div className="mt-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <CardTitle>Achievements</CardTitle>
              </div>
              <CardDescription>Your progress and rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <Rewards />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
