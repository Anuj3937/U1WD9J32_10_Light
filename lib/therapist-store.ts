import { create } from "zustand"
import { persist } from "zustand/middleware"
import { format, addDays } from "date-fns"

// Sample data
const samplePatients = [
  {
    id: "p1",
    name: "Sarah Mitchell",
    age: 22,
    email: "sarah.mitchell@example.com",
    phone: "555-123-4567",
    address: "123 Main St, Anytown, USA",
    diagnosis: "Generalized Anxiety Disorder",
    status: "active",
    nextSession: format(addDays(new Date(), 2), "yyyy-MM-dd"),
    progress: "Improving",
    lastVisit: format(addDays(new Date(), -7), "yyyy-MM-dd"),
    treatmentPlan: "Weekly CBT sessions focusing on anxiety management techniques",
    medications: [
      {
        id: "m1",
        name: "Sertraline",
        dosage: "50mg",
        frequency: "Once daily",
        status: "Current",
        notes: "Started 3 months ago, patient reports reduced anxiety",
      },
    ],
    notes: [
      {
        id: "n1",
        type: "text",
        title: "Initial Assessment",
        content:
          "Patient presents with symptoms of anxiety including excessive worry, restlessness, and difficulty concentrating. Reports onset following academic stress.",
        date: format(addDays(new Date(), -30), "yyyy-MM-dd'T'HH:mm:ss"),
      },
      {
        id: "n2",
        type: "text",
        title: "Follow-up Session",
        content:
          "Patient reports improvement in anxiety symptoms. Has been practicing mindfulness techniques daily. Sleep has improved.",
        date: format(addDays(new Date(), -14), "yyyy-MM-dd'T'HH:mm:ss"),
      },
    ],
    avatar: "/placeholder.svg",
  },
  {
    id: "p2",
    name: "John Davis",
    age: 19,
    email: "john.davis@example.com",
    phone: "555-987-6543",
    address: "456 Oak Ave, Collegetown, USA",
    diagnosis: "Major Depressive Disorder",
    status: "active",
    nextSession: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    progress: "Stable",
    lastVisit: format(addDays(new Date(), -5), "yyyy-MM-dd"),
    treatmentPlan: "Biweekly sessions with focus on behavioral activation",
    medications: [
      {
        id: "m2",
        name: "Fluoxetine",
        dosage: "20mg",
        frequency: "Once daily",
        status: "Current",
        notes: "Started 2 months ago",
      },
    ],
    notes: [
      {
        id: "n3",
        type: "text",
        title: "Initial Assessment",
        content:
          "Patient presents with depressive symptoms including low mood, anhedonia, and fatigue. Reports academic difficulties.",
        date: format(addDays(new Date(), -45), "yyyy-MM-dd'T'HH:mm:ss"),
      },
    ],
    avatar: "/placeholder.svg",
  },
  {
    id: "p3",
    name: "Emily Johnson",
    age: 20,
    email: "emily.johnson@example.com",
    phone: "555-456-7890",
    address: "789 Pine St, Universityville, USA",
    diagnosis: "Social Anxiety Disorder",
    status: "active",
    nextSession: format(addDays(new Date(), 4), "yyyy-MM-dd"),
    progress: "Needs Attention",
    lastVisit: format(addDays(new Date(), -10), "yyyy-MM-dd"),
    treatmentPlan: "Weekly exposure therapy with cognitive restructuring",
    medications: [],
    notes: [
      {
        id: "n4",
        type: "text",
        title: "Initial Assessment",
        content:
          "Patient reports significant anxiety in social situations, particularly class presentations and group activities.",
        date: format(addDays(new Date(), -60), "yyyy-MM-dd'T'HH:mm:ss"),
      },
      {
        id: "n5",
        type: "audio",
        title: "Audio Session Notes",
        content: "Audio recording from session discussing social anxiety triggers and coping strategies.",
        date: format(addDays(new Date(), -25), "yyyy-MM-dd'T'HH:mm:ss"),
      },
    ],
    avatar: "/placeholder.svg",
  },
]

