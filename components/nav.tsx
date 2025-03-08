"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart2,
  Video,
  Users,
  Film,
  MessageCircle,
  Target,
  Bell,
  Book,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { auth } from "@/lib/firebaseConfig";
import { logout } from "@/lib/auth";
import { User } from "firebase/auth";

export function Nav() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold">MindScape</span>
            </Link>
            <div className="hidden md:flex md:items-center md:ml-10 space-x-4">
              <Button asChild variant="ghost">
                <Link href="/dashboard">
                  <BarChart2 className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/goals">
                  <Target className="w-4 h-4 mr-2" />
                  Goals
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/video-diary">
                  <Video className="w-4 h-4 mr-2" />
                  Diary
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/community">
                  <Users className="w-4 h-4 mr-2" />
                  Community
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/reels">
                  <Film className="w-4 h-4 mr-2" />
                  Reels
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/story">
                  <Book className="w-4 h-4 mr-2" />
                  Interactive Story
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button asChild variant="default">
              <Link href="/chat">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat Support
              </Link>
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            {/* If user is logged in, show avatar & dropdown */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage
                      src={user.photoURL || "/placeholder-user.jpg"}
                    />
                    <AvatarFallback>
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {user.displayName || user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/goals">Goals & Achievements</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 cursor-pointer"
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // If no user, show Login button
              <Button asChild variant="outline">
                <Link href="/auth/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
