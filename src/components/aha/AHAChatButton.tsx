"use client";

import { useState, useEffect } from "react";
import { Bot } from "lucide-react";
import AHAChatPanel from "./AHAChatPanel";
import type { HackathonDetail } from "@/lib/types";

interface AHAChatButtonProps {
  detail: HackathonDetail;
}

export default function AHAChatButton({ detail }: AHAChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [chatError, setChatError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setChatError(false);
            setIsOpen(true);
          }}
          className="fixed bottom-6 right-4 md:right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center group"
        >
          <span className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" />
          <Bot className="w-6 h-6 relative z-10" />
          <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-popover text-popover-foreground text-xs font-medium shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            AHA - AI 어드바이저
          </span>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && !chatError && (
        <AHAChatPanel detail={detail} onClose={() => setIsOpen(false)} />
      )}

      {isOpen && chatError && (
        <div className="fixed bottom-20 right-4 md:right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-background border rounded-2xl shadow-2xl p-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">챗봇 로딩 중 오류가 발생했습니다.</p>
          <button
            onClick={() => {
              setChatError(false);
              setIsOpen(false);
            }}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm"
          >
            닫기
          </button>
        </div>
      )}
    </>
  );
}
