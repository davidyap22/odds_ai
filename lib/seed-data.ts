import { Database } from '@/types/database.types'

type Match = Database['public']['Tables']['matches']['Insert']
type Odds = Database['public']['Tables']['odds']['Insert']
type Prediction = Database['public']['Tables']['predictions']['Insert']

const now = new Date()
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
const dayAfter = new Date(now.getTime() + 48 * 60 * 60 * 1000)

export const seedMatches: Match[] = [
  // Live Match
  {
    id: '1',
    home_team: 'Manchester City',
    away_team: 'Arsenal',
    league: 'Premier League',
    match_date: now.toISOString(),
    status: 'live',
    home_score: 1,
    away_score: 1,
  },
  {
    id: '2',
    home_team: 'Liverpool',
    away_team: 'Chelsea',
    league: 'Premier League',
    match_date: now.toISOString(),
    status: 'live',
    home_score: 2,
    away_score: 0,
  },
  // Upcoming Matches
  {
    id: '3',
    home_team: 'Manchester United',
    away_team: 'Tottenham',
    league: 'Premier League',
    match_date: tomorrow.toISOString(),
    status: 'upcoming',
  },
  {
    id: '4',
    home_team: 'Newcastle',
    away_team: 'Brighton',
    league: 'Premier League',
    match_date: tomorrow.toISOString(),
    status: 'upcoming',
  },
  {
    id: '5',
    home_team: 'Aston Villa',
    away_team: 'West Ham',
    league: 'Premier League',
    match_date: dayAfter.toISOString(),
    status: 'upcoming',
  },
  {
    id: '6',
    home_team: 'Brentford',
    away_team: 'Fulham',
    league: 'Premier League',
    match_date: dayAfter.toISOString(),
    status: 'upcoming',
  },
]

export const seedOdds: Odds[] = [
  // Match 1: Man City vs Arsenal (Live)
  {
    match_id: '1',
    moneyline_home: 2.10,
    moneyline_draw: 3.40,
    moneyline_away: 3.25,
    over_under_line: 2.5,
    over_odds: 1.85,
    under_odds: 1.95,
    handicap_line: -0.5,
    handicap_home_odds: 1.90,
    handicap_away_odds: 1.90,
  },
  // Match 2: Liverpool vs Chelsea (Live)
  {
    match_id: '2',
    moneyline_home: 1.75,
    moneyline_draw: 3.60,
    moneyline_away: 4.50,
    over_under_line: 2.5,
    over_odds: 1.80,
    under_odds: 2.00,
    handicap_line: -0.5,
    handicap_home_odds: 1.85,
    handicap_away_odds: 1.95,
  },
  // Match 3: Man United vs Tottenham
  {
    match_id: '3',
    moneyline_home: 2.50,
    moneyline_draw: 3.30,
    moneyline_away: 2.80,
    over_under_line: 2.5,
    over_odds: 1.90,
    under_odds: 1.90,
    handicap_line: 0,
    handicap_home_odds: 1.95,
    handicap_away_odds: 1.85,
  },
  // Match 4: Newcastle vs Brighton
  {
    match_id: '4',
    moneyline_home: 1.95,
    moneyline_draw: 3.50,
    moneyline_away: 3.80,
    over_under_line: 2.5,
    over_odds: 1.88,
    under_odds: 1.92,
    handicap_line: -0.5,
    handicap_home_odds: 1.92,
    handicap_away_odds: 1.88,
  },
  // Match 5: Aston Villa vs West Ham
  {
    match_id: '5',
    moneyline_home: 2.20,
    moneyline_draw: 3.40,
    moneyline_away: 3.10,
    over_under_line: 2.5,
    over_odds: 1.85,
    under_odds: 1.95,
    handicap_line: -0.5,
    handicap_home_odds: 1.90,
    handicap_away_odds: 1.90,
  },
  // Match 6: Brentford vs Fulham
  {
    match_id: '6',
    moneyline_home: 2.40,
    moneyline_draw: 3.20,
    moneyline_away: 2.90,
    over_under_line: 2.5,
    over_odds: 1.92,
    under_odds: 1.88,
    handicap_line: 0,
    handicap_home_odds: 1.90,
    handicap_away_odds: 1.90,
  },
]

