import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CAPACITY CONNECT — Institutional Capacity Building & Learning Management",
  description:
    "An AI-powered digital capacity-building and learning management platform designed for institutional training, competency development, knowledge sharing, and performance monitoring.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <meta name="theme-color" content="#0c2340" />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
