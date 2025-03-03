"use client";

import Link from "next/link";
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
import { useAuthStore } from "@/lib/auth";

export function Nav() {
  const router = useRouter();

  // ✅ Use a stable function reference to prevent excessive re-renders
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore.getState().logout; // ✅ Access logout directly without causing state updates

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login"); // Redirect to login after logout
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return "US"; // Default initials if no user data
  };

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold">MindfulStudent</span>
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
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
                  className="text-red-600"
                  onClick={handleLogout}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
