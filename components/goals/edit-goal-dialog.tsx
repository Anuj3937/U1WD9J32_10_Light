"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMentalHealthStore } from "@/lib/data-service"
import { useToast } from "@/components/ui/use-toast"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type EditGoalDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  goalId: string
}

export function EditGoalDialog({ open, onOpenChange, goalId }: EditGoalDialogProps) {
  const { toast } = useToast()
  const goals = useMentalHealthStore((state) => state.goals)
  const updateGoal = useMentalHealthStore((state) => state.updateGoalDetails)
  const deleteGoal = useMentalHealthStore((state) => state.deleteGoal)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [target, setTarget] = useState(0)
  const [type, setType] = useState<"daily" | "weekly" | "monthly">("daily")
  const [category, setCategory] = useState<string>("mindfulness")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (open && goalId) {
      const goal = goals.find((g) => g.id === goalId)
      if (goal) {
        setTitle(goal.title)
        setDescription(goal.description)
        setTarget(goal.target)
        setType(goal.type)
        setCategory(goal.category)
      }
    }
  }, [open, goalId, goals])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !description.trim() || target <= 0) {
      toast({
        title: "Invalid input",
        description: "Please fill all fields with valid values.",
        variant: "destructive",
      })
      return
    }

    updateGoal(goalId, {
      title,
      description,
      target,
      type,
      category,
    })

    toast({
      title: "Goal updated",
      description: "Your goal has been updated successfully.",
    })

    onOpenChange(false)
  }

  const handleDelete = () => {
    deleteGoal(goalId)
    setShowDeleteConfirm(false)
    onOpenChange(false)

    toast({
      title: "Goal deleted",
      description: "Your goal has been deleted successfully.",
    })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
            <DialogDescription>Update your goal details or progress</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Goal Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target">Target</Label>
              <Input
                id="target"
                type="number"
                min="1"
                value={target}
                onChange={(e) => setTarget(Number.parseInt(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Frequency</Label>
              <Select value={type} onValueChange={(value) => setType(value as "daily" | "weekly" | "monthly")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mindfulness">Mindfulness</SelectItem>
                  <SelectItem value="exercise">Exercise</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="sleep">Sleep</SelectItem>
                  <SelectItem value="study">Study</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between pt-4">
              <Button type="button" variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Goal
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this goal and all associated progress. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

