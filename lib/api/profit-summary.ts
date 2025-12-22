import { createClient } from '@/lib/supabase/server'

export interface ProfitBet {
  id: number
  fixture_id: number
  type: 'ML' | 'OU' | 'HDP'
  clock: number | null
  selection: string
  line: number
  odds: number
  stake_units: number
  stake_money: number
  profit: number
  status: 'WIN' | 'LOSS' | 'PUSH'
  bet_time: string
}

export interface ProfitSummary {
  fixture_id: number
  league_name: string
  home_score: number
  away_score: number
  total_profit: number
  total_invested: number
  roi_percentage: number
  total_bets: number
  profit_moneyline: number
  profit_handicap: number
  profit_ou: number
  bets: ProfitBet[]
}

export interface OverallProfitStats {
  total_profit: number
  total_invested: number
  roi_percentage: number
  total_bets: number
  total_matches: number
  profit_moneyline: number
  profit_handicap: number
  profit_ou: number
  bets_moneyline: number
  bets_handicap: number
  bets_ou: number
  wins_moneyline: number
  wins_handicap: number
  wins_ou: number
}

export interface ProfitChartDataPoint {
  date: string
  cumulative_profit: number
  cumulative_ml: number
  cumulative_ou: number
  cumulative_hdp: number
  match_profit: number
  home_team: string
  away_team: string
}

export async function getProfitSummaryByFixtureId(fixtureId: number): Promise<ProfitSummary | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profit_summary')
    .select('*')
    .eq('fixture_id', fixtureId)
    .order('bet_time', { ascending: true })

  if (error) {
    console.error('Error fetching profit summary:', error)
    return null
  }

  if (!data || data.length === 0) {
    return null
  }

  // Get the first row for summary data (all rows have same summary values)
  const firstRow = data[0]

  // Transform all rows to bets
  const bets: ProfitBet[] = data.map(row => ({
    id: row.id,
    fixture_id: row.fixture_id,
    type: row.type as 'ML' | 'OU' | 'HDP',
    clock: row.clock,
    selection: row.selection || '',
    line: parseFloat(row.line) || 0,
    odds: parseFloat(row.odds) || 0,
    stake_units: parseFloat(row.stake_units) || 0,
    stake_money: parseFloat(row.stake_money) || 0,
    profit: parseFloat(row.profit) || 0,
    status: row.status as 'WIN' | 'LOSS' | 'PUSH',
    bet_time: row.bet_time
  }))

  return {
    fixture_id: firstRow.fixture_id,
    league_name: firstRow.league_name,
    home_score: firstRow.home_score || 0,
    away_score: firstRow.away_score || 0,
    total_profit: parseFloat(firstRow.total_profit) || 0,
    total_invested: parseFloat(firstRow.total_invested) || 0,
    roi_percentage: parseFloat(firstRow.roi_percentage) || 0,
    total_bets: parseInt(firstRow.total_bets) || 0,
    profit_moneyline: parseFloat(firstRow.profit_moneyline) || 0,
    profit_handicap: parseFloat(firstRow.profit_handicap) || 0,
    profit_ou: parseFloat(firstRow.profit_ou) || 0,
    bets
  }
}

export async function getOverallProfitStats(): Promise<OverallProfitStats> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profit_summary')
    .select('*')

  if (error) {
    console.error('Error fetching overall profit stats:', error)
    return {
      total_profit: 0,
      total_invested: 0,
      roi_percentage: 0,
      total_bets: 0,
      total_matches: 0,
      profit_moneyline: 0,
      profit_handicap: 0,
      profit_ou: 0,
      bets_moneyline: 0,
      bets_handicap: 0,
      bets_ou: 0,
      wins_moneyline: 0,
      wins_handicap: 0,
      wins_ou: 0
    }
  }

  if (!data || data.length === 0) {
    return {
      total_profit: 0,
      total_invested: 0,
      roi_percentage: 0,
      total_bets: 0,
      total_matches: 0,
      profit_moneyline: 0,
      profit_handicap: 0,
      profit_ou: 0,
      bets_moneyline: 0,
      bets_handicap: 0,
      bets_ou: 0,
      wins_moneyline: 0,
      wins_handicap: 0,
      wins_ou: 0
    }
  }

  // Group by fixture_id to get unique matches
  interface FixtureGroup {
    total_profit: number
    total_invested: number
    total_bets: number
    profit_moneyline: number
    profit_handicap: number
    profit_ou: number
    bets: any[]
  }

  const fixtureGroups = data.reduce((acc, row) => {
    if (!acc[row.fixture_id]) {
      acc[row.fixture_id] = {
        total_profit: parseFloat(row.total_profit) || 0,
        total_invested: parseFloat(row.total_invested) || 0,
        total_bets: parseInt(row.total_bets) || 0,
        profit_moneyline: parseFloat(row.profit_moneyline) || 0,
        profit_handicap: parseFloat(row.profit_handicap) || 0,
        profit_ou: parseFloat(row.profit_ou) || 0,
        bets: []
      }
    }
    acc[row.fixture_id].bets.push(row)
    return acc
  }, {} as Record<number, FixtureGroup>)

  const fixtures: FixtureGroup[] = Object.values(fixtureGroups)

  // Calculate totals
  const total_profit = fixtures.reduce((sum, f) => sum + f.total_profit, 0)
  const total_invested = fixtures.reduce((sum, f) => sum + f.total_invested, 0)
  const total_bets = fixtures.reduce((sum, f) => sum + f.total_bets, 0)
  const profit_moneyline = fixtures.reduce((sum, f) => sum + f.profit_moneyline, 0)
  const profit_handicap = fixtures.reduce((sum, f) => sum + f.profit_handicap, 0)
  const profit_ou = fixtures.reduce((sum, f) => sum + f.profit_ou, 0)

  // Calculate bets and wins by type
  const mlBets = data.filter(b => b.type === 'ML')
  const ouBets = data.filter(b => b.type === 'OU')
  const hdpBets = data.filter(b => b.type === 'HDP')

  const bets_moneyline = mlBets.length
  const bets_ou = ouBets.length
  const bets_handicap = hdpBets.length

  const wins_moneyline = mlBets.filter(b => b.status === 'WIN').length
  const wins_ou = ouBets.filter(b => b.status === 'WIN').length
  const wins_handicap = hdpBets.filter(b => b.status === 'WIN').length

  const roi_percentage = total_invested > 0 ? (total_profit / total_invested) * 100 : 0

  return {
    total_profit,
    total_invested,
    roi_percentage,
    total_bets,
    total_matches: fixtures.length,
    profit_moneyline,
    profit_handicap,
    profit_ou,
    bets_moneyline,
    bets_handicap,
    bets_ou,
    wins_moneyline,
    wins_handicap,
    wins_ou
  }
}

