"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useMentalHealthStore } from "@/lib/data-service"
import { useToast } from "@/components/ui/use-toast"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2 } from "lucide-react"

type UpdateProgressDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  goalId: string
}

export function UpdateProgressDialog({ open, onOpenChange, goalId }: UpdateProgressDialogProps) {
  const { toast } = useToast()
  const goals = useMentalHealthStore((state) => state.goals)
  const updateGoal = useMentalHealthStore((state) => state.updateGoal)

  const [progress, setProgress] = useState(0)
  const [goal, setGoal] = useState<any>(null)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    if (open && goalId) {
      const foundGoal = goals.find((g) => g.id === goalId)
      if (foundGoal) {
        setGoal(foundGoal)
        setProgress(foundGoal.current)
        setIsCompleted(foundGoal.current >= foundGoal.target)
      }
    }
  }, [open, goalId, goals])

  const handleSubmit = () => {
    if (!goal) return

    updateGoal(goalId, progress)

    const newIsCompleted = progress >= goal.target

    if (newIsCompleted && !isCompleted) {
      toast({
        title: "Goal completed! 🎉",
        description: `Congratulations on completing your goal: ${goal.title}`,
      })
    } else {
      toast({
        title: "Progress updated",
        description: "Your goal progress has been updated successfully.",
      })
    }

    onOpenChange(false)
  }

  if (!goal) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Progress</DialogTitle>
          <DialogDescription>Track your progress for: {goal.title}</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Current Progress</Label>
              <span className="font-medium">
                {progress} / {goal.target}
              </span>
            </div>
            <Progress value={(progress / goal.target) * 100} />
          </div>

          <div className="space-y-4">
            <Label>Adjust Progress</Label>
            <Slider
              value={[progress]}
              max={Math.max(goal.target * 1.5, progress + 5)}
              step={1}
              onValueChange={(value) => setProgress(value[0])}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0</span>
              <span>Target: {goal.target}</span>
              <span>{Math.max(goal.target * 1.5, progress + 5)}</span>
            </div>
          </div>

          {progress >= goal.target && (
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-green-700 dark:text-green-300">Congratulations! You've reached your target.</span>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit}>Save Progress</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

