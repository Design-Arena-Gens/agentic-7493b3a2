import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Atlas Agent | Real Estate AI Copilot",
  description:
    "Interactive real estate intelligence with live maps, property insights, and instant AI conversations powered by GPT.",
  openGraph: {
    title: "Atlas Agent | Real Estate AI Copilot",
    description:
      "Plan tours, explore neighborhoods, and chat with an expert AI agent while tracking properties on Google Maps.",
    url: "https://agentic-7493b3a2.vercel.app",
    type: "website"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-slate-950">
      <body className={`${inter.className} bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950`}>{children}</body>
    </html>
  );
}
