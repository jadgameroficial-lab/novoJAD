import { Hero } from "@/components/hero/Hero";
import { AuthorityStrip } from "@/components/sections/AuthorityStrip";
import { ClientsMarquee } from "@/components/sections/ClientsMarquee";
import { Solutions } from "@/components/sections/Solutions";
import { TaglineReveal } from "@/components/sections/TaglineReveal";
import { Process } from "@/components/sections/Process";
import { TechSection } from "@/components/sections/TechSection";
import { Cases } from "@/components/sections/Cases";
import { Differentiators } from "@/components/sections/Differentiators";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";

export default function Page() {
  return (
    <>
      <main>
        <Hero />
        <AuthorityStrip />
        <ClientsMarquee />
        <Solutions />
        <TaglineReveal />
        <Process />
        <TechSection />
        <Cases />
        <Differentiators />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
