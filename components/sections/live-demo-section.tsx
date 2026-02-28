"use client"

import { FadeInSection } from "@/components/animated/fade-in-section"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react"

export function LiveDemoSection() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <FadeInSection className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan">
            Live Preview
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Analyst View, Not Just A Score
          </h2>
        </FadeInSection>

        <FadeInSection delay={0.15}>
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="glass-card rounded-2xl border border-cyan/10 p-6">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-cyan">Incoming Message</p>
                <span className="rounded-full border border-warning/20 bg-warning/10 px-2 py-1 text-[10px] text-warning">
                  Suspicious
                </span>
              </div>

              <div className="rounded-xl border border-border bg-secondary/25 p-4">
                <p className="mb-2 text-xs text-muted-foreground">Email Preview</p>
                <p className="text-sm leading-relaxed text-foreground">
                  Your payroll account is suspended. Verify now at{" "}
                  <span className="font-mono text-cyan">secure-payroll-check.net</span> to avoid salary delay.
                </p>
              </div>

              <div className="mt-4 space-y-2">
                {[
                  "Domain impersonation pattern",
                  "Urgency and fear language",
                  "Credential harvesting intent",
                ].map((point) => (
                  <div key={point} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card overflow-hidden rounded-2xl border border-cyan/10">
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="h-5 w-5 text-cyan" />
                  <span className="text-sm font-medium text-foreground">Analysis Result</span>
                </div>
                <Badge className="border-destructive/30 bg-destructive/10 text-destructive">
                  High Risk
                </Badge>
              </div>

              <div className="p-6">
                <div className="mb-6 flex items-center gap-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10">
                    <span className="text-3xl font-bold text-destructive">87</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Risk Score: 87/100</p>
                    <p className="text-xs text-muted-foreground">Category: Phishing / Credential Theft</p>
                  </div>
                </div>

                <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-warning via-destructive to-destructive"
                    style={{ width: "87%" }}
                  />
                </div>

                <div className="mb-6">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Red Flags Detected
                  </p>
                  <div className="flex flex-col gap-2">
                    {[
                      "Suspicious domain masquerading as bank portal",
                      "Urgency language detected: \"Act immediately\"",
                      "Request for sensitive credentials",
                    ].map((flag) => (
                      <div key={flag} className="flex items-start gap-2">
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
                        <span className="text-sm text-muted-foreground">{flag}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-success/10 bg-success/5 p-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Recommendation</p>
                      <p className="text-xs text-muted-foreground">
                        Do not interact with this content. Report to your IT security team and block the sender.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}
