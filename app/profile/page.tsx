"use client"
import React, { useState, useRef } from "react"
import { Nav } from "@/components/nav"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Profile() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [age, setAge] = useState<number | "">("")
  const [birthDate, setBirthDate] = useState("")
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  // Reference for hidden file input to trigger file dialog
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfilePhoto(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Implement saving logic (e.g., API call) here
    console.log("Profile saved", { name, phone, email, age, birthDate, profilePhoto })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Nav />
      <main className="max-w-2xl mx-auto p-8">
        {/* Profile Photo Section */}
        <div className="mb-8 text-center">
          <div className="relative w-32 h-32 mx-auto group">
            <img
              src={photoPreview ? photoPreview : "/default-profile.png"}
              alt="Profile Photo"
              className="w-32 h-32 object-cover rounded-full border-4 border-gray-600"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition duration-300">
              <button
                type="button"
                className="text-white text-sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Edit Photo
              </button>
            </div>
          </div>
          {/* Hidden file input */}
          <input
            type="file"
            id="profilePhoto"
            accept="image/*"
            onChange={handlePhotoChange}
            ref={fileInputRef}
            className="hidden"
          />
        </div>

        {/* Edit Profile Form */}
        <Card className="bg-gray-800 p-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label htmlFor="name" className="block font-medium mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full border border-gray-600 rounded-md p-2 bg-gray-900 text-white"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full border border-gray-600 rounded-md p-2 bg-gray-900 text-white"
                />
              </div>
              <div>
                <label htmlFor="email" className="block font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full border border-gray-600 rounded-md p-2 bg-gray-900 text-white"
                />
              </div>
              <div>
                <label htmlFor="age" className="block font-medium mb-1">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  placeholder="Enter your age"
                  className="w-full border border-gray-600 rounded-md p-2 bg-gray-900 text-white"
                />
              </div>
              <div>
                <label htmlFor="birthDate" className="block font-medium mb-1">
                  Birth Date
                </label>
                <input
                  type="date"
                  id="birthDate"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full border border-gray-600 rounded-md p-2 bg-gray-900 text-white"
                />
              </div>
              <CardFooter className="flex justify-end">
                <Button type="submit">Save Profile</Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
