"use client"

import { FadeInSection } from "@/components/animated/fade-in-section"
import { Upload, Brain, ShieldCheck } from "lucide-react"

const steps = [
  {
    icon: Upload,
    title: "Submit Suspicious Content",
    description:
      "Paste a URL, email, SMS, or any suspicious text into the analyzer. FraudSense accepts all formats.",
  },
  {
    icon: Brain,
    title: "AI Threat Analysis",
    description:
      "Our engine cross-references patterns, keywords, and behavioral signals using Gemini AI to evaluate risk.",
  },
  {
    icon: ShieldCheck,
    title: "Get Risk Intelligence",
    description:
      "Receive a detailed risk score, red flag breakdown, category classification, and safety recommendations.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <FadeInSection className="mb-16 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
            How It Works
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            A Clear Triage Pipeline
          </h2>
        </FadeInSection>

        <div className="relative">
          <div className="pointer-events-none absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan/30 to-transparent md:block" />

          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step, i) => (
              <FadeInSection key={step.title} delay={i * 0.12}>
                <div className="glass-card group relative flex h-full flex-col rounded-2xl border border-cyan/10 p-7 transition-all duration-300 hover:-translate-y-1">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan/10 text-cyan transition-colors group-hover:bg-cyan/20">
                      <step.icon className="h-6 w-6" strokeWidth={1.5} />
                    </div>
                    <div className="rounded-full border border-cyan/20 bg-cyan/10 px-2.5 py-1 text-xs font-semibold text-cyan">
                      0{i + 1}
                    </div>
                  </div>

                  <h3 className="mb-3 text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
