"use client"

import { FadeInSection } from "@/components/animated/fade-in-section"
import { AnimatedCounter } from "@/components/animated/animated-counter"

const stats = [
  { value: 2400000, suffix: "+", label: "Threats Analyzed" },
  { value: 99, suffix: ".7%", label: "Detection Accuracy" },
  { value: 180, suffix: "+", label: "Countries Covered" },
  { value: 50, suffix: "ms", label: "Avg Response Time" },
]

export function TrustStatsSection() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <FadeInSection>
          <div className="glass-card overflow-hidden rounded-2xl border border-cyan/10 p-8 md:p-12">
            <div className="mb-8 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
                Performance
              </p>
              <h3 className="text-balance text-2xl font-bold text-foreground md:text-3xl">
                Trusted By High-Volume Security Operations
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat, i) => (
                <FadeInSection key={stat.label} delay={i * 0.1} className="text-center">
                  <div className="mb-2 text-3xl font-bold text-cyan md:text-4xl">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </p>
                </FadeInSection>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
              {["SOC Teams", "Fintech", "Enterprise IT", "Gov Security"].map((item) => (
                <div key={item} className="rounded-lg border border-border bg-secondary/20 px-3 py-2 text-[11px] text-muted-foreground">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}
