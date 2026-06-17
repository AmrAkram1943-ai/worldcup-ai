'use client'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const supabase = createClient()

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <button
        onClick={signInWithGoogle}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg"
      >
        Sign in with Google
      </button>
    </div>
  )
}