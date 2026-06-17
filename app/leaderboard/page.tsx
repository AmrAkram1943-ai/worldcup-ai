import { createSupabaseServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function LeaderboardPage() {
  const supabase = await createSupabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: entries, error } = await supabase
    .from('leaderboard')
    .select(`
      *,
      users (
        full_name,
        email,
        avatar_url,
        is_ai
      )
    `)
    .order('total_points', { ascending: false })

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0a1a0f]">
        <p className="text-red-400">{error.message}</p>
      </main>
    )
  }

  const medals = ['🥇', '🥈', '🥉']

  return (
    <main
      style={{
        background:
          'linear-gradient(to bottom, #07110b, #0a1a0f)',
        minHeight: '100vh',
      }}
    >
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1
            style={{
              color: '#f0fdf4',
              fontSize: '32px',
              fontWeight: 900,
            }}
          >
            🏆 Leaderboard
          </h1>

          <p
            style={{
              color: '#4ade80',
              marginTop: '6px',
              fontSize: '14px',
            }}
          >
            Humans vs Tactical AI
          </p>
        </div>

        <div
          style={{
            background: '#0f2318',
            border: '1px solid #22c55e20',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow:
              '0 10px 40px rgba(0,0,0,.25)',
          }}
        >
          {entries?.map((entry, index) => {
            const userData = Array.isArray(entry.users)
              ? entry.users[0]
              : entry.users

            const isAI = userData?.is_ai

            const isCurrentUser =
              entry.user_id === user.id

            const name = isAI
              ? 'Tactical AI'
              : userData?.full_name ||
                userData?.email ||
                'Unknown User'

            return (
              <div
                key={entry.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '18px 20px',

                  borderBottom:
                    '1px solid #22c55e10',

                  background: isAI
                    ? '#1a0f2e'
                    : isCurrentUser
                    ? '#11291c'
                    : index < 3
                    ? '#101d14'
                    : 'transparent',

                  borderLeft:
                    index === 0
                      ? '4px solid #fbbf24'
                      : index === 1
                      ? '4px solid #cbd5e1'
                      : index === 2
                      ? '4px solid #d97706'
                      : isCurrentUser
                      ? '4px solid #22c55e'
                      : '4px solid transparent',

                  transition: 'all .2s ease',
                }}
              >
                <div
                  style={{
                    minWidth: '40px',
                    textAlign: 'center',
                    fontSize: '22px',
                    fontWeight: 900,
                  }}
                >
                  {medals[index] || `#${index + 1}`}
                </div>

                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    overflow: 'hidden',

                    background: isAI
                      ? '#7c3aed30'
                      : '#22c55e20',

                    border: `1px solid ${
                      isAI
                        ? '#7c3aed60'
                        : '#22c55e40'
                    }`,

                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',

                    flexShrink: 0,
                  }}
                >
                  {userData?.avatar_url && !isAI ? (
                    <img
                      src={userData.avatar_url}
                      alt={name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        fontSize: '20px',
                      }}
                    >
                      {isAI ? '🤖' : '👤'}
                    </span>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        color: isAI
                          ? '#c4b5fd'
                          : isCurrentUser
                          ? '#4ade80'
                          : '#f0fdf4',

                        fontWeight: 700,
                        fontSize: '15px',
                      }}
                    >
                      {name}
                    </span>

                    {isCurrentUser && !isAI && (
                      <span
                        style={{
                          background:
                            '#22c55e20',

                          color: '#4ade80',

                          border:
                            '1px solid #22c55e40',

                          padding:
                            '2px 8px',

                          borderRadius:
                            '999px',

                          fontSize: '10px',

                          fontWeight: 700,
                        }}
                      >
                        YOU
                      </span>
                    )}

                    {isAI && (
                      <span
                        style={{
                          background:
                            '#7c3aed20',

                          color: '#c4b5fd',

                          border:
                            '1px solid #7c3aed40',

                          padding:
                            '2px 8px',

                          borderRadius:
                            '999px',

                          fontSize: '10px',

                          fontWeight: 700,
                        }}
                      >
                        AI
                      </span>
                    )}
                  </div>

                  <p
                    style={{
                      color: '#94a3b8',
                      fontSize: '12px',
                      marginTop: '4px',
                    }}
                  >
                    {entry.matches_predicted}{' '}
                    predictions •{' '}
                    {entry.exact_scores}{' '}
                    exact scores •{' '}
                    {entry.correct_winners}{' '}
                    winners
                  </p>
                </div>

                <div
                  style={{
                    textAlign: 'right',
                  }}
                >
                  <div
                    style={{
                      color: isAI
                        ? '#c4b5fd'
                        : '#fbbf24',

                      fontSize: '26px',
                      fontWeight: 900,
                      lineHeight: 1,
                    }}
                  >
                    {entry.total_points}
                  </div>

                  <div
                    style={{
                      color: '#94a3b8',
                      fontSize: '11px',
                      marginTop: '4px',
                    }}
                  >
                    points
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}