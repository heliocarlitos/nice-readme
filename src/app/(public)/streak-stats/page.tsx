import type { Metadata } from "next"

import { ReportarBug } from "@/components/btn/reportarbug/reportarbug"
import { StreakStats } from "@/components/stats/streak-stats"

export const metadata: Metadata = {
  metadataBase: new URL("https://nice-readme.vercel.app"),

  title: {
    default: "GitHub Streak – Mostra a tua sequência de contribuições",
    template: "%s | Nice Readme"
  },

  description: "Gera o cartão de streak do GitHub com a tua sequência actual e máxima de contribuições. Personaliza tema, bordas, idioma, modo diário/semanal, exclusão de dias, animações e muito mais. Resultado pronto para copiar e colar no README.",

  keywords: ["github streak", "streak stats github", "github streak card", "sequência contribuições github", "streak readme github", "github commit streak", "personalizar streak github", "cartão streak github", "ferramenta streak stats", "nice readme streak"],

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
    title: "GitHub Streak – Mostra a tua sequência de contribuições",
    description: "Cartão visual da tua streak de commits no GitHub. Personaliza cores, bordas, idioma, exclusão de dias e opções avançadas. Ideal para README profissional.",
    url: "https://nice-readme.vercel.app/streak-stats",
    siteName: "Nice Readme",
    images: [
      {
        url: "/streak-stats.png",
        width: 1200,
        height: 630,
        alt: "Exemplo de cartão de streak de contribuições criado com Nice Readme"
      }
    ],
    locale: "pt_PT",
    type: "website"
  },

  twitter: {
    card: "summary_large_image",
    title: "GitHub Streak – Regista a tua consistência no GitHub",
    description: "Mostra sequência actual e máxima de contribuições. Personaliza tema, modo, dias excluídos e mais. Rápido e sem código.",
    images: ["/streak-stats.png"],
    creator: "@heliocarlitoss"
  },

  alternates: {
    canonical: "https://nice-readme.vercel.app/streak-stats"
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
      <StreakStats />
      <ReportarBug />
    </>
  )
}
