import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">MindfulStudent</span>
          </div>
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
      <main className="container px-4 md:px-6">
        <section className="flex flex-col items-center justify-center space-y-4 text-center py-12 md:py-16 lg:py-20">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Your Mental Health Matters</h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Connect with licensed therapists, join supportive communities, and take control of your mental well-being.
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
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                  <div className="space-y-1">
                    <h3 className="font-bold">Licensed Therapists</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Connect with verified mental health professionals
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                  <div className="space-y-1">
                    <h3 className="font-bold">Safe Community</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Join moderated support groups and share experiences
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                  <div className="space-y-1">
                    <h3 className="font-bold">Video Diary</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Track your journey with private video entries
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-12 md:py-16 lg:py-20">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter">For Therapists</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Join our platform to expand your practice and help more people. We offer flexible subscription plans and
                tools to manage your clients effectively.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>Secure video sessions platform</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>Client management tools</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>Community moderation opportunities</span>
                </li>
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
  )
}

