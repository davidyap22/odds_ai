'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 rounded-lg bg-surface border border-border text-text-primary text-sm font-medium hover:bg-surface-hover hover:border-border-hover transition-all"
    >
      Sign Out
    </button>
  )
}
