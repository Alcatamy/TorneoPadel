import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Users, Trophy, Target, Activity, Calendar as CalendarIcon, ChevronLeft } from "lucide-react"
import Link from "next/link"

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const team = await prisma.team.findUnique({
    where: { id },
    include: {
      category: true,
      group: true,
      homeMatches: {
        include: { homeTeam: true, awayTeam: true },
        orderBy: { time: 'asc' }
      },
      awayMatches: {
        include: { homeTeam: true, awayTeam: true },
        orderBy: { time: 'asc' }
      }
    }
  })

  if (!team) notFound()

  // Combine and sort matches
  const allMatches = [...team.homeMatches, ...team.awayMatches].sort((a, b) => {
    // Simple time sort "10:00" vs "11:15"
    return a.time.localeCompare(b.time)
  })

  return (
    <div className="p-4 pb-20">
      <Link href="/equipos" className="inline-flex items-center text-sm text-textMuted hover:text-primary mb-6 transition-colors">
        <ChevronLeft size={16} className="mr-1" /> Volver a equipos
      </Link>

      {/* Header Info */}
      <div className="bg-surface rounded-2xl p-6 border border-border relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

        <div className="flex items-start justify-between relative z-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">{team.name}</h1>
            <p className="text-primary font-medium">{team.players}</p>
            <div className="mt-4 inline-block px-3 py-1 rounded-full bg-surfaceHighlight border border-border text-xs text-textMuted">
              Categoría {team.category.name} {team.group ? `• ${team.group.name}` : ''}
            </div>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-surfaceHighlight flex items-center justify-center border border-border/50">
            <Users size={32} className="text-primary" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <h3 className="text-lg font-bold text-white mb-3">Estadísticas</h3>
      <div className="grid grid-cols-2 gap-3 mb-8">
        <StatCard icon={<Trophy size={18} />} label="Puntos" value={team.points.toString()} highlight />
        <StatCard icon={<Activity size={18} />} label="Partidos Jugados" value={team.matchesPlayed.toString()} />
        <StatCard icon={<Target size={18} className="text-green-500" />} label="Victorias" value={team.matchesWon.toString()} />
        <StatCard icon={<Target size={18} className="text-danger" />} label="Derrotas" value={team.matchesLost.toString()} />
      </div>

      {/* Matches List */}
      <h3 className="text-lg font-bold text-white mb-3 flex items-center">
        <CalendarIcon size={20} className="mr-2 text-primary" />
        Calendario de Partidos
      </h3>
      <div className="space-y-3">
        {allMatches.map(match => {
          const isHome = match.homeTeamId === team.id
          const opponent = isHome ? match.awayTeam?.name : match.homeTeam?.name

          return (
            <div key={match.id} className="bg-surface p-4 rounded-xl border border-border flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {match.time}
                  </span>
                  <span className="text-xs text-textMuted">{match.court}</span>
                  <span className="text-xs text-textMuted">• {match.type}</span>
                </div>
                <div className="text-white text-sm font-medium">
                  vs <span className="font-bold">{opponent || 'Por definir'}</span>
                </div>
              </div>
              <div className="text-right">
                {match.isPlayed ? (
                  <div className="flex items-center space-x-2 font-bold text-lg">
                    <span className={isHome ? "text-primary" : "text-textMuted"}>{match.homeScore}</span>
                    <span className="text-textMuted text-xs">-</span>
                    <span className={!isHome ? "text-primary" : "text-textMuted"}>{match.awayScore}</span>
                  </div>
                ) : (
                  <span className="text-xs text-textMuted uppercase tracking-wider">Pendiente</span>
                )}
              </div>
            </div>
          )
        })}
        {allMatches.length === 0 && (
          <p className="text-sm text-textMuted text-center py-4">No hay partidos programados.</p>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, highlight = false }: { icon: React.ReactNode, label: string, value: string, highlight?: boolean }) {
  return (
    <div className={`p-4 rounded-xl border flex flex-col justify-between ${highlight ? 'bg-primary/5 border-primary/30' : 'bg-surface border-border'}`}>
      <div className="flex items-center space-x-2 text-textMuted mb-2">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${highlight ? 'text-primary' : 'text-white'}`}>
        {value}
      </div>
    </div>
  )
}
