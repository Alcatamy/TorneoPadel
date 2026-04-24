import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Users, ChevronRight } from "lucide-react"

export default async function EquiposPage() {
  const categories = await prisma.category.findMany({
    include: {
      groups: {
        include: {
          teams: true
        }
      },
      teams: {
        where: { groupId: null } // Teams directly in category (like Damas League)
      }
    }
  })

  return (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Equipos Inscritos</h1>
        <p className="text-textMuted text-sm">Selecciona un equipo para ver sus estadísticas.</p>
      </div>

      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category.id} className="space-y-4">
            <h2 className="text-xl font-bold text-primary border-b border-border pb-2">
              Categoría {category.name}
            </h2>

            {/* If it has groups */}
            {category.groups.length > 0 && category.groups.map(group => (
              <div key={group.id} className="mb-4">
                <h3 className="text-sm font-semibold text-textMuted uppercase tracking-wider mb-3">
                  {group.name}
                </h3>
                <div className="space-y-2">
                  {group.teams.map(team => (
                    <TeamCard key={team.id} team={team} />
                  ))}
                </div>
              </div>
            ))}

            {/* If teams are directly in the category (League format) */}
            {category.teams.length > 0 && (
              <div className="space-y-2">
                {category.teams.map(team => (
                  <TeamCard key={team.id} team={team} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function TeamCard({ team }: { team: any }) {
  return (
    <Link
      href={`/equipos/${team.id}`}
      className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border hover:border-primary/50 transition-colors group"
    >
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-surfaceHighlight flex items-center justify-center text-primary">
          <Users size={20} />
        </div>
        <div>
          <h4 className="font-bold text-white text-lg group-hover:text-primary transition-colors">
            {team.name}
          </h4>
          <p className="text-sm text-textMuted">
            {team.players}
          </p>
        </div>
      </div>
      <ChevronRight className="text-border group-hover:text-primary transition-colors" />
    </Link>
  )
}
