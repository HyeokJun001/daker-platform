"use client";

import { useState, useRef, useEffect } from "react";
import { useAHAStore } from "@/stores/ahaStore";
import { useTeamStore } from "@/stores/teamStore";
import { generateResponse } from "@/lib/aha-engine";
import type { HackathonDetail } from "@/lib/types";
import AHAProfileSetup from "./AHAProfileSetup";
import FitScoreGauge from "./FitScoreGauge";
import { Button } from "@/components/ui/button";
import { X, Send, RotateCcw } from "lucide-react";

interface AHAChatPanelProps {
  detail: HackathonDetail;
  onClose: () => void;
}

export default function AHAChatPanel({ detail, onClose }: AHAChatPanelProps) {
  const profile = useAHAStore((s) => s.profile);
  const chatHistory = useAHAStore((s) => s.chatHistory);
  const addMessage = useAHAStore((s) => s.addMessage);
  const clearChat = useAHAStore((s) => s.clearChat);
  const teams = useTeamStore((s) => s.teams);

  const messages = chatHistory[detail.slug] || [];

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine setup visibility after mount (to avoid hydration mismatch)
  useEffect(() => {
    setShowSetup(!profile);
    setInitialized(true);
  }, [profile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isTyping]);

  // Send welcome message on first open after profile setup
  useEffect(() => {
    if (initialized && profile && messages.length === 0 && !showSetup) {
      try {
        const welcome = generateResponse("안녕", profile, detail, teams);
        addMessage(detail.slug, welcome);
      } catch (e) {
        console.error("AHA welcome error:", e);
      }
    }
  }, [initialized, profile, showSetup, detail.slug]);

  const handleSend = () => {
    if (!input.trim() || !profile) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      role: "user" as const,
      content: input,
      timestamp: new Date().toISOString(),
    };

    addMessage(detail.slug, userMsg);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      try {
        const response = generateResponse(currentInput, profile, detail, teams);
        addMessage(detail.slug, response);
      } catch (e) {
        console.error("AHA response error:", e);
        addMessage(detail.slug, {
          id: `msg-err-${Date.now()}`,
          role: "assistant",
          content: "죄송합니다, 응답 생성 중 오류가 발생했습니다. 다시 시도해주세요.",
          timestamp: new Date().toISOString(),
        });
      }
      setIsTyping(false);
    }, 600 + Math.random() * 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleProfileComplete = () => {
    setShowSetup(false);
  };

  const handleReset = () => {
    clearChat(detail.slug);
    if (profile) {
      setTimeout(() => {
        try {
          const welcome = generateResponse("안녕", profile, detail, teams);
          addMessage(detail.slug, welcome);
        } catch (e) {
          console.error("AHA reset error:", e);
        }
      }, 100);
    }
  };

  const handleQuickAction = (action: string) => {
    if (!profile) return;
    const userMsg = {
      id: `msg-${Date.now()}`,
      role: "user" as const,
      content: action,
      timestamp: new Date().toISOString(),
    };
    addMessage(detail.slug, userMsg);
    setIsTyping(true);
    setTimeout(() => {
      try {
        const response = generateResponse(action, profile, detail, teams);
        addMessage(detail.slug, response);
      } catch (e) {
        console.error("AHA action error:", e);
      }
      setIsTyping(false);
    }, 600 + Math.random() * 800);
  };

  if (!initialized) {
    return (
      <div
        className="fixed bottom-20 right-4 md:right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-background border rounded-2xl shadow-2xl flex items-center justify-center"
        style={{ height: "200px" }}
      >
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-20 right-4 md:right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-background border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      style={{ height: "min(520px, calc(100vh - 120px))" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-primary/5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">A</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold">AHA</h3>
            <p className="text-[10px] text-muted-foreground">AI Hackathon Advisor</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            title="대화 초기화"
          >
            <RotateCcw className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Body */}
      {showSetup ? (
        <AHAProfileSetup onComplete={handleProfileComplete} />
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id}>
                <div
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted rounded-bl-md"
                    }`}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {msg.content.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
                        part.startsWith("**") && part.endsWith("**") ? (
                          <strong key={i}>{part.slice(2, -2)}</strong>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Fit Score Gauge inline */}
                {msg.role === "assistant" &&
                  msg.metadata?.fitScore != null &&
                  msg.content.includes("적합도") && (
                    <div className="flex justify-start mt-2 pl-2">
                      <FitScoreGauge score={msg.metadata.fitScore} size={90} />
                    </div>
                  )}
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick actions */}
          <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
            {["적합도 분석", "부족한 기술", "팀 찾기"].map((action) => (
              <button
                key={action}
                type="button"
                onClick={() => handleQuickAction(action)}
                disabled={isTyping}
                className="px-2.5 py-1 rounded-full text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
              >
                {action}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-4 pb-4 pt-1 shrink-0">
            <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-background">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="질문을 입력하세요..."
                className="flex-1 bg-transparent text-sm outline-none"
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-1.5 rounded-lg bg-primary text-primary-foreground disabled:opacity-50 transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
