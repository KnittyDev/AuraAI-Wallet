import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Aura AI - Autonomous Portfolio Intelligence",
  description: "Next-generation AI-driven investment platform for autonomous portfolio management and real-time market intelligence.",
  icons: {
    icon: [
      { url: "/auralogo.png", sizes: "32x32", type: "image/png" },
      { url: "/auralogo.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/auralogo.png",
    apple: "/auralogo.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
