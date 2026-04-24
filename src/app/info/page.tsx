import { CheckCircle2, AlertTriangle, Gift } from "lucide-react"

export default function InfoPage() {
  return (
    <div className="p-4 pb-20 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Información del Torneo</h1>
        <p className="text-textMuted text-sm">Normas, inscripción y premios.</p>
      </div>

      <Section icon={<CheckCircle2 className="text-primary" />} title="Inscripción">
        <ul className="space-y-2 text-sm text-textMuted list-disc pl-5">
          <li>La inscripción es de <strong>5€ por jugador</strong> participante (10€ por pareja).</li>
          <li>La cuota ha de abonarse a Fer antes del comienzo del torneo.</li>
          <li>La inscripción incluye el alquiler de las dos pistas en el Hotel La Hermita durante 4 horas, de 10:00 a 14:00.</li>
          <li>Con la cuota de inscripción, se incluyen bolas nuevas y botellas de agua.</li>
        </ul>
      </Section>

      <Section icon={<AlertTriangle className="text-primary" />} title="Normas del Torneo">
        <ul className="space-y-2 text-sm text-textMuted list-disc pl-5">
          <li>Los partidos tendrán una duración de <strong>10 minutos</strong>, excepto el primer partido de cada pareja que tendrá 5 minutos más para pelotear.</li>
          <li>Los puntos decisivos siempre se terminan.</li>
          <li>Si hay empate, se juega el punto para que haya un ganador.</li>
          <li>Si un partido va empate a juegos al terminar el tiempo, ganará la pareja que vaya ganando el juego en curso.</li>
          <li><strong>Caballeros:</strong> Clasifican al cuadro principal los dos primeros de cada grupo. Orden de clasificación: PG-DJ-JG. En caso de empate, decide el resultado particular.</li>
          <li><strong>Damas:</strong> Formato Liga. Orden de clasificación: PG-DJ-JG. En caso de empate, decide el resultado particular.</li>
          <li className="text-white font-medium bg-surfaceHighlight p-2 rounded mt-2 border-l-2 border-primary">
            El jugador/a que realice doble falta en su servicio deberá invitar a una Coca-Cola a Fer.
          </li>
        </ul>
      </Section>

      <Section icon={<Gift className="text-primary" />} title="Bolas y Premios">
        <div className="space-y-4">
          <div>
            <h4 className="text-white font-bold text-sm mb-1">Bolas a utilizar</h4>
            <p className="text-sm text-textMuted">VIBOR-A ELITE TEAM.</p>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-1">Premios</h4>
            <ul className="space-y-1 text-sm text-textMuted list-disc pl-5">
              <li><strong>Caballeros:</strong> 2 Tubos de bolas para la pareja vencedora del torneo principal.</li>
              <li><strong>Damas:</strong> 2 Tubos de bolas para la pareja ganadora.</li>
            </ul>
          </div>
        </div>
      </Section>
    </div>
  )
}

function Section({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center">
        <span className="mr-2">{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  )
}
