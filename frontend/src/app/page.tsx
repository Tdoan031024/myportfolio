import LiveChatWidget from "@/components/LiveChatWidget";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import AboutSection from "@/components/sections/AboutSection";
import AiSection from "@/components/sections/AiSection";
import BlogSection from "@/components/sections/BlogSection";
import ContactSection from "@/components/sections/ContactSection";
import HeroSection from "@/components/sections/HeroSection";
import IntroModelSection from "@/components/sections/IntroModelSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SkillsSection from "@/components/sections/SkillsSection";
import SubscribeSection from "@/components/sections/SubscribeSection";

export default function Home() {
  return (
    <div className="page-shell flex min-h-screen flex-col">
      {/* Loading disabled temporarily */}
      <SiteHeader />

      <main className="relative flex-1 overflow-visible">
        <IntroModelSection />
        <HeroSection />
        <SkillsSection />
        <ProjectsSection />
        <AboutSection />
        <AiSection />
        <BlogSection />
        <SubscribeSection />
        <ContactSection />
      </main>

      {/* Live chat an khi dang preview loading */}

      <SiteFooter />
    </div>
  );
}
