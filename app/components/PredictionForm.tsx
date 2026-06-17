'use client'
import { useState } from 'react'
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

  const isLocked =
    new Date() >= new Date(kickoffTime)

  async function handleSubmit() {
    setLoading(true)
    setError('')

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
      const { error: dbError } =
        await supabase
          .from('user_predictions')
          .upsert(
            {
              user_id: user.id,
              match_id: matchId,
              predicted_home_score:
                homeScore,
              predicted_away_score:
                awayScore,
            },
            {
              onConflict:
                'user_id,match_id',
            }
          )

      if (dbError) {
        setError(dbError.message)
      } else {
        setSubmitted(true)
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
          marginTop: '12px',
          padding: '10px',
          background: '#1a0a0a',
          border:
            '1px solid #ef444440',
          borderRadius: '10px',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            color: '#f87171',
            fontSize: '12px',
            fontWeight: '600',
          }}
        >
          🔒 Predictions Closed
        </span>
      </div>
    )
  }

  const btnStyle = {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: '#0a1a0f',
    border: '1px solid #22c55e40',
    color: '#22c55e',
    fontWeight: '700',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  return (
    <div
      style={{
        marginTop: '12px',
        paddingTop: '12px',
        borderTop:
          '1px solid #22c55e15',
      }}
    >
      <div className="flex items-center justify-center gap-8">

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <img
              src={homeFlag}
              alt={homeTeam}
              className="w-4 h-4 object-contain"
            />

            <span
              style={{
                color: '#86efac',
                fontSize: '11px',
              }}
            >
              {homeTeam}
            </span>
          </div>

          <div className="flex items-center gap-2">
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
                color: '#f0fdf4',
                fontSize: '22px',
                fontWeight: '900',
                minWidth: '24px',
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
            color: '#22c55e60',
            fontSize: '18px',
            fontWeight: '900',
          }}
        >
          –
        </span>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <img
              src={awayFlag}
              alt={awayTeam}
              className="w-4 h-4 object-contain"
            />

            <span
              style={{
                color: '#86efac',
                fontSize: '11px',
              }}
            >
              {awayTeam}
            </span>
          </div>

          <div className="flex items-center gap-2">
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
                color: '#f0fdf4',
                fontSize: '22px',
                fontWeight: '900',
                minWidth: '24px',
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
            color: '#f87171',
            fontSize: '12px',
            textAlign: 'center',
            marginTop: '8px',
          }}
        >
          {error}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          marginTop: '12px',
          width: '100%',
          background:
            loading
              ? '#14532d'
              : 'linear-gradient(135deg,#16a34a,#22c55e)',
          color: '#f0fdf4',
          fontWeight: '700',
          padding: '10px',
          borderRadius: '10px',
          border: 'none',
          fontSize: '13px',
          cursor: loading
            ? 'not-allowed'
            : 'pointer',
        }}
      >
        {loading
          ? 'Saving...'
          : existingPrediction
          ? '✏️ Update Prediction'
          : '⚡ Submit Prediction'}
      </button>
    </div>
  )
}