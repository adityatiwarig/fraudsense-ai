"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Loader2 } from "lucide-react"

const loadingMessages = [
  "Initializing threat detection engine...",
  "Scanning content patterns...",
  "Cross-referencing fraud databases...",
  "AI analyzing threat patterns...",
  "Generating risk assessment...",
]

export function AnalyzingModal({ isOpen }: { isOpen: boolean }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-card p-10 text-center shadow-2xl"
          >
            {/* Animated shield */}
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-cyan/10" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-cyan/10">
                <Shield className="h-10 w-10 text-cyan" strokeWidth={1.5} />
              </div>
            </div>

            <Loader2 className="h-5 w-5 animate-spin text-cyan" />

            <div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Analyzing Content</h3>
              <TypingMessages messages={loadingMessages} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function TypingMessages({ messages }: { messages: string[] }) {
  return <RotatingText messages={messages} />
}

function RotatingText({ messages }: { messages: string[] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [messages.length])

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={index}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.3 }}
        className="text-sm text-muted-foreground"
      >
        {messages[index]}
      </motion.p>
    </AnimatePresence>
  )
}
