/**
 * Database Seeding Script
 *
 * This script helps you populate your Supabase database with sample data.
 *
 * To use this script:
 * 1. Make sure your Supabase tables are created
 * 2. Copy the SQL statements below and run them in your Supabase SQL Editor
 * 3. Or use the Supabase client to insert the data programmatically
 */

import { seedMatches, seedOdds, seedPredictions } from '../lib/seed-data'

// Generate SQL INSERT statements for easy copy-paste into Supabase SQL Editor

console.log('=== MATCHES TABLE ===\n')
seedMatches.forEach(match => {
  const values = [
    `'${match.id}'`,
    `'${match.home_team}'`,
    `'${match.away_team}'`,
    `'${match.league}'`,
    `'${match.match_date}'`,
    `'${match.status}'`,
    match.home_score !== undefined ? match.home_score : 'NULL',
    match.away_score !== undefined ? match.away_score : 'NULL'
  ].join(', ')

  console.log(`INSERT INTO matches (id, home_team, away_team, league, match_date, status, home_score, away_score) VALUES (${values});`)
})

console.log('\n=== ODDS TABLE ===\n')
seedOdds.forEach(odds => {
  const values = [
    `'${odds.match_id}'`,
    odds.moneyline_home,
    odds.moneyline_draw,
    odds.moneyline_away,
    odds.over_under_line,
    odds.over_odds,
    odds.under_odds,
    odds.handicap_line,
    odds.handicap_home_odds,
    odds.handicap_away_odds
  ].join(', ')

  console.log(`INSERT INTO odds (match_id, moneyline_home, moneyline_draw, moneyline_away, over_under_line, over_odds, under_odds, handicap_line, handicap_home_odds, handicap_away_odds) VALUES (${values});`)
})

console.log('\n=== PREDICTIONS TABLE ===\n')
seedPredictions.forEach(pred => {
  const analysis = pred.ai_analysis.replace(/'/g, "''") // Escape single quotes
  const values = [
    `'${pred.match_id}'`,
    `'${pred.prediction_type}'`,
    `'${pred.predicted_outcome}'`,
    pred.confidence_score,
    `'${analysis}'`
  ].join(', ')

  console.log(`INSERT INTO predictions (match_id, prediction_type, predicted_outcome, confidence_score, ai_analysis) VALUES (${values});`)
})

console.log('\n=== DONE ===')
console.log('Copy the SQL statements above and run them in your Supabase SQL Editor')
