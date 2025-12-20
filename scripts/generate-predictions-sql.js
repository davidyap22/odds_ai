const fs = require('fs');
const { parse } = require('csv-parse/sync');

// Map signal to confidence score
function getConfidenceScore(signal) {
  if (signal.includes('🟢')) {
    if (signal.includes('坚决') || signal.includes('追')) {
      return Math.floor(Math.random() * 15) + 75; // 75-90
    }
    return Math.floor(Math.random() * 15) + 70; // 70-85
  }
  if (signal.includes('🟡')) {
    return Math.floor(Math.random() * 15) + 50; // 50-65
  }
  if (signal.includes('🔴')) {
    return Math.floor(Math.random() * 10) + 40; // 40-50
  }
  return 60;
}

// Map AI model type
function mapAIModel(index) {
  const models = ['gemini', 'chatgpt', 'claude'];
  return models[index % 3];
}

// Clean and format predicted outcome
function formatPredictedOutcome(selection, predictionType) {
  if (!selection) return 'No prediction';

  if (predictionType === 'moneyline') {
    if (selection === 'Home') return 'Home Win';
    if (selection === 'Away') return 'Away Win';
    if (selection === 'Draw') return 'Draw';
  }

  return selection;
}

// Escape SQL string
function escapeSql(str) {
  if (!str) return '';
  return str.replace(/'/g, "''");
}

function generateSQL() {
  console.log('🚀 Generating predictions SQL...\n');

  // Read CSV files
  const moneylineData = parse(fs.readFileSync('/Users/davidyap/Downloads/moneyline 1x2_rows.csv'), {
    columns: true,
    skip_empty_lines: true
  });

  const overUnderData = parse(fs.readFileSync('/Users/davidyap/Downloads/OverUnder_rows.csv'), {
    columns: true,
    skip_empty_lines: true
  });

  const handicapData = parse(fs.readFileSync('/Users/davidyap/Downloads/Handicap_rows.csv'), {
    columns: true,
    skip_empty_lines: true
  });

  console.log(`📊 Loaded data:`);
  console.log(`   - Moneyline: ${moneylineData.length} rows`);
  console.log(`   - Over/Under: ${overUnderData.length} rows`);
  console.log(`   - Handicap: ${handicapData.length} rows\n`);

  // Group by fixture_id and get latest record
  const groupedMoneyline = {};
  const groupedOverUnder = {};
  const groupedHandicap = {};

  moneylineData.forEach(row => {
    const fixtureId = row.fixture_id;
    if (!groupedMoneyline[fixtureId] || row.id > groupedMoneyline[fixtureId].id) {
      groupedMoneyline[fixtureId] = row;
    }
  });

  overUnderData.forEach(row => {
    const fixtureId = row.fixture_id;
    if (!groupedOverUnder[fixtureId] || row.id > groupedOverUnder[fixtureId].id) {
      groupedOverUnder[fixtureId] = row;
    }
  });

  handicapData.forEach(row => {
    const fixtureId = row.fixture_id;
    if (!groupedHandicap[fixtureId] || row.id > groupedHandicap[fixtureId].id) {
      groupedHandicap[fixtureId] = row;
    }
  });

  // Generate SQL
  let sql = `-- Insert AI Predictions from CSV data\n`;
  sql += `-- Generated at ${new Date().toISOString()}\n\n`;

  let modelIndex = 0;
  let insertCount = 0;

  // Process Moneyline
  for (const [fixtureId, row] of Object.entries(groupedMoneyline)) {
    const outcome = escapeSql(formatPredictedOutcome(row.selection, 'moneyline'));
    const analysis = escapeSql(row.commentary_malaysia || 'AI analysis based on market signals and odds movement.');
    const confidence = getConfidenceScore(row.signal);
    const aiModel = mapAIModel(modelIndex++);

    sql += `INSERT INTO predictions (match_id, prediction_type, predicted_outcome, confidence_score, ai_analysis, ai_model)\n`;
    sql += `SELECT id, 'moneyline', '${outcome}', ${confidence}, '${analysis}', '${aiModel}'\n`;
    sql += `FROM prematches WHERE fixture_id = ${fixtureId} LIMIT 1;\n\n`;
    insertCount++;
  }

  // Process Over/Under
  for (const [fixtureId, row] of Object.entries(groupedOverUnder)) {
    const outcome = escapeSql(formatPredictedOutcome(row.selection, 'over_under'));
    const analysis = escapeSql(row.commentary_malaysia || 'Over/Under analysis based on scoring trends and market movement.');
    const confidence = getConfidenceScore(row.signal);
    const aiModel = mapAIModel(modelIndex++);

    sql += `INSERT INTO predictions (match_id, prediction_type, predicted_outcome, confidence_score, ai_analysis, ai_model)\n`;
    sql += `SELECT id, 'over_under', '${outcome}', ${confidence}, '${analysis}', '${aiModel}'\n`;
    sql += `FROM prematches WHERE fixture_id = ${fixtureId} LIMIT 1;\n\n`;
    insertCount++;
  }

  // Process Handicap
  for (const [fixtureId, row] of Object.entries(groupedHandicap)) {
    const outcome = escapeSql(formatPredictedOutcome(row.selection, 'handicap'));
    const analysis = escapeSql(row.commentary_malaysia || 'Handicap analysis based on team strength differential.');
    const confidence = getConfidenceScore(row.signal);
    const aiModel = mapAIModel(modelIndex++);

    sql += `INSERT INTO predictions (match_id, prediction_type, predicted_outcome, confidence_score, ai_analysis, ai_model)\n`;
    sql += `SELECT id, 'handicap', '${outcome}', ${confidence}, '${analysis}', '${aiModel}'\n`;
    sql += `FROM prematches WHERE fixture_id = ${fixtureId} LIMIT 1;\n\n`;
    insertCount++;
  }

  sql += `-- Total predictions to insert: ${insertCount}\n`;
  sql += `SELECT COUNT(*) as total_predictions FROM predictions;`;

  // Write to file
  fs.writeFileSync('scripts/insert-predictions.sql', sql);

  console.log(`✅ Generated SQL with ${insertCount} predictions`);
  console.log(`📝 Saved to: scripts/insert-predictions.sql\n`);
  console.log(`Next steps:`);
  console.log(`1. Open Supabase SQL Editor`);
  console.log(`2. Copy and paste the SQL from scripts/insert-predictions.sql`);
  console.log(`3. Run the SQL`);
  console.log(`4. Refresh your webpage to see predictions!`);
}

// Run
generateSQL();
