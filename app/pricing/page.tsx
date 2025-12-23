'use client'

import { useState, useEffect } from 'react'
import { SubscriptionPlan } from '@/lib/api/subscriptions'
import { PricingCard } from '@/components/pricing/PricingCard'

// Demo subscription plans
const demoPlans: SubscriptionPlan[] = [
  {
    id: 'basic-plan',
    name: 'Basic',
    name_chinese: '基础版',
    price_monthly: 29.90,
    price_yearly: 299.00,
    tier: 'basic',
    features: [
      'AI-powered match predictions',
      '10 predictions per day',
      'Basic odds analysis',
      'Match history tracking',
      'Email support',
      'Access to all leagues'
    ],
    max_predictions_per_day: 10,
    has_live_odds: false,
    has_advanced_analytics: false,
    has_priority_support: false,
    is_active: true
  },
  {
    id: 'pro-plan',
    name: 'Pro',
    name_chinese: '专业版',
    price_monthly: 79.90,
    price_yearly: 799.00,
    tier: 'pro',
    features: [
      'Everything in Basic, plus:',
      '50 predictions per day',
      'Advanced AI analytics',
      'Live odds updates',
      'Historical performance tracking',
      'Profit/Loss analysis',
      'Priority email support',
      'Custom alerts & notifications'
    ],
    max_predictions_per_day: 50,
    has_live_odds: true,
    has_advanced_analytics: true,
    has_priority_support: false,
    is_active: true
  },
  {
    id: 'premium-plan',
    name: 'Premium',
    name_chinese: '高级版',
    price_monthly: 149.90,
    price_yearly: 1499.00,
    tier: 'premium',
    features: [
      'Everything in Pro, plus:',
      'Unlimited predictions',
      'Advanced statistical models',
      'Real-time live scores',
      'Exclusive betting insights',
      'API access for developers',
      'Dedicated account manager',
      'Priority 24/7 support',
      'Early access to new features'
    ],
    max_predictions_per_day: null,
    has_live_odds: true,
    has_advanced_analytics: true,
    has_priority_support: true,
    is_active: true
  }
]

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Get AI-powered football odds analysis and predictions to boost your betting success
          </p>
        </div>

        {/* Pricing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-surface border border-border rounded-lg p-1 flex gap-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Yearly <span className="text-success text-sm ml-1">(Save 17%)</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {demoPlans.map((plan, index) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isPopular={index === 1}
              billingCycle={billingCycle}
            />
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="bg-surface border border-border rounded-lg p-6 group">
              <summary className="font-semibold text-text-primary cursor-pointer list-none flex items-center justify-between">
                <span>Can I cancel my subscription anytime?</span>
                <span className="text-primary">+</span>
              </summary>
              <p className="mt-4 text-text-secondary">
                Yes, you can cancel your subscription at any time. After cancellation, you'll still have access until the end of your current billing period.
              </p>
            </details>

            <details className="bg-surface border border-border rounded-lg p-6 group">
              <summary className="font-semibold text-text-primary cursor-pointer list-none flex items-center justify-between">
                <span>What payment methods do you accept?</span>
                <span className="text-primary">+</span>
              </summary>
              <p className="mt-4 text-text-secondary">
                We accept credit cards, debit cards, online banking, and various other payment methods.
              </p>
            </details>

            <details className="bg-surface border border-border rounded-lg p-6 group">
              <summary className="font-semibold text-text-primary cursor-pointer list-none flex items-center justify-between">
                <span>Can I upgrade or downgrade my plan?</span>
                <span className="text-primary">+</span>
              </summary>
              <p className="mt-4 text-text-secondary">
                Absolutely! You can upgrade to a higher tier at any time. Downgrades will take effect at the end of your current billing cycle.
              </p>
            </details>

            <details className="bg-surface border border-border rounded-lg p-6 group">
              <summary className="font-semibold text-text-primary cursor-pointer list-none flex items-center justify-between">
                <span>How accurate are the AI predictions?</span>
                <span className="text-primary">+</span>
              </summary>
              <p className="mt-4 text-text-secondary">
                Our AI models are trained on millions of match data points with historical accuracy between 65-75%. However, sports betting carries risks, so please bet responsibly.
              </p>
            </details>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <div className="flex justify-center items-center gap-8 flex-wrap opacity-50">
            <div className="text-text-secondary">🔒 Secure Payment</div>
            <div className="text-text-secondary">✓ 7-Day Money Back</div>
            <div className="text-text-secondary">📱 Access Anywhere</div>
            <div className="text-text-secondary">🏆 Trusted by Thousands</div>
          </div>
        </div>
      </div>
    </div>
  )
}
