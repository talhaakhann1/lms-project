import type { Metadata } from "next";

import { AboutHero } from "@/src/components/landing/about/pages/AboutHero";
import { Mission } from "@/src/components/landing/about/pages/Mission";
import { Values } from "@/src/components/landing/about/pages/Values";
import { Stats } from "@/src/components/landing/about/pages/Stats";
import { TeamPreview } from "@/src/components/landing/about/pages/TeamPreview";
import { CTA } from "@/src/components/landing/about/pages/CTA";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about the mission, values, and team behind the platform.",
};

export default function AboutPage() {
  return (
    <main className="flex flex-col bg-background">
      <AboutHero />
      <Mission />
      <Values />
      <Stats />
      <TeamPreview />
      <CTA />
    </main>
  );
}