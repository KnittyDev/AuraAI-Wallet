import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  weight: "400",
  subsets: ["latin"],
  style: ["normal", "italic"],
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
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
