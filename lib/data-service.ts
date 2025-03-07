import { create } from "zustand"
import { persist } from "zustand/middleware"

export type MoodEntry = {
  date: string
  day?: string
  mood: number
  activities: string[]
  notes: string
  stress_level: number
}

export type Goal = {
  id: string
  title: string
  description: string
  target: number
  current: number
  type: "daily" | "weekly" | "monthly"
  category: "mindfulness" | "exercise" | "social" | "sleep" | "study"
}

export type Reminder = {
  id: string
  title: string
  time: string
  days: string[]
  type: "meditation" | "exercise" | "medication" | "study" | "social"
  completed: boolean
}

interface MentalHealthStore {
  moodEntries: MoodEntry[]
  goals: Goal[]
  reminders: Reminder[]
  assessmentScores: number[]
  addMoodEntry: (entry: MoodEntry) => void
  addGoal: (goal: Goal) => void
  updateGoal: (id: string, progress: number) => void
  updateGoalDetails: (id: string, details: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  addReminder: (reminder: Reminder) => void
  toggleReminder: (id: string) => void
}

export const useMentalHealthStore = create<MentalHealthStore>()(
  persist(
    (set) => ({
      moodEntries: [],
      goals: [],
      reminders: [],
      assessmentScores: [],
      addMoodEntry: (entry) =>
        set((state) => ({
          moodEntries: [...state.moodEntries, entry],
        })),
      addGoal: (goal) =>
        set((state) => ({
          goals: [...state.goals, goal],
        })),
      updateGoal: (id, progress) =>
        set((state) => ({
          goals: state.goals.map((goal) => (goal.id === id ? { ...goal, current: progress } : goal)),
        })),
      updateGoalDetails: (id, details) =>
        set((state) => ({
          goals: state.goals.map((goal) => (goal.id === id ? { ...goal, ...details } : goal)),
        })),
      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        })),
      addReminder: (reminder) =>
        set((state) => ({
          reminders: [...state.reminders, reminder],
        })),
      toggleReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.map((reminder) =>
            reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder,
          ),
        })),
    }),
    {
      name: "mental-health-storage",
    },
  ),
)

