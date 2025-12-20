import Link from 'next/link'
import { SignupForm } from '@/components/auth/SignupForm'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Football AI Odds
          </h1>
          <p className="text-text-secondary">
            Create an account to get started
          </p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-text-primary">Create Account</h2>
          </CardHeader>
          <CardBody>
            <SignupForm />
            <div className="mt-4 text-center">
              <p className="text-sm text-text-secondary">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-primary hover:text-primary-hover font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
