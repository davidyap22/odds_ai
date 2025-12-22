-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_chinese TEXT NOT NULL,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2),
  tier TEXT NOT NULL CHECK (tier IN ('basic', 'pro', 'premium')),
  features JSONB NOT NULL,
  max_predictions_per_day INTEGER,
  has_live_odds BOOLEAN DEFAULT false,
  has_advanced_analytics BOOLEAN DEFAULT false,
  has_priority_support BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user subscriptions table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'trial')) DEFAULT 'trial',
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')) DEFAULT 'monthly',
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create payment history table
CREATE TABLE IF NOT EXISTS public.payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_subscription_id UUID NOT NULL REFERENCES public.user_subscriptions(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'MYR',
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, name_chinese, price_monthly, price_yearly, tier, features, max_predictions_per_day, has_live_odds, has_advanced_analytics, has_priority_support)
VALUES
  (
    'Basic',
    'Basic',
    29.90,
    299.00,
    'basic',
    '["10 AI predictions per day", "Basic odds analysis", "3 major leagues", "Email support", "Mobile app access"]'::jsonb,
    10,
    false,
    false,
    false
  ),
  (
    'Pro',
    'Pro',
    79.90,
    799.00,
    'pro',
    '["50 AI predictions per day", "Live odds updates", "All leagues coverage", "Advanced statistics", "Odds history tracking", "Priority support", "Ad-free experience"]'::jsonb,
    50,
    true,
    true,
    false
  ),
  (
    'Premium',
    'Premium',
    199.90,
    1999.00,
    'premium',
    '["Unlimited AI predictions", "Real-time odds updates", "All leagues worldwide", "Advanced AI models", "Custom prediction parameters", "Odds trend alerts", "VIP dedicated support", "API access", "Data export"]'::jsonb,
    NULL,
    true,
    true,
    true
  )
ON CONFLICT DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payment_history_user_subscription_id ON public.payment_history(user_subscription_id);

-- Enable Row Level Security
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_plans (everyone can read active plans)
CREATE POLICY "Anyone can view active subscription plans"
  ON public.subscription_plans FOR SELECT
  USING (is_active = true);

-- RLS Policies for user_subscriptions (users can only see their own)
CREATE POLICY "Users can view own subscription"
  ON public.user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription"
  ON public.user_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON public.user_subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for payment_history (users can only see their own)
CREATE POLICY "Users can view own payment history"
  ON public.payment_history FOR SELECT
  USING (
    user_subscription_id IN (
      SELECT id FROM public.user_subscriptions WHERE user_id = auth.uid()
    )
  );
