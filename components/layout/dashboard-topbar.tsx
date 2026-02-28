"use client"

import { Bell, Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthSession } from "@/hooks/use-auth-session"

export function DashboardTopbar({
  notificationCount,
  onToggleMenu,
}: {
  notificationCount: number
  onToggleMenu: () => void
}) {
  const { session } = useAuthSession()

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onToggleMenu}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
          <p className="hidden text-xs text-muted-foreground sm:block">Real-time fraud intelligence overview</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground hover:bg-secondary"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {notificationCount > 0 && (
            <span className="absolute -right-1 -top-1 rounded-full bg-cyan px-1.5 py-0.5 text-[10px] leading-none text-primary-foreground">
              {notificationCount}
            </span>
          )}
        </Button>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan/10 text-cyan">
          <User className="h-4 w-4" strokeWidth={1.5} />
        </div>
        <span className="hidden text-xs text-muted-foreground sm:inline">
          {session?.name || "Guest"}
        </span>
      </div>
    </header>
  )
}
