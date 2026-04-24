import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Delete all to avoid duplicates on re-seed
  await prisma.match.deleteMany()
  await prisma.team.deleteMany()
  await prisma.group.deleteMany()
  await prisma.category.deleteMany()

  // 1. Create Categories
  const catCaballeros = await prisma.category.create({
    data: { name: "Caballeros", format: "Groups" }
  })

  const catDamas = await prisma.category.create({
    data: { name: "Damas", format: "League" }
  })

  // 2. Create Groups for Caballeros
  const groupA = await prisma.group.create({
    data: { name: "Grupo A", categoryId: catCaballeros.id }
  })

  const groupB = await prisma.group.create({
    data: { name: "Grupo B", categoryId: catCaballeros.id }
  })

  // 3. Create Teams
  // Caballeros Group A
  const caballerosA_Teams = [
    { name: "Kiko y Adrián", players: "Kiko, Adrián" },
    { name: "Javi y David", players: "Javi, David" },
    { name: "Ale y Julio", players: "Ale, Julio" },
    { name: "Fer y Kilian", players: "Fer, Kilian" }
  ]
  const createdCabA = await Promise.all(
    caballerosA_Teams.map(t => prisma.team.create({
      data: { ...t, categoryId: catCaballeros.id, groupId: groupA.id }
    }))
  )

  // Caballeros Group B
  const caballerosB_Teams = [
    { name: "Lucas y Rubén", players: "Lucas, Rubén" },
    { name: "Rober y Kike", players: "Rober, Kike" },
    { name: "Juanjo y Nicolás", players: "Juanjo, Nicolás" },
    { name: "Sergio y Roso", players: "Sergio, Roso" }
  ]
  const createdCabB = await Promise.all(
    caballerosB_Teams.map(t => prisma.team.create({
      data: { ...t, categoryId: catCaballeros.id, groupId: groupB.id }
    }))
  )

  // Damas Liga
  const damas_Teams = [
    { name: "Noe y Nati", players: "Noe, Nati" },
    { name: "Bea y Jami", players: "Bea, Jami" },
    { name: "Coral y Raquel", players: "Coral, Raquel" },
    { name: "Sonia y Orne", players: "Sonia, Orne" },
    { name: "Flor y Laura", players: "Flor, Laura" } // Adjusted from "Flor y Eva" based on match schedule mentions of Flor y Laura
  ]
  const createdDamas = await Promise.all(
    damas_Teams.map(t => prisma.team.create({
      data: { ...t, categoryId: catDamas.id }
    }))
  )

  // Helper to find a team by name for creating matches
  const allTeams = [...createdCabA, ...createdCabB, ...createdDamas]
  const getTeam = (name: string) => allTeams.find(t => t.name === name)?.id

  // 4. Create Matches based on Schedule
  const matches = [
    { time: "10:00", court: "Pista 1", homeTeamId: getTeam("Kiko y Adrián"), awayTeamId: getTeam("Fer y Kilian"), type: "Group" },
    { time: "10:00", court: "Pista 2", homeTeamId: getTeam("Bea y Jami"), awayTeamId: getTeam("Noe y Nati"), type: "League" },

    { time: "10:17", court: "Pista 1", homeTeamId: getTeam("Javi y David"), awayTeamId: getTeam("Ale y Julio"), type: "Group" },
    { time: "10:17", court: "Pista 2", homeTeamId: getTeam("Coral y Raquel"), awayTeamId: getTeam("Sonia y Orne"), type: "League" },

    { time: "10:34", court: "Pista 1", homeTeamId: getTeam("Lucas y Rubén"), awayTeamId: getTeam("Sergio y Roso"), type: "Group" },
    { time: "10:34", court: "Pista 2", homeTeamId: getTeam("Flor y Laura"), awayTeamId: getTeam("Bea y Jami"), type: "League" },

    { time: "10:51", court: "Pista 1", homeTeamId: getTeam("Rober y Kike"), awayTeamId: getTeam("Juanjo y Nicolás"), type: "Group" },
    { time: "10:51", court: "Pista 2", homeTeamId: getTeam("Noe y Nati"), awayTeamId: getTeam("Coral y Raquel"), type: "League" },

    { time: "11:03", court: "Pista 1", homeTeamId: getTeam("Kiko y Adrián"), awayTeamId: getTeam("Ale y Julio"), type: "Group" },
    { time: "11:03", court: "Pista 2", homeTeamId: getTeam("Sonia y Orne"), awayTeamId: getTeam("Flor y Laura"), type: "League" },

    { time: "11:15", court: "Pista 1", homeTeamId: getTeam("Javi y David"), awayTeamId: getTeam("Fer y Kilian"), type: "Group" },
    { time: "11:15", court: "Pista 2", homeTeamId: getTeam("Bea y Jami"), awayTeamId: getTeam("Coral y Raquel"), type: "League" },

    { time: "11:27", court: "Pista 1", homeTeamId: getTeam("Lucas y Rubén"), awayTeamId: getTeam("Juanjo y Nicolás"), type: "Group" },
    { time: "11:27", court: "Pista 2", homeTeamId: getTeam("Noe y Nati"), awayTeamId: getTeam("Sonia y Orne"), type: "League" },

    { time: "11:39", court: "Pista 1", homeTeamId: getTeam("Rober y Kike"), awayTeamId: getTeam("Sergio y Roso"), type: "Group" },
    { time: "11:39", court: "Pista 2", homeTeamId: getTeam("Flor y Laura"), awayTeamId: getTeam("Coral y Raquel"), type: "League" },

    { time: "11:51", court: "Pista 1", homeTeamId: getTeam("Kiko y Adrián"), awayTeamId: getTeam("Javi y David"), type: "Group" },
    { time: "11:51", court: "Pista 2", homeTeamId: getTeam("Ale y Julio"), awayTeamId: getTeam("Fer y Kilian"), type: "Group" },

    { time: "12:03", court: "Pista 1", homeTeamId: getTeam("Lucas y Rubén"), awayTeamId: getTeam("Rober y Kike"), type: "Group" },
    { time: "12:03", court: "Pista 2", homeTeamId: getTeam("Juanjo y Nicolás"), awayTeamId: getTeam("Sergio y Roso"), type: "Group" },

    { time: "12:15", court: "Pista 1", homeTeamId: getTeam("Bea y Jami"), awayTeamId: getTeam("Sonia y Orne"), type: "League" },
    { time: "12:15", court: "Pista 2", homeTeamId: getTeam("Noe y Nati"), awayTeamId: getTeam("Flor y Laura"), type: "League" },

    // Knockouts - Using placeholders for TBD teams
    { time: "12:27", court: "Pista 1", placeholderHome: "1º Grupo A", placeholderAway: "2º Grupo B", type: "Semifinal", isPlayed: false },
    { time: "12:27", court: "Pista 2", placeholderHome: "1º Grupo B", placeholderAway: "2º Grupo A", type: "Semifinal", isPlayed: false },

    { time: "12:39", court: "Pista 1", placeholderHome: "3º Grupo A", placeholderAway: "4º Grupo B", type: "Semi Consolación", isPlayed: false },
    { time: "12:39", court: "Pista 2", placeholderHome: "3º Grupo B", placeholderAway: "4º Grupo A", type: "Semi Consolación", isPlayed: false },

    { time: "12:51", court: "Pista 1", placeholderHome: "Perdedor Semi 1", placeholderAway: "Perdedor Semi 2", type: "3º y 4º puesto", isPlayed: false },
    { time: "12:51", court: "Pista 2", placeholderHome: "Perdedor S. Cons 1", placeholderAway: "Perdedor S. Cons 2", type: "3º y 4º Consolación", isPlayed: false },

    { time: "13:03", court: "Pista 1", placeholderHome: "Ganador Semi 1", placeholderAway: "Ganador Semi 2", type: "Final", isPlayed: false },
    { time: "13:03", court: "Pista 2", placeholderHome: "Ganador S. Cons 1", placeholderAway: "Ganador S. Cons 2", type: "Final Consolación", isPlayed: false }
  ]

  for (const match of matches) {
    await prisma.match.create({ data: match })
  }

  console.log("Database seeded successfully with 'I Torneo Premier Padel Bajá las Patas' data!")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
