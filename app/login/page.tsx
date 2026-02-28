"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { Shield, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthIllustration } from "@/components/auth/auth-illustration"
import { saveSession } from "@/hooks/use-auth-session"

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true)
    // simulate login
    await new Promise((r) => setTimeout(r, 1500))
    console.log("[FraudSense] Login submitted:", data.email)
    saveSession({
      name: data.email.split("@")[0],
      email: data.email,
      createdAt: new Date().toISOString(),
    })
    setIsSubmitting(false)
    window.location.href = "/dashboard"
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left - Illustration */}
      <div className="hidden lg:block">
        <AuthIllustration />
      </div>

      {/* Right - Form */}
      <div className="flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm">
          {/* Logo (mobile) */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <Shield className="h-6 w-6 text-cyan" strokeWidth={1.5} />
            <span className="text-lg font-semibold text-foreground">
              FraudSense<span className="text-cyan"> AI</span>
            </span>
          </div>

          <h1 className="mb-1 text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Sign in to access your fraud intelligence dashboard.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs font-medium text-muted-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder="you@company.com"
                className="h-11 rounded-lg border border-border bg-secondary px-4 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-cyan/40 focus:outline-none focus:ring-2 focus:ring-cyan/20"
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-xs font-medium text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter your password"
                  className="h-11 w-full rounded-lg border border-border bg-secondary px-4 pr-10 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-cyan/40 focus:outline-none focus:ring-2 focus:ring-cyan/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 bg-cyan text-primary-foreground hover:bg-cyan/90 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {"Don't have an account? "}
            <Link href="/register" className="text-cyan hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
