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
  AlertTriangle,
  Menu,
  Trophy,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { auth } from "@/lib/firebaseConfig";
import { logout } from "@/lib/auth";
import { User } from "firebase/auth";

export function Nav() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <nav className="bg-background border-b sticky top-0 z-50 w-full">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Left Section - Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-2xl font-bold">
            MindScape
          </Link>
          <Button asChild variant="ghost">
            <Link href="/achievements">
              <Trophy className="w-4 h-4 mr-2" />
            </Link>
          </Button>
        </div>

        {/* Center Section - Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Button asChild variant="ghost">
            <Link href="/dashboard">
              <BarChart2 className="w-4 h-4 mr-2" /> Dashboard
            </Link>
          </Button>
          {/* <Button asChild variant="ghost">
            <Link href="/goals">
              <Target className="w-4 h-4 mr-2" /> Goals
            </Link>
          </Button> */}
          <Button asChild variant="ghost">
            <Link href="/video-diary">
              <Video className="w-4 h-4 mr-2" /> Video Diary
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/community">
              <Users className="w-4 h-4 mr-2" /> Community
            </Link>
          </Button>
          {/* <Button asChild variant="ghost">
            <Link href="/reels">
              <Film className="w-4 h-4 mr-2" /> Reels
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/story">
              <Book className="w-4 h-4 mr-2" /> Interactive Story
            </Link>
          </Button> */}
          <Button asChild variant="ghost">
            <Link href="/chat">
              <MessageCircle className="w-4 h-4 mr-2" /> AI Therapist
            </Link>
          </Button>
        </div>

        {/* Right Section - Controls */}
        <div className="flex items-center space-x-4">
          <Button asChild variant="destructive">
            <Link href="/assessment/crisis">
              <AlertTriangle className="w-4 h-4 mr-2" /> Get Help
            </Link>
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={user.photoURL || "/placeholder-user.jpg"} />
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
            <Button asChild variant="outline">
              <Link href="/auth/login">Login</Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          className="md:hidden"
          variant="ghost"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-background border-t p-4 space-y-2 text-center">
          <Link href="/dashboard" className="block">
            Dashboard
          </Link>
          {/* <Link href="/goals" className="block">
            Goals
          </Link> */}
          <Link href="/video-diary" className="block">
            Video Diary
          </Link>
          <Link href="/community" className="block">
            Community
          </Link>
          {/* <Link href="/reels" className="block">
            Reels
          </Link>
          <Link href="/story" className="block">
            Interactive Story
          </Link> */}
          <Link href="/chat" className="block">
            AI Therapist
          </Link>
          {user ? (
            <>
              <Link href="/profile" className="block">
                Profile
              </Link>
              <Link href="/settings" className="block">
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 w-full text-left"
              >
                Log out
              </button>
            </>
          ) : (
            <Link href="/auth/login" className="block">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
