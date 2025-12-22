import { getSubscriptionPlans } from '@/lib/api/subscriptions'
import { PricingCard } from '@/components/pricing/PricingCard'
import { createClient } from '@/lib/supabase/server'

export default async function PricingPage() {
  const plans = await getSubscriptionPlans()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

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
            <button className="px-6 py-2 rounded-lg bg-primary text-white font-semibold transition-all">
              Monthly
            </button>
            <button className="px-6 py-2 rounded-lg text-text-secondary hover:text-text-primary font-semibold transition-all">
              Yearly <span className="text-success text-sm ml-1">(Save 17%)</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards or Setup Message */}
        {plans.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan, index) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                isPopular={index === 1}
                userId={user?.id}
              />
            ))}
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-lg p-12 text-center mb-12">
            <div className="text-6xl mb-4">⚙️</div>
            <h3 className="text-xl font-bold text-text-primary mb-4">
              Subscription Plans Setup Required
            </h3>
            <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
              Please execute the SQL migration file in Supabase to create subscription plans.
            </p>
            <div className="bg-background border border-border rounded-lg p-6 text-left max-w-3xl mx-auto">
              <p className="text-sm font-semibold text-text-primary mb-3">Steps:</p>
              <ol className="text-sm text-text-secondary space-y-2 list-decimal list-inside">
                <li>Go to <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Supabase Dashboard</a></li>
                <li>Select your project</li>
                <li>Click on <strong className="text-text-primary">SQL Editor</strong> in the left menu</li>
                <li>Click <strong className="text-text-primary">New Query</strong></li>
                <li>Copy the contents of <code className="text-primary bg-background px-2 py-1 rounded">supabase/migrations/create_subscriptions.sql</code></li>
                <li>Paste and click <strong className="text-text-primary">Run</strong></li>
                <li>Refresh this page</li>
              </ol>
            </div>
          </div>
        )}

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
