'use client'

import { useState } from 'react'
import { Prediction, PredictionType } from '@/types'
import { PredictionFilter } from './PredictionFilter'
import { PredictionCard } from './PredictionCard'
import { PredictionCardSummary } from './PredictionCardSummary'
import { Card, CardBody } from '@/components/ui/Card'

interface PredictionsSectionProps {
  predictions: Prediction[]
  homeTeam: string
  awayTeam: string
  league: string
  matchStatus?: string
  matchType?: string
}

export function PredictionsSection({
  predictions,
  homeTeam,
  awayTeam,
  league,
  matchStatus,
  matchType
}: PredictionsSectionProps) {
  const [selectedType, setSelectedType] = useState<PredictionType | 'all'>('moneyline')
  const [showHistory, setShowHistory] = useState(false)

  // Get the latest prediction for each type (based on highest ID)
  const getLatestPredictions = () => {
    const latestByType: Record<string, Prediction> = {}

    predictions.forEach(p => {
      if (!latestByType[p.prediction_type] ||
          Number(p.id) > Number(latestByType[p.prediction_type].id)) {
        latestByType[p.prediction_type] = p
      }
    })

    return Object.values(latestByType)
  }

  // Filter predictions based on view mode
  const filteredPredictions = showHistory
    ? predictions
        .filter(p => selectedType === 'all' || p.prediction_type === selectedType)
        .sort((a, b) => Number(b.id) - Number(a.id)) // Sort by ID descending (newest first)
    : getLatestPredictions().filter(p => p.prediction_type === selectedType)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-primary">AI Predictions</h2>

        {/* History Toggle Button */}
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
            showHistory
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/30'
              : 'bg-surface border border-border text-text-secondary hover:border-primary hover:text-text-primary'
          }`}
        >
          <span>📜</span>
          <span>{showHistory ? 'Current Signals' : 'Signal History'}</span>
        </button>
      </div>

      {/* Filter */}
      <PredictionFilter
        selectedType={selectedType}
        onTypeChange={setSelectedType}
      />

      {/* History Mode Indicator */}
      {showHistory && (
        <div className="mt-4 mb-4 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-600/10 border border-purple-500/30 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-purple-400">📜</span>
            <span className="text-sm font-semibold text-text-primary">Viewing Signal History</span>
            <span className="text-xs text-text-secondary ml-2">
              ({filteredPredictions.length} signal{filteredPredictions.length !== 1 ? 's' : ''} found)
            </span>
          </div>
        </div>
      )}

      {/* Predictions List */}
      {filteredPredictions.length > 0 ? (
        <div className={showHistory ? "space-y-2 max-h-[600px] overflow-y-auto pr-2" : "space-y-4"}>
          {filteredPredictions.map((prediction, index) => (
            showHistory ? (
              <PredictionCardSummary
                key={`${prediction.id}-${index}`}
                prediction={prediction}
                homeTeam={homeTeam}
                awayTeam={awayTeam}
              />
            ) : (
              <PredictionCard
                key={`${prediction.id}-${index}`}
                prediction={prediction}
                homeTeam={homeTeam}
                awayTeam={awayTeam}
                league={league}
                matchStatus={matchStatus}
                matchType={matchType}
              />
            )
          ))}
        </div>
      ) : (
        <Card>
          <CardBody className="py-16">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="text-6xl opacity-20">🤖</div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {selectedType === 'all' ? 'No Predictions Available' : `No ${selectedType.charAt(0).toUpperCase() + selectedType.slice(1).replace('_', '/')} Predictions`}
                </h3>
                <p className="text-sm text-text-secondary max-w-md">
                  {showHistory
                    ? `No historical ${selectedType === 'all' ? '' : selectedType.replace('_', '/')} signals found for this match.`
                    : selectedType === 'all'
                    ? 'AI predictions for this match are not available yet.'
                    : `AI ${selectedType.replace('_', '/')} predictions for this match are not available yet.`}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
