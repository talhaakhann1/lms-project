import type { Metadata } from "next";
import "@/src/app/globals.css"
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import { Header } from "@/src/components/layout/Header";

export const metadata: Metadata = {
  title: "Edvra — Learn. Grow. Achieve.",
  description:
    "Explore courses, build new skills, and continue your learning journey with Edvra.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="min-h-screen flex flex-col">
            <Header />
            {children}
      </div>
  );
}
