import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import ContactSection from "@/components/sections/ContactSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import HeroSection from "@/components/sections/HeroSection";
import IntroModelSection from "@/components/sections/IntroModelSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SkillsSection from "@/components/sections/SkillsSection";

export default function Home() {
  return (
    <div className="page-shell flex min-h-screen flex-col">
      {/* Loading disabled temporarily */}
      <SiteHeader />

      <main className="relative flex-1 overflow-visible">
        <IntroModelSection />
        <HeroSection />
        <SkillsSection />
        <ExperienceSection />
        <ProjectsSection />
        <ContactSection />
      </main>

      {/* Live chat an khi dang preview loading */}

      <SiteFooter />
    </div>
  );
}
