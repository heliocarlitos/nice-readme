import type { Metadata } from "next"

import { ReportarBug } from "@/components/btn/reportarbug/reportarbug"
import { WakaTimeStats } from "@/components/stats/wakatime"

export const metadata: Metadata = {
  metadataBase: new URL("https://nice-readme.vercel.app"),

  title: {
    default: "WakaTime Stats – Tempo de codificação no teu README",
    template: "%s | Nice Readme"
  },

  description: "Mostra as tuas estatísticas de tempo de codificação do WakaTime no README do GitHub. Personaliza título, largura, layout (padrão ou compacto), formato (tempo ou percentagem), número de linguagens, ocultação de itens e mais. Resultado pronto para copiar e colar.",

  keywords: ["wakatime stats", "wakatime github readme", "estatísticas wakatime", "wakatime card github", "tempo codificação github", "wakatime readme", "personalizar wakatime stats", "wakatime languages card", "ferramenta wakatime github", "nice readme wakatime"],

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
    title: "WakaTime Stats – Tempo de codificação no teu README",
    description: "Exibe as tuas estatísticas do WakaTime no GitHub: tempo por linguagem, layout personalizável (compacto, donut, etc.), ocultação de itens e mais. Visual profissional e automático.",
    url: "https://nice-readme.vercel.app/wakatime",
    siteName: "Nice Readme",
    images: [
      {
        url: "/wakatime.png",
        width: 1200,
        height: 630,
        alt: "Exemplo de cartão de estatísticas WakaTime criado com Nice Readme"
      }
    ],
    locale: "pt_PT",
    type: "website"
  },

  twitter: {
    card: "summary_large_image",
    title: "WakaTime Stats – Regista o teu tempo de programação",
    description: "Cartão WakaTime para README: tempo por linguagem, layout variado, personalização completa. Rápido, grátis e sem código.",
    images: ["/wakatime.png"],
    creator: "@heliocarlitoss"
  },

  alternates: {
    canonical: "https://nice-readme.vercel.app/wakatime"
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
      <WakaTimeStats />
      <ReportarBug />
    </>
  )
}
