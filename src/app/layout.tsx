import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "./providers";
import { LocalStatusBanner } from "@/components/dev/LocalStatusBanner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "ResumeForge AI — Build Stunning Resumes with AI",
    template: "%s | ResumeForge AI",
  },
  description:
    "Create professional, ATS-optimized resumes with AI assistance. Upload your existing resume, target a job description, and let AI help you land your dream job.",
  keywords: ["resume builder", "CV maker", "AI resume", "ATS optimization", "job application"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://resumeforge.ai",
    siteName: "ResumeForge AI",
    title: "ResumeForge AI — Build Stunning Resumes with AI",
    description: "Create professional, ATS-optimized resumes with AI assistance.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
          <LocalStatusBanner />
        </Providers>
      </body>
    </html>
  );
}
