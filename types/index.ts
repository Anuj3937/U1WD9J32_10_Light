export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "therapist";
};

export type Comment = {
  id: string;
  content: string;
  author: User;
  timestamp: string;
};

export type Post = {
  id: string;
  author: User;
  content: string;
  image?: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
  group?: string;
  isLiked?: boolean;
};

export type SavedVideo = {
  id: string;
  title: string;
  date: string;
  duration: string;
  mood: string;
  videoUrl: string;
  thumbnail: string;
  insights?: {
    sentiment: string;
    recommendations: string[];
  };
};

export type Therapist = {
  id: string;
  user: User;
  specialization: string;
  rating: number;
  reviews: number;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  distance?: number;
  nextAvailable: string;
  sessionTypes: ("in-person" | "video")[];
  price: number;
  availability: {
    [key: string]: string[]; // day: available times
  };
};

export type Group = {
  id: string;
  name: string;
  description: string;
  category: string;
  members: number;
  therapist: Therapist;
  isJoined?: boolean;
};

export type DiaryEntry = {
  id: string;
  type: "video" | "text";
  content: string;
  mood: string;
  timestamp: string;
  thumbnail?: string;
  insights?: {
    sentiment: string;
    emotionalState: string;
    recommendations: string[];
    suggestedResources: {
      type: "article" | "video" | "professional";
      title: string;
      link: string;
    }[];
    triggers?: string[];
    copingMechanisms?: string[];
  };
};
