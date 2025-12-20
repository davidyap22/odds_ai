export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-text-primary mb-3">Football AI Odds</h3>
            <p className="text-sm text-text-secondary">
              Advanced AI-powered football odds analysis and predictions for the Premier League.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-text-primary mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-text-secondary hover:text-text-primary transition-colors">
                  Live Matches
                </a>
              </li>
              <li>
                <a href="/#upcoming" className="text-text-secondary hover:text-text-primary transition-colors">
                  Upcoming Matches
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-text-secondary hover:text-text-primary transition-colors">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text-primary mb-3">Disclaimer</h4>
            <p className="text-xs text-text-secondary">
              This platform provides AI-generated predictions for informational purposes only.
              Gambling involves risk. Please bet responsibly.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-text-secondary">
            © {new Date().getFullYear()} Football AI Odds. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
