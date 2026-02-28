"use client"

import { useEffect, useState } from "react"

const SESSION_KEY = "fraudai_user_session"

export interface UserSession {
  name: string
  email: string
  createdAt: string
}

export function saveSession(session: UserSession) {
  if (typeof window === "undefined") return
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  if (typeof window === "undefined") return
  localStorage.removeItem(SESSION_KEY)
}

export function readSession(): UserSession | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as UserSession
  } catch {
    return null
  }
}

export function useAuthSession() {
  const [session, setSession] = useState<UserSession | null>(null)

  useEffect(() => {
    setSession(readSession())
  }, [])

  return {
    session,
    isLoggedIn: !!session,
  }
}
