import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/layout/Navbar";
import DataInitializer from "@/components/layout/DataInitializer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DAKER - 해커톤 관리 플랫폼",
  description: "해커톤 탐색부터 팀 빌딩, 제출, 랭킹까지 한 곳에서 관리하는 원스톱 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DataInitializer>
            <Navbar />
            <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
          </DataInitializer>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
