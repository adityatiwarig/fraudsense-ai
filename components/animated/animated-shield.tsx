"use client"

import { Shield, Lock, Eye } from "lucide-react"

export function AnimatedShield() {
  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64 animate-shield">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-cyan/5 animate-pulse-glow" />

      {/* Shield container */}
      <div className="absolute inset-4 flex items-center justify-center">
        <div className="relative">
          <Shield
            className="w-32 h-32 md:w-44 md:h-44 text-cyan drop-shadow-[0_0_15px_rgba(6,214,242,0.3)]"
            strokeWidth={1}
          />
          {/* Inner icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="w-10 h-10 md:w-14 md:h-14 text-cyan/80" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Orbiting elements */}
      <div className="absolute inset-0 animate-[spin_20s_linear_infinite]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1">
          <div className="w-2 h-2 rounded-full bg-cyan/60" />
        </div>
      </div>
      <div className="absolute inset-0 animate-[spin_15s_linear_infinite_reverse]">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1">
          <Eye className="w-4 h-4 text-neon-blue/60" />
        </div>
      </div>
    </div>
  )
}
