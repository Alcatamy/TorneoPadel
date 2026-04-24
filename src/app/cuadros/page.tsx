import { Trophy } from "lucide-react"
import { prisma } from "@/lib/prisma"

export default async function CuadrosPage() {
  const knockoutMatches = await prisma.match.findMany({
    where: {
      type: {
        in: ["Semifinal", "Semi Consolación", "3º y 4º puesto", "3º y 4º Consolación", "Final", "Final Consolación"]
      }
    },
    include: {
      homeTeam: true,
      awayTeam: true
    }
  })

  // Helper to filter matches
  const getMatches = (types: string[]) => knockoutMatches.filter(m => types.includes(m.type))

  return (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Cuadros Finales</h1>
        <p className="text-textMuted text-sm">Fase eliminatoria Caballeros.</p>
      </div>

      <div className="space-y-8">
        <BracketSection
          title="Fase Final Principal"
          semis={getMatches(["Semifinal"])}
          third={getMatches(["3º y 4º puesto"])}
          final={getMatches(["Final"])}
        />

        <BracketSection
          title="Fase Consolación"
          semis={getMatches(["Semi Consolación"])}
          third={getMatches(["3º y 4º Consolación"])}
          final={getMatches(["Final Consolación"])}
        />
      </div>
    </div>
  )
}

type MatchData = {
  homeTeam?: { name?: string } | null;
  awayTeam?: { name?: string } | null;
  placeholderHome?: string | null;
  placeholderAway?: string | null;
  homeScore?: number | string | null;
  awayScore?: number | string | null;
  [key: string]: unknown;
};

function BracketSection({ title, semis, third, final }: { title: string, semis: MatchData[], third: MatchData[], final: MatchData[] }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-4 overflow-hidden">
      <h2 className="text-lg font-bold text-primary mb-6 flex items-center border-b border-border pb-2">
        <Trophy size={18} className="mr-2" />
        {title}
      </h2>

      <div className="relative">
        <div className="grid grid-cols-2 gap-8 relative z-10">
          {/* Semifinales Column */}
          <div className="space-y-12">
            <h3 className="text-xs font-bold text-textMuted uppercase tracking-wider text-center mb-4">Semifinales</h3>
            {semis.map((match, idx) => (
              <BracketMatch key={idx} match={match} />
            ))}
          </div>

          {/* Finales Column */}
          <div className="space-y-8 flex flex-col justify-center">
            <div>
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider text-center mb-4">Final</h3>
              {final.map((match, idx) => (
                <BracketMatch key={idx} match={match} isFinal />
              ))}
            </div>

            {third.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xs font-bold text-textMuted uppercase tracking-wider text-center mb-4">3º y 4º Puesto</h3>
                {third.map((match, idx) => (
                  <BracketMatch key={idx} match={match} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function BracketMatch({ match, isFinal = false }: { match: MatchData, isFinal?: boolean }) {
  const homeName = match?.homeTeam?.name || match?.placeholderHome || "TBD"
  const awayName = match?.awayTeam?.name || match?.placeholderAway || "TBD"

  return (
    <div className={`bg-surfaceHighlight border ${isFinal ? 'border-primary/50 shadow-[0_0_15px_rgba(212,255,0,0.1)]' : 'border-border'} rounded-lg overflow-hidden text-sm`}>
      <div className="flex justify-between items-center p-2 border-b border-border">
        <span className="font-medium text-white truncate pr-2">{homeName}</span>
        <span className="font-bold text-primary">{match?.homeScore ?? '-'}</span>
      </div>
      <div className="flex justify-between items-center p-2">
        <span className="font-medium text-white truncate pr-2">{awayName}</span>
        <span className="font-bold text-primary">{match?.awayScore ?? '-'}</span>
      </div>
    </div>
  )
}
