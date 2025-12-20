# Football AI Odds Platform - Setup Guide

## Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- Database tables created in Supabase

## Database Setup

### 1. Create Tables in Supabase

Run the following SQL in your Supabase SQL Editor to create the required tables:

```sql
-- Matches table
CREATE TABLE matches (
  id TEXT PRIMARY KEY,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  league TEXT NOT NULL,
  match_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('live', 'upcoming', 'finished')),
  home_score INTEGER,
  away_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Odds table
CREATE TABLE odds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id TEXT REFERENCES matches(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  moneyline_home DECIMAL(10,2) NOT NULL,
  moneyline_draw DECIMAL(10,2) NOT NULL,
  moneyline_away DECIMAL(10,2) NOT NULL,
  over_under_line DECIMAL(10,2) NOT NULL,
  over_odds DECIMAL(10,2) NOT NULL,
  under_odds DECIMAL(10,2) NOT NULL,
  handicap_line DECIMAL(10,2) NOT NULL,
  handicap_home_odds DECIMAL(10,2) NOT NULL,
  handicap_away_odds DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Predictions table
CREATE TABLE predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id TEXT REFERENCES matches(id) ON DELETE CASCADE,
  prediction_type TEXT NOT NULL CHECK (prediction_type IN ('moneyline', 'over_under', 'handicap')),
  predicted_outcome TEXT NOT NULL,
  confidence_score INTEGER NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  ai_analysis TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_odds_match_id ON odds(match_id);
CREATE INDEX idx_predictions_match_id ON predictions(match_id);
```

### 2. Enable Row Level Security (Optional but Recommended)

```sql
-- Enable RLS
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE odds ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Allow public read access on odds" ON odds FOR SELECT USING (true);
CREATE POLICY "Allow public read access on predictions" ON predictions FOR SELECT USING (true);
```

### 3. Seed Sample Data

Generate seed SQL by running:

```bash
npx tsx scripts/seed-database.ts > seed.sql
```

Then copy the output and run it in your Supabase SQL Editor.

Or manually run the INSERT statements from the script output.

## Installation

1. Install dependencies:

```bash
npm install
```

2. Your `.env.local` file should already be configured with:

```
NEXT_PUBLIC_SUPABASE_URL=https://wykjlhbsxparltxazxmk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_TNVqHZmoiVZhQLU2pHnvsg_B2gF-kmm
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Features

### Authentication
- Sign up at `/signup`
- Log in at `/login`
- Protected dashboard at `/dashboard`

### Pages
- **Homepage** (`/`) - View live and upcoming matches with odds
- **Match Detail** (`/match/[id]`) - Detailed view of a specific match with all odds types and AI predictions
- **Dashboard** (`/dashboard`) - Personalized dashboard (requires login)

### Odds Types
- **Moneyline (1X2)** - Home win, Draw, Away win
- **Over/Under** - Total goals over/under a line
- **Asian Handicap** - Handicap betting

### AI Predictions
Each match includes AI-generated predictions with:
- Predicted outcome
- Confidence score (0-100)
- Detailed analysis

## Development

### Project Structure

```
app/
├── (auth)/           # Auth pages (login, signup)
├── (protected)/      # Protected pages (dashboard)
├── match/[id]/       # Match detail page
├── page.tsx          # Homepage
└── layout.tsx        # Root layout

components/
├── auth/             # Authentication components
├── layout/           # Header, Footer, Navigation
├── matches/          # Match cards and lists
├── odds/             # Odds display components
├── predictions/      # Prediction cards
└── ui/               # Base UI components

lib/
├── api/              # Database query functions
├── supabase/         # Supabase client configuration
└── seed-data.ts      # Sample data

types/
├── database.types.ts # Database schema types
└── index.ts          # Application types
```

### Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Customization

### Adding More Teams or Leagues

Edit `lib/seed-data.ts` to add more matches, odds, and predictions.

### Styling

The platform uses a dark theme by default. Colors are defined in `app/globals.css` and can be customized:

- `--primary` - Primary blue color
- `--success` - Green (positive odds, wins)
- `--danger` - Red (negative odds, losses)
- `--warning` - Amber (draws, cautions)

### Connecting to Real API

Replace the static seed data with real API calls in the `lib/api/` functions. The structure is already set up to fetch from Supabase.

## Troubleshooting

### No matches showing
- Make sure you've seeded the database with sample data
- Check that your Supabase credentials in `.env.local` are correct
- Verify the tables exist in Supabase

### Authentication not working
- Ensure Supabase Auth is enabled in your Supabase project
- Check that email confirmations are disabled (or handle email confirmation flow)
- Verify your Supabase URL and anon key are correct

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript errors with `npm run build`

## Next Steps

1. **Add Real Odds Data**: Integrate with a sports odds API
2. **Implement Favorites**: Add user favorites functionality
3. **Historical Data**: Add charts showing odds movement over time
4. **Push Notifications**: Notify users of match starts or odds changes
5. **More Leagues**: Expand beyond Premier League

## Support

For issues or questions, please check:
- Next.js documentation: https://nextjs.org/docs
- Supabase documentation: https://supabase.com/docs
- Tailwind CSS documentation: https://tailwindcss.com/docs
