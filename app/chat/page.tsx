"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";  
import { Nav } from "@/components/nav";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! I'm here to listen and help. How are you feeling today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);  
  const router = useRouter();  

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const reminderInterval = setInterval(() => {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Don't forget to record your video diary and take your daily assessment!" },
      ]);
    }, 86400000); // Remind every 24 hours

    return () => clearInterval(reminderInterval);
  }, []);

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = { role: "user", content: input };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setLoading(true);

      setTimeout(() => {
        const botResponse = {
          role: "bot",
          content: "I understand. Can you tell me more about why you're feeling that way?",
        };
        setMessages((prev) => [...prev, botResponse]);
        setLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Nav />
      <main className="max-w-4xl mx-auto mt-8 p-4 flex-grow flex flex-col">
        <Card className="w-full flex flex-col flex-grow">
          <CardHeader>
            <CardTitle>Mental Health Chat</CardTitle>
            <CardDescription>Chat with our AI assistant for support and guidance</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ScrollArea className="h-[400px] w-full pr-4 overflow-y-auto">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}>
                  <div className={`flex items-start ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={message.role === "user" ? "/placeholder-user.jpg" : "/placeholder-bot.jpg"} />
                      <AvatarFallback>{message.role === "user" ? "U" : "B"}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`mx-2 p-3 rounded-lg ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start mb-4">
                  <div className="flex items-start">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder-bot.jpg" />
                      <AvatarFallback>B</AvatarFallback>
                    </Avatar>
                    <div className="mx-2 p-3 rounded-lg bg-muted">Typing...</div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} /> {/* ✅ Corrected */}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={loading}
              />
              <Button onClick={handleSend} disabled={loading}>
                {loading ? "..." : "Send"}
              </Button>
            </div>
          </CardFooter>
          <div className="p-4 flex justify-center">
            <Button onClick={() => router.push("/video-diary")} className="bg-blue-500 text-white">
              Record Video Diary
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}