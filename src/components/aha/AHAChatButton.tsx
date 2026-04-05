"use client";

import { useState } from "react";
import React from "react";
import { Bot } from "lucide-react";
import type { HackathonDetail } from "@/lib/types";

// Lazy load the chat panel to isolate potential errors
const AHAChatPanel = React.lazy(() => import("./AHAChatPanel"));

interface AHAChatButtonProps {
  detail: HackathonDetail;
}

// Inner error boundary to prevent chatbot crashes from breaking the page
class ChatErrorBoundary extends React.Component<
  { children: React.ReactNode; onReset: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onReset: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed bottom-20 right-4 md:right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-background border rounded-2xl shadow-2xl p-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">챗봇 로딩 중 오류가 발생했습니다.</p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              this.props.onReset();
            }}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm"
          >
            다시 시도
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function AHAChatButton({ detail }: AHAChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
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
      {isOpen && (
        <ChatErrorBoundary onReset={() => setIsOpen(false)}>
          <React.Suspense
            fallback={
              <div className="fixed bottom-20 right-4 md:right-6 z-50 w-[360px] bg-background border rounded-2xl shadow-2xl p-8 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <AHAChatPanel detail={detail} onClose={() => setIsOpen(false)} />
          </React.Suspense>
        </ChatErrorBoundary>
      )}
    </>
  );
}
