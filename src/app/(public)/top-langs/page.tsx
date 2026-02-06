import type { Metadata } from "next"

import { ReportarBug } from "@/components/btn/reportarbug/reportarbug"
import { TopLangs } from "@/components/stats/top-langs"

export const metadata: Metadata = {
  metadataBase: new URL("https://nice-readme.vercel.app"),

  title: {
    default: "Top Languages – Linguagens mais usadas no teu GitHub",
    template: "%s | Nice Readme"
  },

  description: "Mostra as tuas linguagens de programação mais usadas no README do GitHub. Personaliza layout (normal, compacto, donut, pie), tema, cores, bordas, título, quantidade de linguagens, barras de progresso e mais. Resultado pronto para copiar e colar.",

  keywords: ["top languages github", "github top langs", "linguagens github readme", "top languages card", "github languages stats", "most used languages github", "personalizar top languages", "github readme languages", "ferramenta top languages github", "nice readme top langs"],

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
    title: "Top Languages – Linguagens mais usadas no teu GitHub",
    description: "Cartão visual das tuas linguagens de programação mais utilizadas. Vários layouts (normal, compacto, donut, pie), personalização de cores, título, quantidade e animações. Perfeito para README profissional.",
    url: "https://nice-readme.vercel.app/top-langs",
    siteName: "Nice Readme",
    images: [
      {
        url: "/top-langs.png",
        width: 1200,
        height: 630,
        alt: "Exemplo de cartão de linguagens mais usadas criado com Nice Readme"
      }
    ],
    locale: "pt_PT",
    type: "website"
  },

  twitter: {
    card: "summary_large_image",
    title: "Top Languages – Destaca as tuas linguagens no GitHub",
    description: "Mostra as linguagens que mais usas com layouts modernos (donut, pie, compacto). Personaliza tudo: cores, bordas, quantidade e mais. Rápido e sem código.",
    images: ["/top-langs.png"],
    creator: "@heliocarlitoss"
  },

  alternates: {
    canonical: "https://nice-readme.vercel.app/top-langs"
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
      <TopLangs />
      <ReportarBug />
    </>
  )
}
