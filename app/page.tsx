import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/sections/hero-section"
import { HowItWorksSection } from "@/components/sections/how-it-works-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { LiveDemoSection } from "@/components/sections/live-demo-section"
import { TrustStatsSection } from "@/components/sections/trust-stats-section"

export default function HomePage() {
  return (
    <div className="relative min-h-screen grid-overlay noise-overlay">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <LiveDemoSection />
        <FeaturesSection />
        <TrustStatsSection />
      </main>
      <Footer />
    </div>
  )
}
