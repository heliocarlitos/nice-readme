import type { Metadata } from "next"

import { ReportarBug } from "@/components/btn/reportarbug/reportarbug"
import { Badges } from "@/components/stats/badge"

export const metadata: Metadata = {
  metadataBase: new URL("https://nice-readme.vercel.app"),

  title: {
    default: "Badges GitHub – Cria badges personalizados sem código",
    template: "%s | Nice Readme"
  },

  description: "Gera badges estáticos e com logotipo para o teu README do GitHub. Totalmente personalizáveis: texto, cor, estilo, ícone, tamanho e mais. Sem código, cópia e cola instantâneo.",

  keywords: ["badges github", "github badges", "badges readme", "shields.io badges", "badges personalizados github", "criar badges github", "badges com logo github", "readme github badges", "ferramenta badges github", "nice readme badges"],

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
    title: "Badges GitHub – Cria badges personalizados sem código",
    description: "Adiciona badges modernos e profissionais ao teu perfil GitHub. Escolhe texto, cores, estilos, ícones e mais. Resultado pronto para copiar e colar no README.",
    url: "https://nice-readme.vercel.app/badges",
    siteName: "Nice Readme",
    images: [
      {
        url: "/badges.png",
        width: 1200,
        height: 630,
        alt: "Exemplo de badges personalizados criados com Nice Readme"
      }
    ],
    locale: "pt_PT",
    type: "website"
  },

  twitter: {
    card: "summary_large_image",
    title: "Badges GitHub – Personaliza o teu README com estilo",
    description: "Cria badges com texto, cores, ícones e formatos variados. Rápido, grátis e sem código.",
    images: ["/badges.png"],
    creator: "@heliocarlitoss"
  },

  alternates: {
    canonical: "https://nice-readme.vercel.app/badges"
  },

  category: "Developer Tools",
  classification: "GitHub Readme Enhancement",
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
      <Badges />
      <ReportarBug />
    </>
  )
}
