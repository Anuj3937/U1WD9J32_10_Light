"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"; // ✅ Import centralized dropdown components
import { Button } from "@/components/ui/button";

// Define the Notification interface
interface Notification {
  id: string;
  message: string;
  timestamp?: Date;
}

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Simulate fetching notifications - replace with API call
    const mockNotifications: Notification[] = [
      {
        id: "1",
        message: "New message from therapist.",
        timestamp: new Date(),
      },
      {
        id: "2",
        message: "Reminder: Upcoming appointment.",
        timestamp: new Date(),
      },
    ];
    setNotifications(mockNotifications);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Bell />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id}>
              {notification.message}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
