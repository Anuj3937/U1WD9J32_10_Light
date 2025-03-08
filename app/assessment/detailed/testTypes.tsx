import {
  Brain,
  Activity,
  HeartPulse,
  Frown,
  Puzzle,
  Workflow,
  Zap,
  Gauge,
  Utensils,
} from "lucide-react";

export const testTypes = [
  {
    id: "adhd",
    title: "ADHD Test",
    description:
      "Find out if you're experiencing the most common symptoms of ADHD.",
    icon: <Activity className="h-8 w-8 text-blue-500" />,
    questions: 10,
    time: "5-7 minutes",
  },
  {
    id: "anxiety",
    title: "Anxiety Test",
    description:
      "Find out if your anxiety could be a sign of something more serious.",
    icon: <HeartPulse className="h-8 w-8 text-red-500" />,
    questions: 10,
    time: "5-7 minutes",
  },
  {
    id: "bipolar",
    title: "Bipolar Test",
    description:
      "Find out if you are showing some of the symptoms of Bipolar Disorder.",
    icon: <Gauge className="h-8 w-8 text-purple-500" />,
    questions: 10,
    time: "5-7 minutes",
  },
  {
    id: "depression",
    title: "Depression Test",
    description:
      "If you're unsure if you are depressed, our 5-minute test can help evaluate your mood.",
    icon: <Frown className="h-8 w-8 text-gray-500" />,
    questions: 10,
    time: "5-7 minutes",
  },
  {
    id: "autism",
    title: "Autism Test",
    description:
      "Are you experiencing the most common symptoms of autism? Find out using our online test.",
    icon: <Puzzle className="h-8 w-8 text-green-500" />,
    questions: 10,
    time: "5-7 minutes",
  },
  {
    id: "ocd",
    title: "OCD Test",
    description:
      "Find out if you are experiencing the most common symptoms of OCD.",
    icon: <Workflow className="h-8 w-8 text-orange-500" />,
    questions: 10,
    time: "5-7 minutes",
  },
  {
    id: "ptsd",
    title: "PTSD Test",
    description:
      "Are you experiencing the most common symptoms of PTSD? Find out using our online test.",
    icon: <Zap className="h-8 w-8 text-yellow-500" />,
    questions: 10,
    time: "5-7 minutes",
  },
  {
    id: "stress",
    title: "Stress Test",
    description:
      "Find out if your feelings are a sign of something more serious.",
    icon: <Brain className="h-8 w-8 text-teal-500" />,
    questions: 10,
    time: "5-7 minutes",
  },
  {
    id: "binge-eating",
    title: "Binge Eating Test",
    description:
      "Find out if your eating habits could be a sign of a binge eating disorder.",
    icon: <Utensils className="h-8 w-8 text-indigo-500" />,
    questions: 10,
    time: "5-7 minutes",
  },
  {
    id: "anorexia",
    title: "Anorexia Test",
    description:
      "Find out if you are experiencing the most common symptoms of Anorexia.",
    icon: <Utensils className="h-8 w-8 text-pink-500" />,
    questions: 10,
    time: "5-7 minutes",
  },
  {
    id: "orthorexia",
    title: "Orthorexia Test",
    description:
      "Find out if you are experiencing the most common symptoms of Orthorexia.",
    icon: <Utensils className="h-8 w-8 text-emerald-500" />,
    questions: 10,
    time: "5-7 minutes",
  },
  {
    id: "bulimia",
    title: "Bulimia Test",
    description:
      "Find out if you are experiencing the most common symptoms of Bulimia.",
    icon: <Utensils className="h-8 w-8 text-rose-500" />,
    questions: 10,
    time: "5-7 minutes",
  },
];
