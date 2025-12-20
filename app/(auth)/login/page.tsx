import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Football AI Odds
          </h1>
          <p className="text-text-secondary">
            Sign in to access your dashboard
          </p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-text-primary">Sign In</h2>
          </CardHeader>
          <CardBody>
            <LoginForm />
            <div className="mt-4 text-center">
              <p className="text-sm text-text-secondary">
                Don't have an account?{' '}
                <Link
                  href="/signup"
                  className="text-primary hover:text-primary-hover font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
