"use client";
import { Home, Calendar, Trophy, Users, Info } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function BottomNav() {
  const pathname = usePathname()

  const links = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Partidos", href: "/partidos", icon: Calendar },
    { name: "Cuadros", href: "/cuadros", icon: Trophy },
    { name: "Equipos", href: "/equipos", icon: Users },
    { name: "Info", href: "/info", icon: Info },
  ]

  return (
    <nav className="fixed bottom-0 w-full bg-surface/90 backdrop-blur-md border-t border-border z-50">
      <div className="flex justify-around items-center h-16">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 text-xs transition-colors",
                isActive ? "text-primary" : "text-textMuted hover:text-textMain"
              )}
            >
              <link.icon className={cn("w-6 h-6", isActive && "drop-shadow-[0_0_8px_rgba(212,255,0,0.5)]")} />
              <span>{link.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
