import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav
      style={{
        background:
          'linear-gradient(180deg, #171721 0%, #0B0B12 100%)',
        borderBottom: '1px solid rgba(139,92,246,.25)',
        backdropFilter: 'blur(10px)',
      }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <Image
            src="/Namka_Logo_Transparent.png"
            alt="NAMKA Logo"
            width={100}
            height={42}
            className="object-contain"
            priority
          />

          <div>
            <p
              style={{
                color: '#F8FAFC',
              }}
              className="font-black text-xl leading-none"
            >
              NAMKA
            </p>

            <p
              style={{
                color: '#D4AF37',
                fontSize: '11px',
                letterSpacing: '.12em',
              }}
            >
              WORLD CUP CHALLENGE
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            style={{
              color: '#F8FAFC',
            }}
            className="text-sm px-4 py-2 rounded-xl hover:bg-white/5 transition-all duration-300"
          >
            ⚽ Matches
          </Link>

          <Link
            href="/leaderboard"
            style={{
              background:
                'linear-gradient(135deg,#8B5CF6,#D4AF37)',
              color: '#fff',
            }}
            className="text-sm px-4 py-2 rounded-xl font-bold transition-all duration-300 hover:scale-105"
          >
            🏆 Leaderboard
          </Link>

          <Link
            href="/logout"
            style={{
              color: '#A1A1AA',
            }}
            className="text-sm px-4 py-2 rounded-xl hover:bg-white/5 transition-all duration-300"
          >
            🚪 Logout
          </Link>
        </div>
      </div>
    </nav>
  )
}