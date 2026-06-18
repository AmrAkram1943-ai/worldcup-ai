'use client'

import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LogoutPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)

    await supabase.auth.signOut()

    router.replace('/login')
    router.refresh()
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{
        background:
          'radial-gradient(circle at top, #241b38 0%, #0B0B12 55%)',
      }}
    >
      <div
        style={{
          background: '#171721',
          border: '1px solid rgba(139,92,246,.25)',
          borderRadius: '24px',
          padding: '40px',
          width: '100%',
          maxWidth: '480px',
          textAlign: 'center',
          boxShadow:
            '0 25px 60px rgba(0,0,0,.45)',
        }}
      >
        <div
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            margin: '0 auto',
            background:
              'linear-gradient(135deg,#8B5CF6,#D4AF37)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '42px',
          }}
        >
          👋
        </div>

        <h1
          style={{
            color: '#F8FAFC',
            marginTop: '24px',
            fontSize: '32px',
            fontWeight: 900,
          }}
        >
          Leave Namka?
        </h1>

        <p
          style={{
            color: '#A1A1AA',
            marginTop: '12px',
            lineHeight: 1.8,
          }}
        >
          Your predictions are saved.
          <br />
          Tactical AI will still be waiting for your next challenge.
        </p>

        <button
          onClick={handleLogout}
          disabled={loading}
          style={{
            marginTop: '28px',
            width: '100%',
            padding: '14px',
            borderRadius: '14px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 800,
            fontSize: '15px',
            color: '#fff',
            background:
              'linear-gradient(135deg,#8B5CF6,#D4AF37)',
          }}
        >
          {loading
            ? 'Signing Out...'
            : '🚪 Sign Out'}
        </button>

        <button
          onClick={() => router.back()}
          style={{
            marginTop: '12px',
            width: '100%',
            padding: '14px',
            borderRadius: '14px',
            border: '1px solid rgba(139,92,246,.25)',
            background: '#0B0B12',
            color: '#F8FAFC',
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          ← Stay Here
        </button>
      </div>
    </main>
  )
}