export const seedPredictions: Prediction[] = [
  // Match 1: Man City vs Arsenal
  {
    match_id: '1',
    prediction_type: 'moneyline',
    predicted_outcome: 'Draw',
    confidence_score: 72,
    ai_analysis: 'Both teams are in excellent form. Manchester City has strong possession stats (65% avg) but Arsenal\'s defensive record is solid. The match is evenly poised with both teams showing tactical discipline. A draw is the most likely outcome based on historical head-to-head data and current form.',
  },
  {
    match_id: '1',
    prediction_type: 'over_under',
    predicted_outcome: 'Over 2.5',
    confidence_score: 68,
    ai_analysis: 'Both teams average 2.1 goals per game combined. With attacking players like Haaland and Saka in form, expect an open game with multiple goals. Recent meetings have seen 3+ goals in 4 of the last 5 encounters.',
  },
  {
    match_id: '1',
    prediction_type: 'handicap',
    predicted_outcome: 'Arsenal +0.5',
    confidence_score: 65,
    ai_analysis: 'Arsenal\'s away record is impressive with only 1 loss in 8 games. While Man City is favorite, the handicap offers value given Arsenal\'s ability to compete at the highest level.',
  },
  // Match 2: Liverpool vs Chelsea
  {
    match_id: '2',
    prediction_type: 'moneyline',
    predicted_outcome: 'Liverpool',
    confidence_score: 78,
    ai_analysis: 'Liverpool\'s home form is exceptional with 12 wins in 14 matches. Salah is in peak form with 8 goals in last 6 games. Chelsea\'s away record shows vulnerability, conceding an average of 1.8 goals on the road. Strong prediction for Liverpool win.',
  },
  {
    match_id: '2',
    prediction_type: 'over_under',
    predicted_outcome: 'Over 2.5',
    confidence_score: 75,
    ai_analysis: 'Liverpool averages 2.4 goals at Anfield. Chelsea\'s defensive struggles away from home suggest a high-scoring affair. Expect attacking football from both sides.',
  },
  // Match 3: Man United vs Tottenham
  {
    match_id: '3',
    prediction_type: 'moneyline',
    predicted_outcome: 'Tottenham',
    confidence_score: 58,
    ai_analysis: 'Tottenham has won 3 of the last 5 meetings. Son and Maddison are creating chances consistently. Man United\'s recent form is inconsistent with defensive issues. Slight edge to Spurs based on current momentum.',
  },
  {
    match_id: '3',
    prediction_type: 'over_under',
    predicted_outcome: 'Over 2.5',
    confidence_score: 71,
    ai_analysis: 'Historical data shows these fixtures are high-scoring. Both teams play attacking football and have defensive vulnerabilities. Expect 3+ goals.',
  },
  // Match 4: Newcastle vs Brighton
  {
    match_id: '4',
    prediction_type: 'moneyline',
    predicted_outcome: 'Newcastle',
    confidence_score: 66,
    ai_analysis: 'Newcastle\'s home fortress has been breached only twice this season. Their pressing game suits the home crowd\'s energy. Brighton is solid but Newcastle should edge this one.',
  },
  {
    match_id: '4',
    prediction_type: 'over_under',
    predicted_outcome: 'Under 2.5',
    confidence_score: 62,
    ai_analysis: 'Both teams have solid defensive records. Newcastle concedes 0.9 goals at home. Brighton plays a possession-based game that limits scoring chances. Expect a tactical, low-scoring match.',
  },
  // Match 5: Aston Villa vs West Ham
  {
    match_id: '5',
    prediction_type: 'moneyline',
    predicted_outcome: 'Aston Villa',
    confidence_score: 64,
    ai_analysis: 'Villa Park has been a stronghold with Unai Emery\'s tactical setup. Watkins is in form with 6 goals in last 7 games. West Ham\'s away form is inconsistent. Villa should control this match.',
  },
  {
    match_id: '5',
    prediction_type: 'over_under',
    predicted_outcome: 'Over 2.5',
    confidence_score: 59,
    ai_analysis: 'Aston Villa plays attacking football at home averaging 2.2 goals. West Ham will need to score to get a result, opening up the game. Moderate confidence for over 2.5 goals.',
  },
  // Match 6: Brentford vs Fulham
  {
    match_id: '6',
    prediction_type: 'moneyline',
    predicted_outcome: 'Draw',
    confidence_score: 61,
    ai_analysis: 'London derby between evenly matched sides. Brentford\'s home advantage is marginal. Fulham has shown resilience in recent weeks. Historical meetings suggest a tight contest ending in a draw.',
  },
  {
    match_id: '6',
    prediction_type: 'over_under',
    predicted_outcome: 'Over 2.5',
    confidence_score: 67,
    ai_analysis: 'Both teams play open, attacking football. Brentford averages 2.1 goals at home while Fulham scores 1.6 away. Combined with defensive lapses on both sides, expect goals.',
  },
]
