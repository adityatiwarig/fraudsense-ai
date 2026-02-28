"use client"

import { useEffect, useState } from "react"
import { Settings, Bell, Shield, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { readSession } from "@/hooks/use-auth-session"

export default function SettingsPage() {
  const { prefs, updatePrefs } = useDashboardData()
  const [name, setName] = useState("Security Analyst")
  const [email, setEmail] = useState("analyst@fraudsense.ai")

  useEffect(() => {
    const session = readSession()
    if (session) {
      setName(session.name)
      setEmail(session.email)
    }
  }, [])

  const notificationItems = [
    {
      key: "highRiskAlerts" as const,
      label: "High risk alerts",
      description: "Get notified for critical threats",
    },
    {
      key: "weeklyDigest" as const,
      label: "Weekly digest",
      description: "Summary of weekly threat analysis",
    },
    {
      key: "productUpdates" as const,
      label: "Product updates",
      description: "New features and improvements",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
          <Settings className="h-4 w-4" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Settings</h2>
          <p className="text-xs text-muted-foreground">Manage your account and preferences</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile */}
        <div className="glass-card rounded-xl p-6">
          <div className="mb-5 flex items-center gap-3">
            <User className="h-4 w-4 text-cyan" strokeWidth={1.5} />
            <h3 className="text-sm font-semibold text-foreground">Profile</h3>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted-foreground">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 rounded-lg border border-border bg-secondary px-3 text-sm text-foreground transition-all focus:border-cyan/40 focus:outline-none focus:ring-2 focus:ring-cyan/20"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 rounded-lg border border-border bg-secondary px-3 text-sm text-foreground transition-all focus:border-cyan/40 focus:outline-none focus:ring-2 focus:ring-cyan/20"
              />
            </div>
            <Button className="mt-2 w-fit bg-cyan text-primary-foreground hover:bg-cyan/90" size="sm">
              Save Changes
            </Button>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card rounded-xl p-6">
          <div className="mb-5 flex items-center gap-3">
            <Bell className="h-4 w-4 text-cyan" strokeWidth={1.5} />
            <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
          </div>
          <div className="flex flex-col gap-4">
            {notificationItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3">
                <div>
                  <p className="text-sm text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => updatePrefs({ ...prefs, [item.key]: !prefs[item.key] })}
                  className={`h-6 w-10 cursor-pointer rounded-full p-0.5 transition-colors ${
                    prefs[item.key] ? "bg-cyan" : "bg-secondary"
                  }`}
                >
                  <div
                    className={`h-5 w-5 rounded-full bg-foreground transition-transform ${
                      prefs[item.key] ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* API Key */}
        <div className="glass-card rounded-xl p-6 lg:col-span-2">
          <div className="mb-5 flex items-center gap-3">
            <Shield className="h-4 w-4 text-cyan" strokeWidth={1.5} />
            <h3 className="text-sm font-semibold text-foreground">API Configuration</h3>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted-foreground">Gemini API Key</label>
              <input
                type="password"
                value="Configured via .env (server-side)"
                readOnly
                className="h-10 max-w-md rounded-lg border border-border bg-secondary px-3 font-mono text-sm text-foreground transition-all focus:border-cyan/40 focus:outline-none focus:ring-2 focus:ring-cyan/20"
              />
              <p className="text-xs text-muted-foreground">
                Used for AI-powered threat analysis. Get your key from Google AI Studio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
