import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import BottomNav from "@/components/BottomNav"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "I Torneo Premier Padel - Bajá las Patas",
  description: "App oficial del I Torneo Premier Padel Bajá las Patas",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-background text-textMain min-h-screen pb-16`}>
        {/* Header simple */}
        <header className="sticky top-0 z-40 w-full bg-surface/80 backdrop-blur-md border-b border-border">
          <div className="flex h-14 items-center px-4">
            <h1 className="text-lg font-bold text-primary truncate">
              PREMIER PADEL <span className="text-white font-normal">Bajá las Patas</span>
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-[calc(100vh-3.5rem-4rem)]">
          {children}
        </main>

        {/* Bottom Navigation */}
        <BottomNav />
      </body>
    </html>
  )
}
