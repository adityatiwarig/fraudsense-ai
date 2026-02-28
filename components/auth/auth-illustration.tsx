"use client"

import { Shield, Lock, Eye, Scan, ShieldCheck } from "lucide-react"

export function AuthIllustration() {
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-[#040810] p-12">
      {/* Background orb */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[400px] w-[400px] animate-orb rounded-full bg-[radial-gradient(circle,rgba(6,214,242,0.06)_0%,rgba(59,130,246,0.03)_40%,transparent_70%)]" />
      </div>

      {/* Grid */}
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-40" />

      {/* Central shield */}
      <div className="relative mb-10 animate-shield">
        <Shield className="h-24 w-24 text-cyan drop-shadow-[0_0_20px_rgba(6,214,242,0.25)]" strokeWidth={0.8} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Lock className="h-8 w-8 text-cyan/70" strokeWidth={1.5} />
        </div>
      </div>

      {/* Text */}
      <h2 className="mb-3 text-center text-2xl font-bold text-foreground">
        FraudSense<span className="text-cyan"> AI</span>
      </h2>
      <p className="mb-10 max-w-xs text-center text-sm leading-relaxed text-muted-foreground">
        Intelligence-grade fraud detection powered by advanced AI threat analysis.
      </p>

      {/* Feature pills */}
      <div className="flex flex-col gap-3">
        {[
          { icon: Scan, text: "Real-time threat scanning" },
          { icon: Eye, text: "Pattern recognition engine" },
          { icon: ShieldCheck, text: "99.7% detection accuracy" },
        ].map((item) => (
          <div
            key={item.text}
            className="flex items-center gap-3 rounded-lg border border-cyan/10 bg-cyan/5 px-4 py-2.5"
          >
            <item.icon className="h-4 w-4 text-cyan" strokeWidth={1.5} />
            <span className="text-xs text-muted-foreground">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
