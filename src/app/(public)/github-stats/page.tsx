import type { Metadata } from "next"

import { ReportarBug } from "@/components/btn/reportarbug/reportarbug"
import { GithubStats } from "@/components/stats/github-stats"

export const metadata: Metadata = {
  metadataBase: new URL("https://nice-readme.vercel.app"),

  title: {
    default: "GitHub Stats – Estatísticas do teu perfil GitHub",
    template: "%s | Nice Readme"
  },

  description: "Gera o cartão de estatísticas do GitHub com estrelas, forks, pull requests, contribuições, ranking e muito mais. Totalmente personalizável: cores, tema, título, ícones, idioma, animações e opções avançadas.",

  keywords: ["github stats", "estatísticas github", "github profile stats", "cartão github stats", "github readme stats", "estatísticas perfil github", "github stats card", "personalizar github stats", "github top languages stats", "nice readme stats"],

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
    title: "GitHub Stats – Estatísticas do teu perfil GitHub",
    description: "Mostra as tuas estatísticas GitHub no README: commits, estrelas, pull requests, ranking, contribuições e mais. Personalização completa e visual moderno.",
    url: "https://nice-readme.vercel.app/github-stats",
    siteName: "Nice Readme",
    images: [
      {
        url: "/github-stats.png",
        width: 1200,
        height: 630,
        alt: "Exemplo de cartão de estatísticas GitHub criado com Nice Readme"
      }
    ],
    locale: "pt_PT",
    type: "website"
  },

  twitter: {
    card: "summary_large_image",
    title: "GitHub Stats – Mostra as tuas conquistas no GitHub",
    description: "Cartão completo com estrelas, forks, PRs, commits e ranking. Personaliza cores, tema, idioma e opções avançadas.",
    images: ["/github-stats.png"],
    creator: "@heliocarlitoss"
  },

  alternates: {
    canonical: "https://nice-readme.vercel.app/github-stats"
  },

  category: "Developer Tools",
  classification: "GitHub Profile Enhancement",
  applicationName: "Nice Readme",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
}

export default function Page() {
  return (
    <>
      <GithubStats />
      <ReportarBug />
    </>
  )
}
