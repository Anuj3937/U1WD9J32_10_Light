"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useTherapistStore } from "@/lib/therapist-store"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"

type AddPatientDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddPatientDialog({ open, onOpenChange }: AddPatientDialogProps) {
  const { toast } = useToast()
  const addPatient = useTherapistStore((state) => state.addPatient)

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    address: "",
    diagnosis: "",
    status: "active",
    notes: "",
    insurance: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.name || !formData.age || !formData.email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Add patient
    addPatient({
      id: crypto.randomUUID(),
      name: formData.name,
      age: Number.parseInt(formData.age),
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      diagnosis: formData.diagnosis,
      status: formData.status as "active" | "on-hold" | "completed",
      notes: formData.notes,
      insurance: formData.insurance,
      avatar: "/placeholder.svg",
      nextSession: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
      progress: "Stable",
      lastVisit: format(new Date(), "yyyy-MM-dd"),
      treatmentPlan: "Initial assessment",
      medications: [],
      sessions: [],
    })

    // Reset form and close dialog
    setFormData({
      name: "",
      age: "",
      email: "",
      phone: "",
      address: "",
      diagnosis: "",
      status: "active",
      notes: "",
      insurance: "",
    })

    toast({
      title: "Patient added",
      description: "The patient has been added successfully.",
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>Enter the patient's information to add them to your practice.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">
                Age <span className="text-red-500">*</span>
              </Label>
              <Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" value={formData.address} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="insurance">Insurance</Label>
              <Input id="insurance" name="insurance" value={formData.insurance} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Initial Diagnosis</Label>
              <Input id="diagnosis" name="diagnosis" value={formData.diagnosis} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Initial Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="min-h-[100px]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Patient</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

