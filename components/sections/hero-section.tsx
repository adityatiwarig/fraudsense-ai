"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Scan, Radar, ShieldCheck, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { Hero3DScene } from "@/components/animated/hero-3d-scene"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-22 pb-18 sm:pt-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-cyan/15 blur-3xl" />
        <div className="absolute right-0 top-32 h-64 w-64 rounded-full bg-neon-blue/15 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex max-w-2xl flex-col gap-6 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/10 px-4 py-1.5 text-xs font-semibold text-cyan lg:mx-0"
          >
            <Scan className="h-3.5 w-3.5" />
            Enterprise Fraud Defense, Reimagined
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-balance text-4xl font-black leading-[1.05] tracking-tight text-foreground md:text-5xl lg:text-6xl"
          >
            Stop Threats Before
            <br />
            <span className="bg-gradient-to-r from-cyan via-neon-blue to-cyan bg-clip-text text-transparent">
              They Become Incidents
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-xl text-pretty text-base text-muted-foreground md:text-lg lg:mx-0"
          >
            FraudSense combines live AI reasoning, deterministic scoring, and URL intelligence to
            give security teams instant, explainable decisions with analyst-grade confidence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <Link href="/dashboard">
              <Button
                size="lg"
                className="h-11 bg-cyan px-6 text-primary-foreground hover:bg-cyan/90"
              >
                Launch Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/analyze">
              <Button
                size="lg"
                variant="outline"
                className="h-11 border-cyan/25 px-6 text-foreground hover:border-cyan/40 hover:bg-cyan/5"
              >
                Try Analysis
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.42 }}
            className="grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            {[
              { icon: Radar, label: "Live Threat Radar" },
              { icon: ShieldCheck, label: "Explainable Scoring" },
              { icon: Zap, label: "Fast Incident Triage" },
            ].map((item) => (
              <div
                key={item.label}
                className="glass-card flex items-center justify-center gap-2 rounded-xl border border-cyan/10 px-3 py-3 text-xs text-muted-foreground lg:justify-start"
              >
                <item.icon className="h-4 w-4 text-cyan" />
                <span>{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="glass-card relative overflow-hidden rounded-2xl border border-cyan/20 p-5">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan to-transparent" />
            <Hero3DScene />
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-cyan">Threat Feed</span>
              <span className="rounded-full border border-success/20 bg-success/10 px-2 py-1 text-[10px] text-success">
                Live
              </span>
            </div>

            <div className="space-y-3">
              {[
                { source: "Mail Gateway", threat: "Credential Harvesting", score: 91 },
                { source: "SMS Stream", threat: "OTP Interception", score: 76 },
                { source: "Web Monitor", threat: "Spoofed Brand Domain", score: 84 },
              ].map((row) => (
                <div key={`${row.source}-${row.threat}`} className="rounded-xl border border-border bg-secondary/30 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-medium text-foreground">{row.source}</p>
                    <p className="text-xs font-semibold text-cyan">{row.score}/100</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{row.threat}</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-warning via-cyan to-cyan"
                      style={{ width: `${row.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-cyan/20 bg-cyan/5 p-3">
              <p className="text-[11px] text-cyan">
                3 critical threats contained in the last 15 minutes.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
