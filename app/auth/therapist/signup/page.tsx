"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const specializations = [
  "Anxiety & Depression",
  "Stress Management",
  "Academic Pressure",
  "Relationship Counseling",
  "Trauma & PTSD",
  "Eating Disorders",
  "Substance Abuse",
  "Career Counseling",
]

const subscriptionPlans = [
  {
    id: "basic",
    name: "Basic",
    price: "99/month",
    features: ["Up to 20 clients", "Video sessions", "Basic analytics"],
  },
  {
    id: "professional",
    name: "Professional",
    price: "199/month",
    features: ["Unlimited clients", "Advanced analytics", "Priority support", "Community moderation"],
  },
]

export default function TherapistSignup() {
  const [error, setError] = useState("")
  const [step, setStep] = useState(1)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
      return
    }

    try {
      // Here you would make an API call to register the therapist
      router.push("/therapist/dashboard")
    } catch (err) {
      setError("Registration failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Therapist Registration</CardTitle>
          <CardDescription>Join our platform as a mental health professional</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license">License Number</Label>
                  <Input id="license" name="license" required />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="specialization">Primary Specialization</Label>
                  <Select name="specialization" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map((spec) => (
                        <SelectItem key={spec} value={spec.toLowerCase()}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us about your experience and approach"
                    className="min-h-[100px]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input id="experience" name="experience" type="number" min="0" required />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {subscriptionPlans.map((plan) => (
                    <div key={plan.id} className="relative">
                      <input type="radio" name="plan" value={plan.id} id={plan.id} className="peer hidden" required />
                      <label
                        htmlFor={plan.id}
                        className="block p-4 border rounded-lg cursor-pointer peer-checked:border-primary peer-checked:bg-primary/5"
                      >
                        <div className="font-semibold">{plan.name}</div>
                        <div className="text-2xl font-bold my-2">${plan.price}</div>
                        <ul className="text-sm space-y-1">
                          {plan.features.map((feature, index) => (
                            <li key={index}>✓ {feature}</li>
                          ))}
                        </ul>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                  Previous
                </Button>
              )}
              <Button type="submit">{step === 3 ? "Complete Registration" : "Continue"}</Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/therapist/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

