"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMentalHealthStore } from "@/lib/data-service";

export function AddGoalDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const addGoal = useMentalHealthStore((state) => state.addGoal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    addGoal({
      id: crypto.randomUUID(),
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      target: Number(formData.get("target")),
      current: 0,
      type: formData.get("type") as "daily" | "weekly" | "monthly",
      category: formData.get("category") as any,
    });

    onOpenChange(false); // Close the dialog
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={() => onOpenChange(true)}>Add Goal</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Goal</DialogTitle>
          <DialogDescription>
            Set a new goal to improve your mental well-being
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input id="title" name="title" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target">Target</Label>
            <Input id="target" name="target" type="number" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Frequency</Label>
            <Select name="type" required>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
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
            <Select name="category" required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
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
          <Button type="submit" className="w-full">
            Add Goal
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
