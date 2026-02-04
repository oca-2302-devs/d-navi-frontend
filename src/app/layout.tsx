import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import ConfigureAmplify from "@/shared/components/ConfigureAmplify";
import { Toaster } from "@/shared/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Dナビ",
    template: "%s | Dナビ",
  },
  description: "Dナビへようこそ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ConfigureAmplify />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
