'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

type Props = {
  matchId: string
  homeTeam: string
  awayTeam: string
  homeFlag: string
  awayFlag: string
  kickoffTime: string

  existingPrediction?: {
    predicted_home_score: number
    predicted_away_score: number
  } | null
}

export default function PredictionForm({
  matchId,
  homeTeam,
  awayTeam,
  homeFlag,
  awayFlag,
  kickoffTime,
  existingPrediction,
}: Props) {
  const router = useRouter()

  const [homeScore, setHomeScore] = useState(
    existingPrediction?.predicted_home_score ?? 0
  )

  const [awayScore, setAwayScore] = useState(
    existingPrediction?.predicted_away_score ?? 0
  )

  const [loading, setLoading] = useState(false)

  const [submitted, setSubmitted] = useState(
    !!existingPrediction
  )

  const [error, setError] = useState('')

  const [success, setSuccess] = useState('')

  const isLocked =
    new Date() >= new Date(kickoffTime)

  async function handleSubmit() {
    setLoading(true)
    setError('')
    setSuccess('')

    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('Not logged in')
      setLoading(false)
      return
    }

    try {
      const wasUpdate = submitted

      const { error: dbError } =
        await supabase
          .from('user_predictions')
          .upsert(
            {
              user_id: user.id,
              match_id: matchId,
              predicted_home_score: homeScore,
              predicted_away_score: awayScore,
            },
            {
              onConflict: 'user_id,match_id',
            }
          )

      if (dbError) {
        setError(dbError.message)
      } else {
        setSubmitted(true)

        setSuccess(
          wasUpdate
            ? 'Prediction updated successfully ✅'
            : 'Prediction submitted successfully ✅'
        )

        router.refresh()
      }
    } catch {
      setError('Network error')
    }

    setLoading(false)
  }

  if (isLocked) {
    return (
      <div
        style={{
          marginTop: '16px',
          padding: '12px',
          background:
            'rgba(212,175,55,.08)',
          border:
            '1px solid rgba(212,175,55,.25)',
          borderRadius: '12px',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            color: '#D4AF37',
            fontSize: '13px',
            fontWeight: '700',
          }}
        >
          🔒 Predictions Closed
        </span>
      </div>
    )
  }

  const btnStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: '#171721',
    border:
      '1px solid rgba(139,92,246,.35)',
    color: '#D4AF37',
    fontWeight: '900',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all .2s ease',
  }

  return (
    <div
      style={{
        marginTop: '16px',
        paddingTop: '16px',
        borderTop:
          '1px solid rgba(139,92,246,.15)',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          marginBottom: '16px',
          color: '#D4AF37',
          fontWeight: 800,
          fontSize: '13px',
          letterSpacing: '.5px',
        }}
      >
        🎯 Your Match Prediction
      </div>

      <div className="flex items-center justify-center gap-10">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-3">
            <img
              src={homeFlag}
              alt={homeTeam}
              className="w-5 h-5 object-contain"
            />

            <span
              style={{
                color: '#A78BFA',
                fontSize: '12px',
                fontWeight: '700',
              }}
            >
              {homeTeam}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              style={btnStyle}
              onClick={() =>
                setHomeScore(s =>
                  Math.max(0, s - 1)
                )
              }
            >
              −
            </button>

            <span
              style={{
                color: '#F8FAFC',
                fontSize: '28px',
                fontWeight: '900',
                minWidth: '30px',
                textAlign: 'center',
              }}
            >
              {homeScore}
            </span>

            <button
              style={btnStyle}
              onClick={() =>
                setHomeScore(s => s + 1)
              }
            >
              +
            </button>
          </div>
        </div>

        <span
          style={{
            color: '#D4AF37',
            fontSize: '24px',
            fontWeight: '900',
          }}
        >
          :
        </span>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-3">
            <img
              src={awayFlag}
              alt={awayTeam}
              className="w-5 h-5 object-contain"
            />

            <span
              style={{
                color: '#A78BFA',
                fontSize: '12px',
                fontWeight: '700',
              }}
            >
              {awayTeam}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              style={btnStyle}
              onClick={() =>
                setAwayScore(s =>
                  Math.max(0, s - 1)
                )
              }
            >
              −
            </button>

            <span
              style={{
                color: '#F8FAFC',
                fontSize: '28px',
                fontWeight: '900',
                minWidth: '30px',
                textAlign: 'center',
              }}
            >
              {awayScore}
            </span>

            <button
              style={btnStyle}
              onClick={() =>
                setAwayScore(s => s + 1)
              }
            >
              +
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p
          style={{
            color: '#EF4444',
            fontSize: '12px',
            textAlign: 'center',
            marginTop: '12px',
          }}
        >
          {error}
        </p>
      )}

      {success && (
        <p
          style={{
            color: '#D4AF37',
            fontSize: '12px',
            textAlign: 'center',
            marginTop: '12px',
            fontWeight: '700',
          }}
        >
          {success}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          marginTop: '18px',
          width: '100%',
          background: loading
            ? '#27272A'
            : 'linear-gradient(135deg,#8B5CF6,#D4AF37)',
          color: '#FFFFFF',
          fontWeight: '800',
          padding: '12px',
          borderRadius: '12px',
          border: 'none',
          fontSize: '14px',
          cursor: loading
            ? 'not-allowed'
            : 'pointer',
          boxShadow:
            '0 8px 20px rgba(139,92,246,.25)',
        }}
      >
        {loading
          ? 'Saving...'
          : submitted
          ? '🔄 Update Prediction'
          : '⚡ Submit Prediction'}
      </button>
    </div>
  )
}
