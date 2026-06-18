import PredictionForm from './PredictionForm'

type AIPrediction = {
  predicted_home_score: number
  predicted_away_score: number
  confidence_pct: number
  analysis: string
}

type Match = {
  id: string
  home_team: string
  away_team: string
  home_flag: string
  away_flag: string
  kickoff_time: string
  round: string
  group_name: string
  stadium: string
  status: string
  ai_predictions: AIPrediction | null
  user_prediction?: {
    predicted_home_score: number
    predicted_away_score: number
  } | null
}

export default function MatchCard({
  match,
}: {
  match: Match
}) {
  const kickoff = new Date(match.kickoff_time)
  const ai = match.ai_predictions

  const now = new Date()

  const diff =
    kickoff.getTime() - now.getTime()

  const hours = Math.max(
    0,
    Math.floor(diff / (1000 * 60 * 60))
  )

  const minutes = Math.max(
    0,
    Math.floor(
      (diff % (1000 * 60 * 60)) /
        (1000 * 60)
    )
  )

  return (
    <div
      style={{
        background:
          'linear-gradient(135deg,#171721 0%,#101018 100%)',
        border:
          '1px solid rgba(139,92,246,.25)',
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow:
          '0 10px 30px rgba(0,0,0,.25)',
      }}
      className="p-5 transition-all duration-300 hover:scale-[1.01]"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            style={{
              background:
                'rgba(212,175,55,.12)',
              color: '#D4AF37',
              border:
                '1px solid rgba(212,175,55,.25)',
              borderRadius: '20px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: '800',
            }}
          >
            🏆 {match.round}
          </span>

          {match.group_name && (
            <span
              style={{
                color: '#A78BFA',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              {match.group_name}
            </span>
          )}
        </div>

        <span
          style={{
            color: '#D4AF37',
            fontSize: '11px',
            fontWeight: '800',
          }}
        >
          ⏳ {hours}h {minutes}m
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col items-center flex-1">
          <img
            src={match.home_flag}
            alt={match.home_team}
            className="w-14 h-14 object-contain"
          />

          <span
            style={{
              color: '#F8FAFC',
            }}
            className="font-bold text-sm text-center mt-2"
          >
            {match.home_team}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <div
            style={{
              color: '#D4AF37',
              fontSize: '24px',
              fontWeight: '900',
            }}
          >
            VS
          </div>

          <div
            style={{
              color: '#A78BFA',
              fontSize: '11px',
              marginTop: '4px',
            }}
          >
            {kickoff.toLocaleDateString(
              'en-US',
              {
                month: 'short',
                day: 'numeric',
              }
            )}
          </div>

          <div
            style={{
              color: '#A1A1AA',
              fontSize: '10px',
            }}
          >
            {kickoff.toLocaleTimeString(
              'ar-EG',
              {
                hour: '2-digit',
                minute: '2-digit',
              }
            )}
          </div>
        </div>

        <div className="flex flex-col items-center flex-1">
          <img
            src={match.away_flag}
            alt={match.away_team}
            className="w-14 h-14 object-contain"
          />

          <span
            style={{
              color: '#F8FAFC',
            }}
            className="font-bold text-sm text-center mt-2"
          >
            {match.away_team}
          </span>
        </div>
      </div>

      {match.user_prediction && (
        <div
          style={{
            marginTop: '16px',
            background:
              'rgba(139,92,246,.10)',
            border:
              '1px solid rgba(139,92,246,.25)',
            borderRadius: '12px',
            padding: '12px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              color: '#A78BFA',
              fontWeight: '800',
              fontSize: '12px',
            }}
          >
            ✅ Your Prediction
          </div>

          <div
            style={{
              color: '#F8FAFC',
              fontSize: '20px',
              fontWeight: '900',
              marginTop: '6px',
            }}
          >
            {match.user_prediction.predicted_home_score}
            {' - '}
            {match.user_prediction.predicted_away_score}
          </div>
        </div>
      )}

      {ai && (
        <div
          style={{
            marginTop: '16px',
            background: '#0B0B12',
            border:
              '1px solid rgba(139,92,246,.20)',
            borderRadius: '12px',
            padding: '14px',
          }}
        >
          <div
            style={{
              color: '#D4AF37',
              fontWeight: '800',
              textAlign: 'center',
              fontSize: '13px',
            }}
          >
            🤖 Tactical AI Prediction
          </div>

          <div
            style={{
              color: '#F8FAFC',
              fontSize: '22px',
              fontWeight: '900',
              textAlign: 'center',
              marginTop: '8px',
            }}
          >
            {ai.predicted_home_score}
            {' - '}
            {ai.predicted_away_score}
          </div>

          <div
            style={{
              color: '#A78BFA',
              textAlign: 'center',
              fontSize: '12px',
              marginTop: '6px',
            }}
          >
            Confidence: {ai.confidence_pct}%
          </div>

          <div
            style={{
              height: '8px',
              background:
                'rgba(255,255,255,.08)',
              borderRadius: '999px',
              marginTop: '10px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${ai.confidence_pct}%`,
                height: '100%',
                background:
                  'linear-gradient(90deg,#D4AF37,#FCD34D)',
              }}
            />
          </div>

          <details
            style={{
              marginTop: '14px',
            }}
          >
            <summary
              style={{
                cursor: 'pointer',
                color: '#D4AF37',
                fontWeight: 700,
                fontSize: '13px',
              }}
            >
              🧠 AI Analysis
            </summary>

            <p
              style={{
                color: '#A1A1AA',
                fontSize: '13px',
                lineHeight: '1.8',
                marginTop: '12px',
              }}
            >
              {ai.analysis}
            </p>
          </details>
        </div>
      )}

      <PredictionForm
        matchId={match.id}
        homeTeam={match.home_team}
        awayTeam={match.away_team}
        homeFlag={match.home_flag}
        awayFlag={match.away_flag}
        kickoffTime={match.kickoff_time}
        existingPrediction={match.user_prediction}
      />
    </div>
  )
}