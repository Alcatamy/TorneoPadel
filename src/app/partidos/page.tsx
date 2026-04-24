import { prisma } from "@/lib/prisma"
import { MapPin, Clock } from "lucide-react"

export default async function PartidosPage() {
  const allMatches = await prisma.match.findMany({
    include: {
      homeTeam: true,
      awayTeam: true
    },
    orderBy: [
      { time: 'asc' },
      { court: 'asc' }
    ]
  })

  // Group by time for easier reading
  const groupedMatches = allMatches.reduce((acc, match) => {
    if (!acc[match.time]) acc[match.time] = []
    acc[match.time].push(match)
    return acc
  }, {} as Record<string, typeof allMatches>)

  return (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Calendario de Partidos</h1>
        <p className="text-textMuted text-sm">Horarios y resultados de la jornada.</p>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedMatches).map(([time, matches]) => (
          <div key={time} className="relative">
            {/* Timeline dot and line */}
            <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-primary mb-2 shadow-[0_0_8px_rgba(212,255,0,0.5)] z-10" />
              <div className="w-px h-full bg-border -mt-2" />
            </div>

            <div className="pl-10">
              <h2 className="text-lg font-bold text-white mb-3 flex items-center">
                <Clock size={18} className="mr-2 text-primary" />
                {time}
              </h2>

              <div className="grid gap-3">
                {matches.map(match => {
                  const homeName = match.homeTeam?.name || match.placeholderHome
                  const awayName = match.awayTeam?.name || match.placeholderAway

                  return (
                    <div key={match.id} className="bg-surface rounded-xl border border-border p-4">
                      <div className="flex items-center justify-between mb-3 border-b border-border/50 pb-2">
                        <div className="flex items-center space-x-2">
                          <MapPin size={14} className="text-textMuted" />
                          <span className="text-xs font-medium text-textMuted">{match.court}</span>
                        </div>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {match.type}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-bold ${match.isPlayed && match.homeScore! > match.awayScore! ? 'text-primary' : 'text-white'}`}>
                            {homeName}
                          </span>
                          {match.isPlayed && (
                            <span className="text-lg font-bold text-white">{match.homeScore}</span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-bold ${match.isPlayed && match.awayScore! > match.homeScore! ? 'text-primary' : 'text-white'}`}>
                            {awayName}
                          </span>
                          {match.isPlayed && (
                            <span className="text-lg font-bold text-white">{match.awayScore}</span>
                          )}
                        </div>
                      </div>

                      {!match.isPlayed && (
                        <div className="mt-3 pt-2 border-t border-border/50 text-center">
                          <span className="text-xs text-textMuted uppercase tracking-widest font-medium">Por Jugar</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
