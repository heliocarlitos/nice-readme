import type { Metadata } from "next"

import { ReportarBug } from "@/components/btn/reportarbug/reportarbug"
import { ViewsBadge } from "@/components/stats/views-badge"

export const metadata: Metadata = {
  metadataBase: new URL("https://nice-readme.vercel.app"),

  title: {
    default: "Badge de Visualizações – Contador de visitas no perfil GitHub",
    template: "%s | Nice Readme"
  },

  description: "Adiciona um contador de visualizações ao teu perfil GitHub. Personaliza rótulo, cor, estilo, número base e formato abreviado (ex: 1.2K). Contagem começa assim que adicionas o badge ao README.",

  keywords: ["visualizações github", "github profile views", "contador visualizações github", "badge visualizações github", "ghpvc badge", "views counter github", "readme views badge", "personalizar contador github", "badge visitas perfil github", "nice readme views"],

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
    title: "Badge de Visualizações – Contador de visitas no perfil GitHub",
    description: "Mostra quantas pessoas visitaram o teu perfil. Escolhe rótulo, cor, estilo (flat, plastic, for-the-badge) e número base. Contagem automática após adicionar ao README.",
    url: "https://nice-readme.vercel.app/views-badge",
    siteName: "Nice Readme",
    images: [
      {
        url: "/views-badge.png",
        width: 1200,
        height: 630,
        alt: "Exemplo de badge de visualizações de perfil criado com Nice Readme"
      }
    ],
    locale: "pt_PT",
    type: "website"
  },

  twitter: {
    card: "summary_large_image",
    title: "Badge de Visualizações – Conta as visitas ao teu perfil GitHub",
    description: "Contador simples e elegante para o README. Personaliza texto, cor e estilo. Começa a contar assim que adicionas o badge.",
    images: ["/views-badge.png"],
    creator: "@heliocarlitoss"
  },

  alternates: {
    canonical: "https://nice-readme.vercel.app/views-badge"
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
      <ViewsBadge />
      <ReportarBug />
    </>
  )
}
