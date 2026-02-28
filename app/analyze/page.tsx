"use client"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { AnalyzeWorkbench } from "@/components/analyze/analyze-workbench"

export default function AnalyzePage() {
  return (
    <div className="relative min-h-screen grid-overlay noise-overlay">
      <Navbar />
      <main className="pb-24 pt-24 sm:pt-28">
        <AnalyzeWorkbench />
      </main>
      <Footer />
    </div>
  )
}
