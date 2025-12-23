'use client'

import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  end: number
  duration?: number
  decimals?: number
  suffix?: string
  prefix?: string
  className?: string
  separator?: boolean
}

export function CountUp({
  end,
  duration = 2000,
  decimals = 0,
  suffix = '',
  prefix = '',
  className = '',
  separator = true
}: CountUpProps) {
  const [count, setCount] = useState(0)
  const countRef = useRef(0)
  const startTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }

      const progress = timestamp - startTimeRef.current
      const percentage = Math.min(progress / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4)

      const currentCount = end * easeOutQuart
      countRef.current = currentCount
      setCount(currentCount)

      if (percentage < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [end, duration])

  const formatNumber = (value: number) => {
    if (separator) {
      return value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })
    }
    return value.toFixed(decimals)
  }

  const displayValue = formatNumber(count)

  return (
    <span className={className}>
      {prefix}{displayValue}{suffix}
    </span>
  )
}
