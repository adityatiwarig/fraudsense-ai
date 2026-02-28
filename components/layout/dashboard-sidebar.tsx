"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { clearSession } from "@/hooks/use-auth-session"
import {
  Shield,
  LayoutDashboard,
  Scan,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react"

const sidebarLinks = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/analyze", icon: Scan, label: "Analyze" },
  { href: "/dashboard/reports", icon: FileText, label: "Reports" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
]

export function DashboardSidebar({
  mobileOpen,
  onMobileClose,
}: {
  mobileOpen: boolean
  onMobileClose: () => void
}) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {mobileOpen && (
        <button
          className="fixed inset-0 z-20 bg-background/70 backdrop-blur-sm md:hidden"
          aria-label="Close navigation menu"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={cn(
          "fixed z-30 flex h-dvh flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 md:static",
          collapsed ? "w-16" : "w-60",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
          <Shield className="h-6 w-6 shrink-0 text-cyan" strokeWidth={1.5} />
          {!collapsed && (
            <span className="text-sm font-semibold text-sidebar-foreground whitespace-nowrap">
              FraudSense<span className="text-cyan"> AI</span>
            </span>
          )}
        </Link>
      </div>

      {/* Links */}
      <nav className="flex-1 px-3 py-4">
        <div className="flex flex-col gap-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onMobileClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  isActive || (pathname === "/analyze" && link.href === "/dashboard/analyze")
                    ? "bg-sidebar-accent text-cyan"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <link.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                {!collapsed && <span className="whitespace-nowrap">{link.label}</span>}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-3 py-3">
        <Link
          href="/login"
          onClick={() => {
            clearSession()
            onMobileClose()
          }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.5} />
          {!collapsed && <span>Sign Out</span>}
        </Link>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground/70 hover:text-sidebar-foreground md:flex"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>
      </aside>
    </>
  )
}
