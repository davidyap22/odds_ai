import { Database, MatchType } from './database.types'

export type Match = Database['public']['Tables']['matches']['Row'] & {
  home_logo?: string | null
  away_logo?: string | null
  league_logo?: string | null
  fixture_id?: number | null
}

export type Odds = Database['public']['Tables']['odds']['Row']
export type Prediction = Database['public']['Tables']['predictions']['Row']
export type OddsHistory = Database['public']['Tables']['odds_history']['Row']

export type MatchStatus = 'live' | 'upcoming' | 'finished'
export type PredictionType = 'moneyline' | 'over_under' | 'handicap'
export type { MatchType }

export interface MatchWithOdds extends Match {
  odds: Odds | null
  predictions?: Prediction[]
}

export interface MatchWithPredictions extends Match {
  predictions: Prediction[]
}

export interface MatchDetail extends Match {
  odds: Odds | null
  predictions: Prediction[]
  latestOdds: OddsHistory | null
  matchType: MatchType | null
}

export interface MoneylineOdds {
  home: number
  draw: number
  away: number
}

export interface OverUnderOdds {
  line: number
  over: number
  under: number
}

export interface HandicapOdds {
  line: number
  homeOdds: number
  awayOdds: number
}
