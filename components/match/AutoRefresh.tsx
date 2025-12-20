'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface AutoRefreshProps {
  matchType?: string
  interval?: number // in seconds, default 10
}

export function AutoRefresh({ matchType, interval = 10 }: AutoRefreshProps) {
  const router = useRouter()
  const [isEnabled, setIsEnabled] = useState(false)
  const [countdown, setCountdown] = useState(interval)
  const isLive = matchType === 'In Play'

  useEffect(() => {
    if (!isEnabled || !isLive) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.refresh()
          return interval
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isEnabled, isLive, router, interval])

  useEffect(() => {
    if (isEnabled) {
      setCountdown(interval)
    }
  }, [isEnabled, interval])

  if (!isLive) return null

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setIsEnabled(!isEnabled)}
        className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
          isEnabled
            ? 'bg-success text-white shadow-lg shadow-success/30'
            : 'bg-surface border border-border text-text-secondary hover:border-primary hover:text-text-primary'
        }`}
      >
        <span className={isEnabled ? 'animate-spin' : ''}>🔄</span>
        <span>Auto Refresh</span>
        {isEnabled && (
          <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-mono">
            {countdown}s
          </span>
        )}
      </button>

      <button
        onClick={() => router.refresh()}
        className="px-4 py-2 rounded-lg font-semibold bg-primary text-white hover:bg-primary/90 transition-all"
      >
        Refresh Now
      </button>
    </div>
  )
}
