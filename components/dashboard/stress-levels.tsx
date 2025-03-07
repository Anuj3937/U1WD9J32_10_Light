"use client"

import { Progress } from "@/components/ui/progress"

export function StressLevels() {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between mb-2 text-sm">
          <span>Academic</span>
          <span>High</span>
        </div>
        <Progress value={75} className="h-2" />
      </div>
      <div>
        <div className="flex justify-between mb-2 text-sm">
          <span>Social</span>
          <span>Medium</span>
        </div>
        <Progress value={45} className="h-2" />
      </div>
      <div>
        <div className="flex justify-between mb-2 text-sm">
          <span>Personal</span>
          <span>Low</span>
        </div>
        <Progress value={25} className="h-2" />
      </div>
    </div>
  )
}

