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

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 1500))
    console.log("[FraudSense] Register submitted:", data.email)
    saveSession({
      name: data.name,
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

          <h1 className="mb-1 text-2xl font-bold text-foreground">Create your account</h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Start protecting against fraud with AI-powered intelligence.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-xs font-medium text-muted-foreground">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                placeholder="John Doe"
                className="h-11 rounded-lg border border-border bg-secondary px-4 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-cyan/40 focus:outline-none focus:ring-2 focus:ring-cyan/20"
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

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
                  placeholder="Min 8 characters"
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

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-xs font-medium text-muted-foreground">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                placeholder="Repeat your password"
                className="h-11 rounded-lg border border-border bg-secondary px-4 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-cyan/40 focus:outline-none focus:ring-2 focus:ring-cyan/20"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
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
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-cyan hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
