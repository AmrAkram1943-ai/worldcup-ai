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
.select(`       *,
      users (
        full_name,
        email,
        avatar_url,
        is_ai
      )
    `)
.order('total_points', { ascending: false })

if (error) {
return ( <main className="min-h-screen flex items-center justify-center bg-[#0B0B12]"> <p className="text-red-400">{error.message}</p> </main>
)
}

const medals = ['🥇', '🥈', '🥉']

return (
<main
style={{
background:
'radial-gradient(circle at top, #241b38 0%, #0B0B12 60%)',
minHeight: '100vh',
}}
> <div className="max-w-4xl mx-auto px-4 py-8">

    <div
      style={{
        background:
          'linear-gradient(135deg, rgba(139,92,246,.15), rgba(212,175,55,.15))',
        border: '1px solid rgba(139,92,246,.25)',
        borderRadius: '24px',
        padding: '28px',
        marginBottom: '28px',
      }}
    >
      <h1
        style={{
          color: '#F8FAFC',
          fontSize: '36px',
          fontWeight: 900,
        }}
      >
        🏆 Leaderboard
      </h1>

      <p
        style={{
          color: '#D4AF37',
          marginTop: '8px',
          fontSize: '14px',
          fontWeight: 700,
          letterSpacing: '.08em',
        }}
      >
        HUMANS VS TACTICAL AI
      </p>
    </div>

    <div
      style={{
        background: '#171721',
        border: '1px solid rgba(139,92,246,.25)',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow:
          '0 20px 50px rgba(0,0,0,.35)',
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
              padding: '20px',

              borderBottom:
                '1px solid rgba(139,92,246,.10)',

              background: isCurrentUser
                ? 'rgba(139,92,246,.12)'
                : isAI
                ? 'rgba(139,92,246,.08)'
                : 'transparent',

              borderLeft:
                index === 0
                  ? '4px solid #D4AF37'
                  : index === 1
                  ? '4px solid #E5E7EB'
                  : index === 2
                  ? '4px solid #CD7F32'
                  : isCurrentUser
                  ? '4px solid #8B5CF6'
                  : '4px solid transparent',


                  boxShadow:
                  index === 0
                  ? '0 0 25px rgba(212,175,55,.25)'
                  : 'none',
            }}
          >
            <div
              style={{
                minWidth: '42px',
                textAlign: 'center',
                fontSize: '24px',
                fontWeight: 900,
                color: '#F8FAFC',
              }}
            >
              {medals[index] || `#${index + 1}`}
            </div>

            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                overflow: 'hidden',

                background: isAI
                  ? 'rgba(139,92,246,.15)'
                  : 'rgba(212,175,55,.12)',

                border: `2px solid ${
                  isAI
                    ? '#8B5CF6'
                    : '#D4AF37'
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
                    fontSize: '22px',
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
                    color: '#F8FAFC',
                    fontWeight: 800,
                    fontSize: '15px',
                  }}
                >
                  {name}
                </span>

                {isCurrentUser && !isAI && (
                  <span
                    style={{
                      background:
                        'rgba(212,175,55,.12)',
                      color: '#D4AF37',
                      border:
                        '1px solid rgba(212,175,55,.35)',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      fontSize: '10px',
                      fontWeight: 800,
                    }}
                  >
                    YOU
                  </span>
                )}

                {isAI && (
                  <span
                    style={{
                      background:
                        'rgba(139,92,246,.15)',
                      color: '#A78BFA',
                      border:
                        '1px solid rgba(139,92,246,.35)',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      fontSize: '10px',
                      fontWeight: 800,
                    }}
                  >
                    AI
                  </span>
                )}
              </div>

              <p
                style={{
                  color: '#A1A1AA',
                  fontSize: '12px',
                  marginTop: '4px',
                }}
              >
                {entry.matches_predicted} predictions •{' '}
                {entry.exact_scores} exact scores •{' '}
                {entry.correct_winners} winners
              </p>
            </div>

            <div
              style={{
                textAlign: 'right',
              }}
            >
              <div
                style={{
                  color: index === 0
                    ? '#D4AF37'
                    : isAI
                    ? '#A78BFA'
                    : '#F8FAFC',
                  fontSize: '28px',
                  fontWeight: 900,
                  lineHeight: 1,
                }}
              >
                {entry.total_points}
              </div>

              <div
                style={{
                  color: '#A1A1AA',
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
