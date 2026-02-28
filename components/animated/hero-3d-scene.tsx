"use client"

import { motion } from "framer-motion"
import { Lock, Radar, Shield } from "lucide-react"

export function Hero3DScene() {
  return (
    <div className="relative mx-auto mb-6 w-full max-w-xs [perspective:1200px] sm:max-w-sm">
      <motion.div
        className="relative h-44 w-full [transform-style:preserve-3d]"
        animate={{ rotateX: [8, 2, 8], rotateY: [-12, 12, -12] }}
        transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 rounded-2xl border border-cyan/20 bg-gradient-to-br from-cyan/15 to-transparent [transform:translateZ(-50px)]" />
        <div className="absolute inset-3 rounded-2xl border border-neon-blue/20 bg-gradient-to-br from-neon-blue/15 to-transparent [transform:translateZ(-25px)]" />

        <div className="absolute inset-6 rounded-2xl border border-cyan/25 bg-background/70 [transform:translateZ(20px)] backdrop-blur-xl">
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <div className="relative">
              <Shield className="h-16 w-16 text-cyan drop-shadow-[0_0_20px_rgba(6,214,242,0.35)]" />
              <Lock className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 text-cyan/80" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan">Threat Core</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute -right-5 -top-4 rounded-full border border-cyan/30 bg-cyan/10 p-2 backdrop-blur"
        animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <Radar className="h-4 w-4 text-cyan" />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute -bottom-3 -left-4 h-16 w-16 rounded-full bg-cyan/15 blur-xl"
        animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 3.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
    </div>
  )
}
