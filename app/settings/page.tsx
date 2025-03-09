"use client"
import React, { useState } from "react"
import { Nav } from "@/components/nav"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Settings() {
  // Notifications settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [weeklySummary, setWeeklySummary] = useState(true)

  // Privacy settings
  const [confidentialMode, setConfidentialMode] = useState(true)
  const [shareData, setShareData] = useState(false)

  // Theme and language settings
  const [theme, setTheme] = useState("dark")
  const [language, setLanguage] = useState("en")

  // Reminders settings
  const [reminderFrequency, setReminderFrequency] = useState("daily")
  const [emergencyContact, setEmergencyContact] = useState("")

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle saving settings (for example, sending data to an API)
    console.log("Settings saved", {
      emailNotifications,
      smsNotifications,
      weeklySummary,
      confidentialMode,
      shareData,
      theme,
      language,
      reminderFrequency,
      emergencyContact,
    })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Nav />
      <main className="max-w-2xl mx-auto p-8">
        <Card className="bg-gray-800 p-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              {/* Notifications Settings */}
              <div>
                <h2 className="text-xl font-semibold mb-2">Notifications</h2>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="mr-2"
                    />
                    Email Notifications
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={smsNotifications}
                      onChange={(e) => setSmsNotifications(e.target.checked)}
                      className="mr-2"
                    />
                    SMS Notifications
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={weeklySummary}
                      onChange={(e) => setWeeklySummary(e.target.checked)}
                      className="mr-2"
                    />
                    Receive Weekly Summary
                  </label>
                </div>
              </div>

              {/* Privacy Settings */}
              <div>
                <h2 className="text-xl font-semibold mb-2">Privacy</h2>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={confidentialMode}
                      onChange={(e) => setConfidentialMode(e.target.checked)}
                      className="mr-2"
                    />
                    Enable Confidential Mode
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={shareData}
                      onChange={(e) => setShareData(e.target.checked)}
                      className="mr-2"
                    />
                    Allow sharing of anonymized data for research
                  </label>
                </div>
              </div>

              {/* Appearance & Language Settings */}
              <div>
                <h2 className="text-xl font-semibold mb-2">Appearance & Language</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium mb-1">Theme</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="theme"
                          value="dark"
                          checked={theme === "dark"}
                          onChange={(e) => setTheme(e.target.value)}
                          className="mr-2"
                        />
                        Dark
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="theme"
                          value="light"
                          checked={theme === "light"}
                          onChange={(e) => setTheme(e.target.value)}
                          className="mr-2"
                        />
                        Light
                      </label>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="language" className="block font-medium mb-1">
                      Language
                    </label>
                    <select
                      id="language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full border border-gray-600 rounded-md p-2 bg-gray-900 text-white"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      {/* Add additional languages as needed */}
                    </select>
                  </div>
                </div>
              </div>

              {/* Reminders Settings */}
              <div>
                <h2 className="text-xl font-semibold mb-2">Reminders</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="reminderFrequency" className="block font-medium mb-1">
                      Reminder Frequency
                    </label>
                    <select
                      id="reminderFrequency"
                      value={reminderFrequency}
                      onChange={(e) => setReminderFrequency(e.target.value)}
                      className="w-full border border-gray-600 rounded-md p-2 bg-gray-900 text-white"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="emergencyContact" className="block font-medium mb-1">
                      Emergency Contact
                    </label>
                    <input
                      type="tel"
                      id="emergencyContact"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder="Enter emergency contact number"
                      className="w-full border border-gray-600 rounded-md p-2 bg-gray-900 text-white"
                    />
                  </div>
                </div>
              </div>

              <CardFooter className="flex justify-end">
                <Button type="submit">Save Settings</Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
