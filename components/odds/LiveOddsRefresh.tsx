'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MatchType } from '@/types'

interface LiveOddsRefreshProps {
  matchType: MatchType | null
  refreshInterval?: number // in seconds, default 20
}

/**
 * Client component that auto-refreshes the page for live matches
 * This ensures odds are updated in real-time during In Play matches
 */
export function LiveOddsRefresh({ matchType, refreshInterval = 20 }: LiveOddsRefreshProps) {
  const router = useRouter()
  const [countdown, setCountdown] = useState(refreshInterval)

  useEffect(() => {
    // Only refresh for In Play matches
    if (matchType !== 'In Play') {
      return
    }

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return refreshInterval
        }
        return prev - 1
      })
    }, 1000)

    // Refresh the page to get latest odds
    const refreshTimer = setInterval(() => {
      router.refresh()
      setCountdown(refreshInterval)
    }, refreshInterval * 1000)

    return () => {
      clearInterval(countdownInterval)
      clearInterval(refreshTimer)
    }
  }, [matchType, refreshInterval, router])

  // Only show for In Play matches
  if (matchType !== 'In Play') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-surface border-2 border-danger rounded-lg px-4 py-2 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-danger rounded-full animate-pulse" />
          <span className="text-sm text-text-primary font-medium">Live</span>
          <span className="text-xs text-text-secondary">
            Updates in {countdown}s
          </span>
        </div>
      </div>
    </div>
  )
}
