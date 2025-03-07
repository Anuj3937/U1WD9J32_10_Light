"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: "Hello! I'm here to listen and help. How are you feeling today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(""); // Selected voice
  const [personality, setPersonality] = useState("friend"); // Default personality
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Speak initial bot message on load
  useEffect(() => {
    speakText(messages[0].content);
  }, []);

  // Fetch available voices
  const getAvailableVoices = () => {
    return window.speechSynthesis.getVoices();
  };

  // Speech synthesis (text-to-speech)
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Clear previous speech queue

      let cleanedText = text
        .replace(/``````/g, "[code snippet omitted]")
        .replace(/`[^`]*`/g, "")
        .replace(/(\*\*|\*|__|_|~~|>)/g, "")
        .replace(
          /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF]|[\u2011-\u26FF])/g,
          ""
        );

      const sentences = cleanedText.match(/[^\.!\?]+[\.!\?]+/g) || [cleanedText];

      const voices = getAvailableVoices();
      const selectedVoiceObj =
        voices.find((voice) => voice.name === selectedVoice) || voices[0];

      sentences.forEach((sentence) => {
        const utterance = new SpeechSynthesisUtterance(sentence.trim());
        utterance.voice = selectedVoiceObj;
        utterance.pitch = personality === "therapist" ? 1 : personality === "friend" ? 1.2 : personality === "family" ? 1.1 : 0.95; // Adjust pitch based on personality
        utterance.rate = personality === "therapist" ? 0.85 : personality === "friend" ? 0.9 : personality === "family" ? 0.95 : 1; // Adjust rate based on personality
        window.speechSynthesis.speak(utterance);
      });
    }
  };

  // Handle sending message
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `${personalityPrompt(personality)} ${input}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error.message || "API error");

      const botResponseText = data.reply;
      setMessages((prev) => [...prev, { role: "bot", content: botResponseText }]);
      speakText(botResponseText);
    } catch (error) {
      console.error(error);
      const errorMsg = "Oops! Something went wrong. Please try again.";
      setMessages((prev) => [...prev, { role: "bot", content: errorMsg }]);
      speakText(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Generate prompt based on selected personality
  const personalityPrompt = (type: string): string => {
    switch (type) {
      case "friend":
        return "You are a supportive and friendly chatbot who talks like a close friend.";
      case "family":
        return "You are a caring chatbot who talks like a family member.";
      case "therapist":
        return "You are an empathetic and professional therapist.";
      case "stranger":
        return "You are a neutral chatbot who talks like a stranger.";
      default:
        return "";
    }
  };

  // Handle voice selection change
  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVoice(e.target.value);
  };

  // Handle speech-to-text (audio input)
  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser doesn't support speech recognition.");
      return;
    }

    if (listening) {
      recognitionRef.current.stop();
      return;
    }

    recognitionRef.current = new (window as any).webkitSpeechRecognition();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onstart = () => setListening(true);
    recognitionRef.current.onend = () => setListening(false);

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognitionRef.current.start();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Nav />
      <main className="max-w-4xl mx-auto mt-8 p-4 flex-grow flex flex-row">
        {/* Chat Section */}
        <div className="flex-grow">
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
                      <div className={`mx-2 p-3 rounded-lg ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start mb-4">
                    <Avatar className="w-8 h-8"><AvatarImage src="/placeholder-bot.jpg"/><AvatarFallback>B</AvatarFallback></Avatar>
                    <div className="mx-2 p-3 rounded-lg bg-muted">Typing...</div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Input value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&handleSend()} disabled={loading}/>
              <Button onClick={handleSend} disabled={loading}>{loading?"...":"Send"}</Button>
              {/* Audio Input Button */}
              <Button variant={listening?"destructive":"secondary"} onClick={handleVoiceInput}>
                {listening ? "Stop 🎙️" : "Speak 🎙️"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Settings Section */}
        <aside className="w-[250px] ml-4">
          <Card className="p-4">
            <CardTitle>Settings</CardTitle>
            {/* Voice Selection */}
            <div className="mt-4">
              <label htmlFor="voice-select">Select Voice:</label>
              <select id="voice-select" value={selectedVoice} onChange={handleVoiceChange} className="w-full mt-2 p-2 border rounded">
                {getAvailableVoices().map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Personality Selection */}
            <div className="mt-4">
              <label htmlFor="personality-select">Select Personality:</label>
              <select id="personality-select" value={personality} onChange={(e)=>setPersonality(e.target.value)} className="w-full mt-2 p-2 border rounded">
                <option value="friend">Friend</option>
                <option value="family">Family Member</option>
                <option value="therapist">Therapist</option>
                <option value="stranger">Stranger</option>
              </select>
            </div>
          </Card>
        </aside>
      </main>
    </div>
  );
}
