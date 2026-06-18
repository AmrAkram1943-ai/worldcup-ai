'use client'

import Image from 'next/image'
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
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{
        background:
          'radial-gradient(circle at top, #241b38 0%, #0b0b12 55%)',
      }}
    >
      <div
        style={{
          background: '#171721',
          border: '1px solid rgba(139,92,246,.25)',
          borderRadius: '24px',
          padding: '48px 32px',
          width: '100%',
          maxWidth: '460px',
          textAlign: 'center',
          boxShadow:
            '0 25px 60px rgba(0,0,0,.45)',
        }}
      >
        <div className="flex items-center justify-center gap-4 mb-5">
          <Image
            src="/Namka_Logo_Transparent.png"
            alt="NAMKA Logo"
            width={120}
            height={120}
            priority
          />

          <div
            style={{
              fontSize: '34px',
              color: '#D4AF37',
              fontWeight: 900,
            }}
          >
            ×
          </div>

          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background:
                'linear-gradient(135deg,#8B5CF6,#D4AF37)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '42px',
              boxShadow:
                '0 0 30px rgba(139,92,246,.35)',
            }}
          >
            🏆
          </div>
        </div>

        <h1
          style={{
            color: '#f8fafc',
            fontSize: '40px',
            fontWeight: 900,
            letterSpacing: '.05em',
          }}
        >
          NAMKA
        </h1>

        <p
          style={{
            color: '#d4af37',
            fontWeight: 700,
            marginTop: '6px',
            fontSize: '15px',
            letterSpacing: '.08em',
          }}
        >
          WORLD CUP CHALLENGE
        </p>

        <p
          style={{
            color: '#a1a1aa',
            marginTop: '20px',
            lineHeight: 1.8,
            fontSize: '14px',
          }}
        >
          Compete against Tactical AI,
          predict World Cup matches,
          and climb the leaderboard.
        </p>

        <button
          onClick={signInWithGoogle}
          style={{
            marginTop: '32px',
            width: '100%',
            padding: '15px',
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
          Continue with Google
        </button>

        <p
          style={{
            marginTop: '18px',
            color: '#71717a',
            fontSize: '12px',
          }}
        >
          Humans vs Tactical AI
        </p>
      </div>
    </main>
  )
}