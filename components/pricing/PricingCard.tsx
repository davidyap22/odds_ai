'use client'

import { useState } from 'react'
import { SubscriptionPlan } from '@/lib/api/subscriptions'
import { Card, CardBody } from '@/components/ui/Card'

interface PricingCardProps {
  plan: SubscriptionPlan
  isPopular?: boolean
  userId?: string
}

const tierColors = {
  basic: {
    gradient: 'from-blue-500 to-cyan-600',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    button: 'bg-blue-500 hover:bg-blue-600',
    glow: 'shadow-blue-500/20'
  },
  pro: {
    gradient: 'from-purple-500 to-pink-600',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    button: 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700',
    glow: 'shadow-purple-500/30'
  },
  premium: {
    gradient: 'from-amber-500 to-orange-600',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    button: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700',
    glow: 'shadow-amber-500/30'
  }
}

const tierIcons = {
  basic: '⚽',
  pro: '🏆',
  premium: '👑'
}

export function PricingCard({ plan, isPopular = false, userId }: PricingCardProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const colors = tierColors[plan.tier]
  const icon = tierIcons[plan.tier]

  const price = billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly || plan.price_monthly
  const yearlyDiscount = plan.price_yearly
    ? Math.round((1 - (plan.price_yearly / 12) / plan.price_monthly) * 100)
    : 0

  const handleSubscribe = async () => {
    if (!userId) {
      window.location.href = '/login?redirect=/pricing'
      return
    }

    // TODO: Implement payment flow
    alert(`Subscribe to ${plan.name} - ${billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}`)
  }

  return (
    <Card
      className={`relative overflow-hidden transition-all hover:scale-105 ${
        isPopular
          ? `border-2 border-primary ${colors.glow} shadow-xl`
          : 'border border-border'
      }`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-1 text-xs font-bold rounded-bl-lg">
          MOST POPULAR 🔥
        </div>
      )}

      {/* Gradient Header */}
      <div className={`h-2 bg-gradient-to-r ${colors.gradient}`} />

      <CardBody className="p-8">
        {/* Plan Icon & Name */}
        <div className="flex items-center gap-3 mb-4">
          <div className="text-4xl">{icon}</div>
          <div>
            <h3 className="text-2xl font-bold text-text-primary">{plan.name}</h3>
            <p className="text-sm text-text-secondary">Perfect for {plan.tier} users</p>
          </div>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-text-primary">
              RM {price.toFixed(2)}
            </span>
            <span className="text-text-secondary">
              /{billingCycle === 'monthly' ? 'mo' : 'yr'}
            </span>
          </div>
          {billingCycle === 'yearly' && yearlyDiscount > 0 && (
            <p className="text-sm text-success mt-1">
              Save {yearlyDiscount}% with yearly billing
            </p>
          )}
        </div>

        {/* Predictions Limit Badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-6 ${colors.badge}`}>
          <span className="text-sm font-semibold">
            {plan.max_predictions_per_day
              ? `${plan.max_predictions_per_day} predictions/day`
              : 'Unlimited predictions ∞'}
          </span>
        </div>

        {/* Features List */}
        <div className="space-y-3 mb-8">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="mt-1 text-success">✓</div>
              <span className="text-sm text-text-secondary">{feature}</span>
            </div>
          ))}
        </div>

        {/* Subscribe Button */}
        <button
          onClick={handleSubscribe}
          className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-all ${colors.button} shadow-lg hover:shadow-xl`}
        >
          {userId ? 'Subscribe Now' : 'Login to Subscribe'}
        </button>

        {/* Additional Info */}
        <p className="text-xs text-text-secondary text-center mt-4">
          Cancel anytime • Secure payment
        </p>
      </CardBody>
    </Card>
  )
}