export async function getProfitChartData(): Promise<ProfitChartDataPoint[]> {
  const supabase = await createClient()

  // Get all profit summary data
  const { data: profitData, error: profitError } = await supabase
    .from('profit_summary')
    .select('*')

  if (profitError) {
    console.error('Error fetching profit data for chart:', profitError)
    return []
  }

  if (!profitData || profitData.length === 0) {
    console.log('No profit data available for chart')
    return []
  }

  console.log('Profit data rows:', profitData.length)
  console.log('Sample row:', profitData[0])

  // Group by fixture_id to get unique matches with their data
  interface FixtureData {
    fixture_id: number
    total_profit: number
    profit_moneyline: number
    profit_handicap: number
    profit_ou: number
    home_team: string
    away_team: string
    bet_time: string
  }

  const fixtureGroups = profitData.reduce((acc, row) => {
    if (!acc[row.fixture_id]) {
      acc[row.fixture_id] = {
        fixture_id: row.fixture_id,
        total_profit: parseFloat(row.total_profit) || 0,
        profit_moneyline: parseFloat(row.profit_moneyline) || 0,
        profit_handicap: parseFloat(row.profit_handicap) || 0,
        profit_ou: parseFloat(row.profit_ou) || 0,
        home_team: '',
        away_team: '',
        bet_time: row.bet_time
      }
    }
    return acc
  }, {} as Record<number, FixtureData>)

  const fixtures: FixtureData[] = Object.values(fixtureGroups)

  console.log('Unique fixtures:', fixtures.length)

  if (fixtures.length === 0) {
    console.log('No fixtures found for chart')
    return []
  }

  // Get team names from prematches table
  const fixtureIds = fixtures.map(f => parseInt(f.fixture_id.toString()))
  const { data: matchData } = await supabase
    .from('prematches')
    .select('fixture_id, home_name, away_name')
    .in('fixture_id', fixtureIds)

  // Map team names to fixtures
  if (matchData) {
    fixtures.forEach(fixture => {
      const match = matchData.find(m => m.fixture_id === parseInt(fixture.fixture_id.toString()))
      if (match) {
        fixture.home_team = match.home_name || ''
        fixture.away_team = match.away_name || ''
      }
    })
  }

  console.log('After adding team names, sample fixture:', fixtures[0])

  // Sort by bet_time
  const sortedFixtures = fixtures.sort((a, b) =>
    new Date(a.bet_time).getTime() - new Date(b.bet_time).getTime()
  )

  // Calculate cumulative profits
  let cumulativeTotal = 0
  let cumulativeML = 0
  let cumulativeOU = 0
  let cumulativeHDP = 0

  const chartData: ProfitChartDataPoint[] = sortedFixtures.map(fixture => {
    cumulativeTotal += fixture.total_profit
    cumulativeML += fixture.profit_moneyline
    cumulativeOU += fixture.profit_ou
    cumulativeHDP += fixture.profit_handicap

    return {
      date: new Date(fixture.bet_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      cumulative_profit: cumulativeTotal,
      cumulative_ml: cumulativeML,
      cumulative_ou: cumulativeOU,
      cumulative_hdp: cumulativeHDP,
      match_profit: fixture.total_profit,
      home_team: fixture.home_team,
      away_team: fixture.away_team
    }
  })

  console.log(`Chart data generated: ${chartData.length} data points`)
  return chartData
}
