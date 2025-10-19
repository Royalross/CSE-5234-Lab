import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/mine/navbar";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyGolf | CSE 5234 Lab 6",
  description: "User Interface tier for Web Applications",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar />
        <main className="min-h-[calc(100vh-120px)]">{children}</main>
        <footer className="w-full bg-black text-white text-center py-4 mt-12">
          © 2025 CSE5234 Team 8. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
