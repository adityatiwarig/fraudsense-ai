"use client"

import { FadeInSection } from "@/components/animated/fade-in-section"
import { Zap, Globe, BarChart3, Lock, FileSearch, Bell } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Real-Time Detection",
    description: "Instant analysis of URLs, emails, and messages with sub-second response times.",
  },
  {
    icon: Globe,
    title: "Global Threat Database",
    description: "Cross-references known fraud patterns from worldwide intelligence sources.",
  },
  {
    icon: BarChart3,
    title: "Risk Scoring Engine",
    description: "Multi-factor risk scoring combining AI probability, keyword analysis, and frequency data.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "All analysis is encrypted and ephemeral. Your data is never stored or shared.",
  },
  {
    icon: FileSearch,
    title: "Detailed Reports",
    description: "Comprehensive breakdown with red flags, category tagging, and actionable recommendations.",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Configurable notifications for high-risk threats detected in monitored content.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <FadeInSection className="mb-16 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
            Capabilities
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Built For Serious Threat Workloads
          </h2>
        </FadeInSection>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {features.map((feature, i) => (
            <FadeInSection key={feature.title} delay={i * 0.08}>
              <div className={`glass-card group flex h-full flex-col rounded-2xl border border-cyan/10 p-6 transition-all duration-300 hover:-translate-y-1 ${i === 0 || i === 3 ? "lg:col-span-3" : "lg:col-span-2"}`}>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-cyan/10 text-cyan transition-colors group-hover:bg-cyan/20">
                  <feature.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  )
}
