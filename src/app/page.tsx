import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Trophy, ChevronRight, PlayCircle } from "lucide-react"

export default async function Home() {
  const categories = await prisma.category.findMany({
    include: {
      groups: {
        include: {
          teams: {
            orderBy: [
              { points: 'desc' }, // PG
              { gamesWon: 'desc' } // DG/JG approximation for now
            ]
          }
        }
      },
      teams: {
        where: { groupId: null },
        orderBy: [
          { points: 'desc' },
          { gamesWon: 'desc' }
        ]
      }
    }
  })

  // Get upcoming matches
  const upcomingMatches = await prisma.match.findMany({
    where: { isPlayed: false, homeTeamId: { not: null }, awayTeamId: { not: null } },
    orderBy: { time: 'asc' },
    take: 3,
    include: { homeTeam: true, awayTeam: true }
  })

  return (
    <div className="p-4 pb-20 space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-surface to-surfaceHighlight border border-border p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
        <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-2">Torneo en Curso</h2>
        <h1 className="text-3xl font-bold text-white leading-tight mb-4 text-balance">
          I Torneo Premier Padel &quot;Bajá las Patas&quot;
        </h1>
        <p className="text-textMuted text-sm max-w-[80%] mb-6">
          Sigue los resultados, estadísticas y próximos encuentros en tiempo real.
        </p>
        <Link href="/partidos" className="inline-flex items-center bg-primary text-black font-bold px-5 py-2.5 rounded-full text-sm hover:bg-primary/90 transition-transform active:scale-95">
          <PlayCircle size={18} className="mr-2" />
          Ver Partidos Hoy
        </Link>
      </div>

      {/* Próximos Partidos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Próximos Encuentros</h3>
          <Link href="/partidos" className="text-sm text-primary hover:underline">Ver todos</Link>
        </div>

        <div className="flex overflow-x-auto space-x-4 pb-4 snap-x">
          {upcomingMatches.map(match => (
            <div key={match.id} className="min-w-[280px] snap-center bg-surface border border-border rounded-2xl p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">{match.time}</span>
                <span className="text-xs text-textMuted">{match.court}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white truncate pr-2">{match.homeTeam?.name}</span>
                  <span className="text-textMuted">-</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white truncate pr-2">{match.awayTeam?.name}</span>
                  <span className="text-textMuted">-</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Standings Summary */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Trophy size={24} className="mr-2 text-primary" />
          Posiciones Destacadas
        </h3>

        <div className="space-y-6">
          {categories.map(category => (
            <div key={category.id}>
              {category.groups.length > 0 ? (
                // Groups (Caballeros)
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.groups.map(group => (
                    <div key={group.id} className="bg-surface rounded-2xl border border-border overflow-hidden">
                      <div className="bg-surfaceHighlight px-4 py-2 border-b border-border">
                        <h4 className="text-sm font-bold text-white">{category.name} - {group.name}</h4>
                      </div>
                      <StandingsTable teams={group.teams.slice(0, 3)} />
                    </div>
                  ))}
                </div>
              ) : (
                // League (Damas)
                <div className="bg-surface rounded-2xl border border-border overflow-hidden">
                  <div className="bg-surfaceHighlight px-4 py-2 border-b border-border">
                    <h4 className="text-sm font-bold text-white">Categoría {category.name} (Liga)</h4>
                  </div>
                  <StandingsTable teams={category.teams.slice(0, 4)} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

type TeamStanding = {
  id: string;
  name: string;
  points: number;
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  gamesWon: number;
  gamesLost: number;
  [key: string]: unknown;
};

function StandingsTable({ teams }: { teams: TeamStanding[] }) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-12 text-xs text-textMuted px-4 py-2 border-b border-border/50">
        <div className="col-span-1">#</div>
        <div className="col-span-6">Equipo</div>
        <div className="col-span-1 text-center" title="Partidos Jugados">PJ</div>
        <div className="col-span-1 text-center text-green-500" title="Partidos Ganados">PG</div>
        <div className="col-span-3 text-right font-bold text-primary">PTS</div>
      </div>
      {teams.map((team, idx) => (
        <Link
          href={`/equipos/${team.id}`}
          key={team.id}
          className="grid grid-cols-12 text-sm text-white px-4 py-3 border-b border-border/50 last:border-0 hover:bg-surfaceHighlight transition-colors items-center"
        >
          <div className="col-span-1 text-textMuted font-bold">{idx + 1}</div>
          <div className="col-span-6 font-medium truncate pr-2">{team.name}</div>
          <div className="col-span-1 text-center">{team.matchesPlayed}</div>
          <div className="col-span-1 text-center">{team.matchesWon}</div>
          <div className="col-span-3 text-right font-bold text-primary flex items-center justify-end">
            {team.points} <ChevronRight size={14} className="ml-1 text-textMuted" />
          </div>
        </Link>
      ))}
    </div>
  )
}
