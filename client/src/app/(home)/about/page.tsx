import { AboutHero } from "@/src/components/landing/about/pages/AboutHero";
import { Mission } from "@/src/components/landing/about/pages/Mission";
import { Values } from "@/src/components/landing/about/pages/Values";
import { Stats } from "@/src/components/landing/about/pages/Stats";
import { TeamPreview } from "@/src/components/landing/about/pages/TeamPreview";
import { CTA } from "@/src/components/landing/about/pages/CTA";


export default function AboutPage() {
  return (
    <main className="flex flex-col bg-background mt-6">
      <AboutHero />
      <Mission />
      <Values />
      <Stats />
      <TeamPreview />
      <CTA />
    </main>
  );
}