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
          'linear-gradient(135deg,#122b1a 0%,#0f2318 100%)',
        border: '1px solid #22c55e25',
        borderRadius: '16px',
        overflow: 'hidden',
      }}
      className="p-4 hover:border-green-500/40 transition-all duration-300"
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span
            style={{
              background: '#22c55e15',
              color: '#4ade80',
              border: '1px solid #22c55e30',
              borderRadius: '20px',
              padding: '3px 10px',
              fontSize: '11px',
              fontWeight: '700',
            }}
          >
            🏆 {match.round}
          </span>

          {match.group_name && (
            <span
              style={{
                color: '#86efac',
                fontSize: '11px',
              }}
            >
              {match.group_name}
            </span>
          )}
        </div>

        <span
          style={{
            color: '#fbbf24',
            fontSize: '11px',
            fontWeight: '700',
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
            className="w-12 h-12 object-contain"
          />

          <span
            style={{
              color: '#f0fdf4',
            }}
            className="font-bold text-sm text-center mt-2"
          >
            {match.home_team}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <div
            style={{
              color: '#22c55e',
              fontSize: '20px',
              fontWeight: '900',
            }}
          >
            VS
          </div>

          <div
            style={{
              color: '#86efac',
              fontSize: '11px',
              marginTop: '4px',
            }}
          >
            {kickoff.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </div>

          <div
            style={{
              color: '#4ade8080',
              fontSize: '10px',
            }}
          >
            {kickoff.toLocaleTimeString('ar-EG', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>

        <div className="flex flex-col items-center flex-1">
          <img
            src={match.away_flag}
            alt={match.away_team}
            className="w-12 h-12 object-contain"
          />

          <span
            style={{
              color: '#f0fdf4',
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
            marginTop: '14px',
            background: '#14532d30',
            border: '1px solid #22c55e40',
            borderRadius: '10px',
            padding: '10px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              color: '#4ade80',
              fontWeight: '700',
              fontSize: '12px',
            }}
          >
            ✅ You Submitted
          </div>

          <div
            style={{
              color: '#f0fdf4',
              fontSize: '16px',
              fontWeight: '900',
              marginTop: '4px',
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
            marginTop: '14px',
            background: '#0a1a0f',
            border: '1px solid #22c55e20',
            borderRadius: '10px',
            padding: '10px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              color: '#c4b5fd',
              fontSize: '12px',
              fontWeight: '700',
            }}
          >
            🤖 Tactical AI predicts{' '}
            {ai.predicted_home_score}-
            {ai.predicted_away_score}
            {' '}
            ({ai.confidence_pct}%)
          </div>
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