export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type MatchType = 'Scheduled' | 'In Play' | 'Finished' | 'Postponed' | 'Abandoned' | 'Not Played'

export interface Database {
  public: {
    Tables: {
      odds_history: {
        Row: {
          id: number
          fixture_id: number
          bookmaker: string
          league_name: string
          home_name: string
          away_name: string
          moneyline_1x2_home: number
          moneyline_1x2_draw: number
          moneyline_1x2_away: number
          handicap_main_line: number
          handicap_home: number
          handicap_away: number
          totalpoints_main_line: number
          totalpoints_over: number
          totalpoints_under: number
          type: MatchType
          created_at: string
        }
        Insert: {
          id?: number
          fixture_id: number
          bookmaker: string
          league_name: string
          home_name: string
          away_name: string
          moneyline_1x2_home: number
          moneyline_1x2_draw: number
          moneyline_1x2_away: number
          handicap_main_line: number
          handicap_home: number
          handicap_away: number
          totalpoints_main_line: number
          totalpoints_over: number
          totalpoints_under: number
          type: MatchType
          created_at?: string
        }
        Update: {
          id?: number
          fixture_id?: number
          bookmaker?: string
          league_name?: string
          home_name?: string
          away_name?: string
          moneyline_1x2_home?: number
          moneyline_1x2_draw?: number
          moneyline_1x2_away?: number
          handicap_main_line?: number
          handicap_home?: number
          handicap_away?: number
          totalpoints_main_line?: number
          totalpoints_over?: number
          totalpoints_under?: number
          type?: MatchType
          created_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          home_team: string
          away_team: string
          league: string
          match_date: string
          status: 'live' | 'upcoming' | 'finished'
          home_score: number | null
          away_score: number | null
          created_at: string
        }
        Insert: {
          id?: string
          home_team: string
          away_team: string
          league: string
          match_date: string
          status?: 'live' | 'upcoming' | 'finished'
          home_score?: number | null
          away_score?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          home_team?: string
          away_team?: string
          league?: string
          match_date?: string
          status?: 'live' | 'upcoming' | 'finished'
          home_score?: number | null
          away_score?: number | null
          created_at?: string
        }
      }
      odds: {
        Row: {
          id: string
          match_id: string
          timestamp: string
          moneyline_home: number
          moneyline_draw: number
          moneyline_away: number
          over_under_line: number
          over_odds: number
          under_odds: number
          handicap_line: number
          handicap_home_odds: number
          handicap_away_odds: number
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          timestamp?: string
          moneyline_home: number
          moneyline_draw: number
          moneyline_away: number
          over_under_line: number
          over_odds: number
          under_odds: number
          handicap_line: number
          handicap_home_odds: number
          handicap_away_odds: number
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          timestamp?: string
          moneyline_home?: number
          moneyline_draw?: number
          moneyline_away?: number
          over_under_line?: number
          over_odds?: number
          under_odds?: number
          handicap_line?: number
          handicap_home_odds?: number
          handicap_away_odds?: number
          created_at?: string
        }
      }
      predictions: {
        Row: {
          id: string
          match_id: string
          prediction_type: 'moneyline' | 'over_under' | 'handicap'
          predicted_outcome: string
          confidence_score: number
          ai_analysis: string
          ai_model: 'gemini' | 'chatgpt' | 'claude' | null
          signal: string | null
          clock: number | null
          bookmaker: string | null
          stacking_quantity: string | null
          stacking_plan_description: string | null
          market_analysis_trend_direction: string | null
          market_analysis_odds_check: string | null
          market_analysis_vig_status: string | null
          odds_data: any | null
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          prediction_type: 'moneyline' | 'over_under' | 'handicap'
          predicted_outcome: string
          confidence_score: number
          ai_analysis: string
          ai_model?: 'gemini' | 'chatgpt' | 'claude' | null
          signal?: string | null
          clock?: number | null
          bookmaker?: string | null
          stacking_quantity?: string | null
          stacking_plan_description?: string | null
          market_analysis_trend_direction?: string | null
          market_analysis_odds_check?: string | null
          market_analysis_vig_status?: string | null
          odds_data?: any | null
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          prediction_type?: 'moneyline' | 'over_under' | 'handicap'
          predicted_outcome?: string
          confidence_score?: number
          ai_analysis?: string
          ai_model?: 'gemini' | 'chatgpt' | 'claude' | null
          signal?: string | null
          clock?: number | null
          bookmaker?: string | null
          stacking_quantity?: string | null
          stacking_plan_description?: string | null
          market_analysis_trend_direction?: string | null
          market_analysis_odds_check?: string | null
          market_analysis_vig_status?: string | null
          odds_data?: any | null
          created_at?: string
        }
      }
    }
  }
}
