import Link from 'next/link'

export default function Navbar() {
  return (
    <nav style={{
      background: 'linear-gradient(180deg, #0a1a0f 0%, #0f2318 100%)',
      borderBottom: '1px solid #22c55e30',
    }} className="sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">⚽</span>
          <div>
            <p style={{ color: '#22c55e' }} className="font-bold text-lg leading-none">
              WorldCup AI
            </p>
            <p style={{ color: '#4ade8080', fontSize: '10px' }}>
              Humans vs AI · 2026
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          <Link href="/" style={{ color: '#86efac' }}
            className="text-sm px-4 py-2 rounded-lg hover:bg-green-900/30 transition-colors">
            Matches
          </Link>
          <Link href="/leaderboard" style={{ color: '#86efac' }}
            className="text-sm px-4 py-2 rounded-lg hover:bg-green-900/30 transition-colors">
            🏆 Leaderboard
          </Link>
        </div>
      </div>
    </nav>
  )
}