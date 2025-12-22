'use client'

import { Card, CardBody } from '@/components/ui/Card'
import { ProfitChartDataPoint } from '@/lib/api/profit-summary'
import { formatCurrency } from '@/lib/utils/format'
import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'

interface ProfitChartProps {
  data: ProfitChartDataPoint[]
}

type ChartFilter = 'all' | 'moneyline' | 'handicap' | 'ou'

export function ProfitChart({ data }: ProfitChartProps) {
  const [filter, setFilter] = useState<ChartFilter>('all')

  if (!data || data.length === 0) {
    return null
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload

      const getCumulativeValue = () => {
        switch (filter) {
          case 'moneyline':
            return data.cumulative_ml
          case 'handicap':
            return data.cumulative_hdp
          case 'ou':
            return data.cumulative_ou
          default:
            return data.cumulative_profit
        }
      }

      const cumulativeValue = getCumulativeValue()

      return (
        <div className="bg-surface border border-border rounded-lg p-4 shadow-lg">
          <p className="text-sm font-semibold text-text-primary mb-2">{label}</p>
          <p className="text-xs text-text-secondary mb-2">
            {data.home_team} vs {data.away_team}
          </p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-text-secondary">
                {filter === 'all' ? 'Total: ' : 'Cumulative: '}
              </span>
              <span className={`font-bold ${cumulativeValue >= 0 ? 'text-success' : 'text-danger'}`}>
                {formatCurrency(cumulativeValue)}
              </span>
            </p>
            {filter === 'all' && (
              <>
                <p className="text-xs">
                  <span className="text-text-secondary">ML: </span>
                  <span className={`font-semibold ${data.cumulative_ml >= 0 ? 'text-success' : 'text-danger'}`}>
                    {formatCurrency(data.cumulative_ml)}
                  </span>
                </p>
                <p className="text-xs">
                  <span className="text-text-secondary">HDP: </span>
                  <span className={`font-semibold ${data.cumulative_hdp >= 0 ? 'text-success' : 'text-danger'}`}>
                    {formatCurrency(data.cumulative_hdp)}
                  </span>
                </p>
                <p className="text-xs">
                  <span className="text-text-secondary">O/U: </span>
                  <span className={`font-semibold ${data.cumulative_ou >= 0 ? 'text-success' : 'text-danger'}`}>
                    {formatCurrency(data.cumulative_ou)}
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  const finalProfit = data[data.length - 1]?.cumulative_profit || 0
  const finalML = data[data.length - 1]?.cumulative_ml || 0
  const finalOU = data[data.length - 1]?.cumulative_ou || 0
  const finalHDP = data[data.length - 1]?.cumulative_hdp || 0

  const getCurrentValue = () => {
    switch (filter) {
      case 'moneyline':
        return finalML
      case 'handicap':
        return finalHDP
      case 'ou':
        return finalOU
      default:
        return finalProfit
    }
  }

  const currentValue = getCurrentValue()
  const isProfit = currentValue >= 0

  const filters: { value: ChartFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'moneyline', label: 'Moneyline' },
    { value: 'handicap', label: 'Handicap' },
    { value: 'ou', label: 'Over/Under' }
  ]

  return (
    <Card className="mb-8">
      <CardBody className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-text-primary mb-1">Cumulative Profit & Loss</h3>
            <p className="text-sm text-text-secondary">Track your betting performance over time</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-text-secondary mb-1">Current Total</div>
            <div className={`text-2xl font-bold ${isProfit ? 'text-success' : 'text-danger'}`}>
              {formatCurrency(currentValue)}
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 mb-6">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f.value
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border-hover'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
              <XAxis
                dataKey="date"
                stroke="#A3A3A3"
                tick={{ fill: '#A3A3A3', fontSize: 12 }}
                tickLine={{ stroke: '#333' }}
              />
              <YAxis
                stroke="#A3A3A3"
                tick={{ fill: '#A3A3A3', fontSize: 12 }}
                tickLine={{ stroke: '#333' }}
                tickFormatter={(value) => `RM ${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    cumulative_profit: 'Total P/L',
                    cumulative_ml: 'Moneyline',
                    cumulative_ou: 'Over/Under',
                    cumulative_hdp: 'Handicap'
                  }
                  return <span style={{ color: '#FAFAFA', fontSize: '13px' }}>{labels[value] || value}</span>
                }}
              />
              <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />

              {/* Show lines based on filter */}
              {filter === 'all' && (
                <>
                  {/* Main cumulative profit line */}
                  <Line
                    type="monotone"
                    dataKey="cumulative_profit"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Total P/L"
                  />

                  {/* Moneyline */}
                  <Line
                    type="monotone"
                    dataKey="cumulative_ml"
                    stroke="#60A5FA"
                    strokeWidth={2}
                    dot={{ fill: '#60A5FA', r: 3 }}
                    strokeDasharray="5 5"
                    name="Moneyline"
                  />

                  {/* Over/Under */}
                  <Line
                    type="monotone"
                    dataKey="cumulative_ou"
                    stroke="#A78BFA"
                    strokeWidth={2}
                    dot={{ fill: '#A78BFA', r: 3 }}
                    strokeDasharray="5 5"
                    name="Over/Under"
                  />

                  {/* Handicap */}
                  <Line
                    type="monotone"
                    dataKey="cumulative_hdp"
                    stroke="#FCD34D"
                    strokeWidth={2}
                    dot={{ fill: '#FCD34D', r: 3 }}
                    strokeDasharray="5 5"
                    name="Handicap"
                  />
                </>
              )}

              {filter === 'moneyline' && (
                <Line
                  type="monotone"
                  dataKey="cumulative_ml"
                  stroke="#60A5FA"
                  strokeWidth={3}
                  dot={{ fill: '#60A5FA', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Moneyline"
                />
              )}

              {filter === 'handicap' && (
                <Line
                  type="monotone"
                  dataKey="cumulative_hdp"
                  stroke="#FCD34D"
                  strokeWidth={3}
                  dot={{ fill: '#FCD34D', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Handicap"
                />
              )}

              {filter === 'ou' && (
                <Line
                  type="monotone"
                  dataKey="cumulative_ou"
                  stroke="#A78BFA"
                  strokeWidth={3}
                  dot={{ fill: '#A78BFA', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Over/Under"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Legend Info */}
        {filter === 'all' && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-surface/50 border border-border">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-0.5 bg-blue-500"></div>
                <span className="text-xs font-semibold text-text-primary">Total P/L</span>
              </div>
              <p className="text-xs text-text-secondary">Overall cumulative profit/loss</p>
            </div>
            <div className="p-3 rounded-lg bg-surface/50 border border-border">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-0.5 bg-blue-400 border-dashed"></div>
                <span className="text-xs font-semibold text-text-primary">Moneyline</span>
              </div>
              <p className="text-xs text-text-secondary">1X2 betting performance</p>
            </div>
            <div className="p-3 rounded-lg bg-surface/50 border border-border">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-0.5 bg-purple-400 border-dashed"></div>
                <span className="text-xs font-semibold text-text-primary">Over/Under</span>
              </div>
              <p className="text-xs text-text-secondary">Total goals O/U performance</p>
            </div>
            <div className="p-3 rounded-lg bg-surface/50 border border-border">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-0.5 bg-yellow-400 border-dashed"></div>
                <span className="text-xs font-semibold text-text-primary">Handicap</span>
              </div>
              <p className="text-xs text-text-secondary">Asian handicap performance</p>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}
