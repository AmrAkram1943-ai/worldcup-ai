import MatchCard from './components/MatchCard'
import { createSupabaseServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: matches, error } = await supabase
    .from('matches')
    .select(`
      *,
      ai_predictions (
        predicted_home_score,
        predicted_away_score,
        confidence_pct,
        analysis
      ),
      user_predictions (
        predicted_home_score,
        predicted_away_score,
        user_id
      )
    `)
    .order('kickoff_time', { ascending: true })

  const { data: userPredictions } = await supabase
    .from('user_predictions')
    .select(`
      *,
      matches (
        home_team,
        away_team,
        home_score,
        away_score,
        status
      )
    `)
    .eq('user_id', user.id)
    .order('submitted_at', { ascending: false })

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0a1a0f]">
        <p className="text-red-400">{error.message}</p>
      </main>
    )
  }

  const formattedMatches =
    matches?.map(match => ({
      ...match,

      ai_predictions: Array.isArray(match.ai_predictions)
        ? match.ai_predictions[0] || null
        : match.ai_predictions,

      user_prediction: Array.isArray(match.user_predictions)
        ? match.user_predictions.find(
            (p: { user_id: string }) => p.user_id === user.id
          ) || null
        : null,
    })) || []

  const now = new Date()

  const next48Hours = formattedMatches.filter(match => {
    const kickoff = new Date(match.kickoff_time)

    const diffHours =
      (kickoff.getTime() - now.getTime()) /
      (1000 * 60 * 60)

    return (
      match.status === 'scheduled' &&
      diffHours >= 0 &&
      diffHours <= 48 &&
      match.home_team !== 'TBD' &&
      match.away_team !== 'TBD'
    )
  })

  const finishedMatches = formattedMatches
    .filter(match => match.status === 'finished')
    .sort(
      (a, b) =>
        new Date(b.kickoff_time).getTime() -
        new Date(a.kickoff_time).getTime()
    )
    .slice(0, 10)

  const recentPredictions =
    userPredictions?.filter(
      prediction =>
        prediction.matches?.status === 'finished'
    ) || []

  return (
    <main
      style={{
        background: '#0a1a0f',
        minHeight: '100vh',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="mb-8">
          <h1
            style={{
              color: '#f0fdf4',
            }}
            className="text-3xl font-black"
          >
            ⚽ World Cup AI
          </h1>

          <p
            style={{
              color: '#4ade80',
            }}
            className="mt-2 text-sm"
          >
            Predict matches and compete against Tactical AI
          </p>
        </div>

        <div className="mb-10">
          <h2
            style={{
              color: '#f0fdf4',
            }}
            className="text-xl font-bold mb-4"
          >
            🔥 Next 48 Hours
          </h2>

          {next48Hours.length === 0 ? (
            <div
              style={{
                background: '#0f2318',
                border: '1px solid #22c55e20',
                borderRadius: '16px',
                padding: '20px',
              }}
            >
              <p style={{ color: '#86efac' }}>
                No matches in the next 48 hours.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {next48Hours.map(match => (
                <MatchCard
                  key={match.id}
                  match={match}
                />
              ))}
            </div>
          )}
        </div>

        {recentPredictions.length > 0 && (
          <div className="mt-12">
            <h2
              style={{
                color: '#f0fdf4',
              }}
              className="text-xl font-bold mb-4"
            >
              📊 Your Previous Results
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recentPredictions
                .slice(0, 10)
                .map(prediction => {
                  const points =
                    prediction.points_earned || 0

                  return (
                    <div
                      key={prediction.id}
                      style={{
                        background: '#0f2318',
                        border:
                          '1px solid #22c55e20',
                        borderRadius: '14px',
                        padding: '14px',
                      }}
                    >
                      <div
                        style={{
                          color: '#f0fdf4',
                          fontWeight: 700,
                        }}
                      >
                        {
                          prediction.matches
                            .home_team
                        }{' '}
                        {
                          prediction.matches
                            .home_score
                        }
                        {' - '}
                        {
                          prediction.matches
                            .away_score
                        }{' '}
                        {
                          prediction.matches
                            .away_team
                        }
                      </div>

                      <div
                        style={{
                          color: '#86efac',
                          fontSize: '13px',
                          marginTop: '6px',
                        }}
                      >
                        Your Prediction:{' '}
                        {
                          prediction.predicted_home_score
                        }
                        {' - '}
                        {
                          prediction.predicted_away_score
                        }
                      </div>

                      <div
                        style={{
                          marginTop: '8px',
                          fontWeight: 800,
                          color:
                            points === 8
                              ? '#22c55e'
                              : points === 3
                              ? '#fbbf24'
                              : '#ef4444',
                        }}
                      >
                        +{points} pts
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        )}

        {finishedMatches.length > 0 && (
          <div className="mt-12">
            <h2
              style={{
                color: '#f0fdf4',
              }}
              className="text-xl font-bold mb-4"
            >
              🏁 Recent Finished Matches
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {finishedMatches.map(match => (
                <div
                  key={match.id}
                  style={{
                    background: '#0f2318',
                    border:
                      '1px solid #22c55e20',
                    borderRadius: '14px',
                    padding: '14px',
                  }}
                >
                  <div
                    style={{
                      color: '#f0fdf4',
                      fontWeight: 700,
                    }}
                  >
                    {match.home_team}
                    {' '}
                    {match.home_score}
                    {' - '}
                    {match.away_score}
                    {' '}
                    {match.away_team}
                  </div>

                  <div
                    style={{
                      color: '#86efac',
                      fontSize: '12px',
                      marginTop: '6px',
                    }}
                  >
                    {match.round}
                    {match.group_name
                      ? ` • ${match.group_name}`
                      : ''}
                  </div>

                  <div
                    style={{
                      marginTop: '8px',
                      color: '#fbbf24',
                      fontWeight: 700,
                      fontSize: '12px',
                    }}
                  >
                    Finished
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  )
}