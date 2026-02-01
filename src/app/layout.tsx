import type { Metadata } from "next"
import React from "react"
import { Header } from "@/components/header/header"
import "./globals.css"
import { LenisWrapper } from "@/components/leniswrapper/page"
import TopProgressLoader from "@/components/topprogressloader/TopProgressLoader"
import { IrparaTop } from "@/components/btn/irparatop/irparatop"

export const metadata: Metadata = {
  title: "Nice Readme – Cria estatísticas bonitas para o teu GitHub",
  description: "Gera automaticamente estatísticas do GitHub, streaks, pins, badges e mais. Torna o teu README profissional, limpo e organizado sem escrever código. Ideal para iniciantes e developers.",
  keywords: ["github readme", "github stats", "github streak", "readme github", "github profile", "badges github", "github pinned repos", "estatisticas github", "github readme stats", "personalizar readme"],
  authors: [{ name: "Hélio Carlitos António", url: "https://heliocarlitos.vercel.app/" }],
  creator: "Hélio Carlitos António",

  icons: {
    icon: [{ url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" }, { url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.ico" }],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "Nice Readme"
  },

  openGraph: {
    title: "Nice Readme – Estatísticas GitHub bonitas e fáceis",
    description: "Cria um README profissional com streaks, estatísticas, badges e repositórios destacados. Sem código, sem complicações.",
    url: "https://nice-readme.vercel.app",
    siteName: "Nice Readme",
    images: [
      {
        url: "/demo.webp",
        width: 1200,
        height: 630,
        alt: "Exemplo de README bonito criado com Nice Readme"
      }
    ],
    locale: "pt_PT",
    type: "website"
  },

  twitter: {
    card: "summary_large_image",
    title: "Nice Readme – Torna o teu perfil GitHub mais profissional",
    description: "Streak stats, GitHub stats, pinned repos, badges — tudo automático e personalizável.",
    images: ["/demo.webp"],
    creator: "@heliocarlitos"
  },

  alternates: {
    canonical: "https://nice-readme.vercel.app"
  },

  category: "Developer Tools",
  robots: {
    index: true,
    follow: true
  }
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt">
      <body>
        <TopProgressLoader />
        <Header />
        <LenisWrapper>
          <main>{children}</main>
        </LenisWrapper>
        <IrparaTop />
      </body>
    </html>
  )
}
