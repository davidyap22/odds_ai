'use client'

import { PredictionType } from '@/types'

interface PredictionFilterProps {
  selectedType: PredictionType | 'all'
  onTypeChange: (type: PredictionType | 'all') => void
}

const FILTER_OPTIONS = [
  { value: 'moneyline' as const, label: 'Moneyline', icon: '⚽' },
  { value: 'handicap' as const, label: 'Handicap', icon: '📊' },
  { value: 'over_under' as const, label: 'Over/Under', icon: '🎲' },
]

export function PredictionFilter({ selectedType, onTypeChange }: PredictionFilterProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onTypeChange(option.value)}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap overflow-hidden group ${
              selectedType === option.value
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl shadow-blue-500/30 scale-105'
                : 'bg-surface/80 backdrop-blur-sm border border-border/50 text-text-secondary hover:border-primary/50 hover:text-text-primary hover:shadow-lg hover:scale-105'
            }`}
          >
            {/* Shine effect on selected */}
            {selectedType === option.value && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            )}

            <span className="text-lg relative z-10">{option.icon}</span>
            <span className="text-sm font-semibold relative z-10">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
