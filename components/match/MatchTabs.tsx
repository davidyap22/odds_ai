'use client'

import { useState } from 'react'
import { CurrentOdds } from '@/components/odds/CurrentOdds'
import { PredictionsSection } from '@/components/predictions/PredictionsSection'
import { OddsHistory, Prediction, MatchType } from '@/types'

interface MatchTabsProps {
  // Odds props
  latestOdds: OddsHistory | null
  matchType: MatchType | null
  homeTeam: string
  awayTeam: string

  // Predictions props
  predictions: Prediction[]
  league: string
  matchStatus?: string
}

type TabType = 'odds' | 'predictions'

export function MatchTabs({
  latestOdds,
  matchType,
  homeTeam,
  awayTeam,
  predictions,
  league,
  matchStatus
}: MatchTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('predictions')

  return (
    <div className="w-full">
      {/* Tab Buttons */}
      <div className="flex gap-4 mb-6 border-b border-border">
        <button
          onClick={() => setActiveTab('odds')}
          className={`px-6 py-3 font-semibold transition-all relative ${
            activeTab === 'odds'
              ? 'text-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <span>Live Odds</span>
          </span>
          {activeTab === 'odds' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('predictions')}
          className={`px-6 py-3 font-semibold transition-all relative ${
            activeTab === 'predictions'
              ? 'text-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <span>AI Predictions</span>
            {predictions.length > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-primary text-white rounded-full">
                {predictions.length}
              </span>
            )}
          </span>
          {activeTab === 'predictions' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="w-full">
        {activeTab === 'odds' && (
          <div className="animate-in fade-in duration-200">
            <CurrentOdds
              latestOdds={latestOdds}
              matchType={matchType}
              homeTeam={homeTeam}
              awayTeam={awayTeam}
            />
          </div>
        )}

        {activeTab === 'predictions' && (
          <div className="animate-in fade-in duration-200">
            <PredictionsSection
              predictions={predictions}
              homeTeam={homeTeam}
              awayTeam={awayTeam}
              league={league}
              matchStatus={matchStatus}
            />
          </div>
        )}
      </div>
    </div>
  )
}
