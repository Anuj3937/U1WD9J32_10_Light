import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          {/* Left-aligned logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold">MindfulStudent</span>
          </div>

          {/* Right-aligned buttons */}
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="flex flex-col items-center justify-center space-y-4 text-center py-12 md:py-16 lg:py-20">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Your Mental Health Matters
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Connect with licensed therapists, join supportive communities, and
              take control of your mental well-being.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <Button asChild size="lg">
              <Link href="/auth/signup">Start Your Journey</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/therapist/signup">Join as Therapist</Link>
            </Button>
          </div>
        </section>

        <section className="py-12 md:py-16 lg:py-20">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Licensed Therapists",
                desc: "Connect with verified mental health professionals",
              },
              {
                title: "Safe Community",
                desc: "Join moderated support groups and share experiences",
              },
              {
                title: "Video Diary",
                desc: "Track your journey with private video entries",
              },
            ].map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                    <div className="space-y-1">
                      <h3 className="font-bold">{feature.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="py-12 md:py-16 lg:py-20">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter">
                For Therapists
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Join our platform to expand your practice and help more people.
                We offer flexible subscription plans and tools to manage your
                clients effectively.
              </p>
              <ul className="space-y-2">
                {[
                  "Secure video sessions platform",
                  "Client management tools",
                  "Community moderation opportunities",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild>
                <Link href="/auth/therapist/signup">Join as Therapist</Link>
              </Button>
            </div>
            <div className="relative h-[300px] rounded-lg overflow-hidden">
              <img
                src="/placeholder.svg?height=300&width=500"
                alt="Therapist dashboard preview"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