const sampleAppointments = [
  {
    id: "a1",
    patientId: "p1",
    patientName: "Sarah Mitchell",
    patientAvatar: "/placeholder.svg",
    date: format(addDays(new Date(), 2).setHours(10, 0, 0, 0), "yyyy-MM-dd'T'HH:mm:ss"),
    type: "Therapy Session",
    status: "confirmed",
    duration: 50,
    notes: "Follow-up on anxiety management techniques",
  },
  {
    id: "a2",
    patientId: "p2",
    patientName: "John Davis",
    patientAvatar: "/placeholder.svg",
    date: format(addDays(new Date(), 1).setHours(14, 0, 0, 0), "yyyy-MM-dd'T'HH:mm:ss"),
    type: "Follow-up",
    status: "confirmed",
    duration: 45,
    notes: "Medication review and mood check",
  },
  {
    id: "a3",
    patientId: "p3",
    patientName: "Emily Johnson",
    patientAvatar: "/placeholder.svg",
    date: format(addDays(new Date(), 4).setHours(11, 30, 0, 0), "yyyy-MM-dd'T'HH:mm:ss"),
    type: "Exposure Therapy",
    status: "pending",
    duration: 60,
    notes: "Planned exposure exercise for social anxiety",
  },
  {
    id: "a4",
    patientId: "p1",
    patientName: "Sarah Mitchell",
    patientAvatar: "/placeholder.svg",
    date: format(addDays(new Date(), -7).setHours(10, 0, 0, 0), "yyyy-MM-dd'T'HH:mm:ss"),
    type: "Therapy Session",
    status: "completed",
    duration: 50,
    notes: "Discussed progress with anxiety management",
  },
  {
    id: "a5",
    patientId: "p2",
    patientName: "John Davis",
    patientAvatar: "/placeholder.svg",
    date: format(addDays(new Date(), -5).setHours(15, 0, 0, 0), "yyyy-MM-dd'T'HH:mm:ss"),
    type: "Therapy Session",
    status: "completed",
    duration: 45,
    notes: "Reviewed behavioral activation exercises",
  },
  {
    id: "a6",
    patientId: "p3",
    patientName: "Emily Johnson",
    patientAvatar: "/placeholder.svg",
    date: format(new Date().setHours(9, 0, 0, 0), "yyyy-MM-dd'T'HH:mm:ss"),
    type: "Crisis Intervention",
    status: "confirmed",
    duration: 30,
    notes: "Urgent session requested by patient",
  },
]

const sampleUrgentCases = [
  {
    id: "u1",
    patientId: "p3",
    patientName: "Emily Johnson",
    title: "Crisis Alert",
    description: "Patient reported suicidal ideation during phone call",
    severity: "high",
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "u2",
    patientId: "p2",
    patientName: "John Davis",
    title: "Missed Session",
    description: "Patient missed 2 consecutive sessions",
    severity: "medium",
    date: format(addDays(new Date(), -2), "yyyy-MM-dd'T'HH:mm:ss"),
  },
  {
    id: "u3",
    patientId: "p1",
    patientName: "Sarah Mitchell",
    title: "Medication Question",
    description: "Patient sent message about medication side effects",
    severity: "low",
    date: format(addDays(new Date(), -1), "yyyy-MM-dd'T'HH:mm:ss"),
  },
]

interface TherapistStore {
  patients: any[]
  appointments: any[]
  urgentCases: any[]
  addPatient: (patient: any) => void
  updatePatient: (id: string, updates: any) => void
  deletePatient: (id: string) => void
  addPatientNote: (patientId: string, note: any) => void
  addAppointment: (appointment: any) => void
  updateAppointment: (id: string, updates: any) => void
  deleteAppointment: (id: string) => void
  addUrgentCase: (urgentCase: any) => void
  resolveUrgentCase: (id: string) => void
}

export const useTherapistStore = create<TherapistStore>()(
  persist(
    (set) => ({
      patients: samplePatients,
      appointments: sampleAppointments,
      urgentCases: sampleUrgentCases,

      addPatient: (patient) =>
        set((state) => ({
          patients: [...state.patients, patient],
        })),

      updatePatient: (id, updates) =>
        set((state) => ({
          patients: state.patients.map((patient) => (patient.id === id ? { ...patient, ...updates } : patient)),
        })),

      deletePatient: (id) =>
        set((state) => ({
          patients: state.patients.filter((patient) => patient.id !== id),
        })),

      addPatientNote: (patientId, note) =>
        set((state) => ({
          patients: state.patients.map((patient) =>
            patient.id === patientId
              ? {
                  ...patient,
                  notes: [...(patient.notes || []), note],
                }
              : patient,
          ),
        })),

      addAppointment: (appointment) =>
        set((state) => ({
          appointments: [...state.appointments, appointment],
        })),

      updateAppointment: (id, updates) =>
        set((state) => ({
          appointments: state.appointments.map((appointment) =>
            appointment.id === id ? { ...appointment, ...updates } : appointment,
          ),
        })),

      deleteAppointment: (id) =>
        set((state) => ({
          appointments: state.appointments.filter((appointment) => appointment.id !== id),
        })),

      addUrgentCase: (urgentCase) =>
        set((state) => ({
          urgentCases: [...state.urgentCases, urgentCase],
        })),

      resolveUrgentCase: (id) =>
        set((state) => ({
          urgentCases: state.urgentCases.filter((urgentCase) => urgentCase.id !== id),
        })),
    }),
    {
      name: "therapist-storage",
    },
  ),
)

