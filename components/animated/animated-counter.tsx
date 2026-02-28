"use client"

import { useEffect, useRef, useState } from "react"

interface AnimatedCounterProps {
  target: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

export function AnimatedCounter({
  target,
  duration = 2000,
  suffix = "",
  prefix = "",
  className,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isVisible = useRef(false)
  const countRef = useRef(0)

  useEffect(() => {
    countRef.current = count
  }, [count])

  useEffect(() => {
    let frame = 0
    const animateToTarget = (startValue: number, endValue: number) => {
      const startTime = performance.now()
      const animate = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        const next = Math.round(startValue + (endValue - startValue) * eased)
        setCount(next)
        if (progress < 1) {
          frame = requestAnimationFrame(animate)
        }
      }
      frame = requestAnimationFrame(animate)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible.current = true
          animateToTarget(countRef.current, target)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [target, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}
