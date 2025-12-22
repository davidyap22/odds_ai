import { createClient } from '@/lib/supabase/server'

export interface SubscriptionPlan {
  id: string
  name: string
  name_chinese: string
  price_monthly: number
  price_yearly: number | null
  tier: 'basic' | 'pro' | 'premium'
  features: string[]
  max_predictions_per_day: number | null
  has_live_odds: boolean
  has_advanced_analytics: boolean
  has_priority_support: boolean
  is_active: boolean
}

export interface UserSubscription {
  id: string
  user_id: string
  plan_id: string
  status: 'active' | 'cancelled' | 'expired' | 'trial'
  billing_cycle: 'monthly' | 'yearly'
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  trial_ends_at: string | null
  plan?: SubscriptionPlan
}

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('is_active', true)
    .order('price_monthly', { ascending: true })

  if (error) {
    console.error('Error fetching subscription plans:', error)
    return []
  }

  return data || []
}

export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('user_subscriptions')
    .select(`
      *,
      plan:subscription_plans(*)
    `)
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching user subscription:', error)
    return null
  }

  return data as any
}

export async function createUserSubscription(
  userId: string,
  planId: string,
  billingCycle: 'monthly' | 'yearly'
): Promise<UserSubscription | null> {
  const supabase = await createClient()

  // Calculate period end (30 days for monthly, 365 days for yearly)
  const periodStart = new Date()
  const periodEnd = new Date()
  periodEnd.setDate(periodEnd.getDate() + (billingCycle === 'monthly' ? 30 : 365))

  const { data, error } = await supabase
    .from('user_subscriptions')
    .insert({
      user_id: userId,
      plan_id: planId,
      billing_cycle: billingCycle,
      status: 'active',
      current_period_start: periodStart.toISOString(),
      current_period_end: periodEnd.toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating subscription:', error)
    return null
  }

  return data as any
}
