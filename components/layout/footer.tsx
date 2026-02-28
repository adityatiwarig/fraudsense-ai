import Link from "next/link"
import { Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/60">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-[1.2fr_1fr_0.8fr] md:items-start">
        <div>
          <div className="mb-2 flex items-center gap-2.5">
            <Shield className="h-5 w-5 text-cyan" strokeWidth={1.5} />
            <span className="text-sm font-medium text-foreground">
              FraudSense<span className="text-cyan"> AI</span>
            </span>
          </div>
          <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
            Real-time fraud intelligence platform for fast, explainable threat decisions.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan">Navigate</p>
          <Link href="/#features" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="/#how-it-works" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
            How It Works
          </Link>
          <Link href="/dashboard" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
            Dashboard
          </Link>
        </div>

        <div className="rounded-xl border border-cyan/15 bg-cyan/5 px-4 py-3">
          <p className="text-[11px] uppercase tracking-widest text-cyan">Status</p>
          <p className="mt-1 text-xs text-muted-foreground">AI engine online. Monitoring active streams.</p>
        </div>
      </div>

      <div className="border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">
        2026 FraudSense AI. All rights reserved.
      </div>
    </footer>
  )
}
