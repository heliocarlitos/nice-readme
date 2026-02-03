import type { Metadata } from "next"
import React from "react"
import { Header } from "@/components/header/header"
import "./globals.css"
import { LenisWrapper } from "@/components/leniswrapper/page"
import TopProgressLoader from "@/components/topprogressloader/TopProgressLoader"
import { IrparaTop } from "@/components/btn/irparatop/irparatop"
import { UsuarioGuardado } from "@/components/avisos/usuario-guardado/usuario-guardado"

export const metadata: Metadata = {
  metadataBase: new URL("https://nice-readme.vercel.app"),

  title: {
    default: "Nice Readme – Personaliza o teu GitHub README sem código",
    template: "%s | Nice Readme"
  },

  description: "Cria automaticamente streaks, estatísticas, badges, repositórios destacados e mais para o teu perfil GitHub. Torna o README limpo, profissional e organizado sem escrever código. Ideal para iniciantes e programadores.",

  keywords: ["github readme", "github stats", "github streak", "github streak stats", "readme github", "personalizar readme", "estatísticas github", "badges github", "pinned repositories github", "perfil github bonito", "github profile readme", "ferramenta github readme"],

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
    title: "Nice Readme – Personaliza o teu GitHub README sem código",
    description: "Gera streaks, estatísticas gerais, repositórios destacados e badges automaticamente. README profissional e organizado em poucos cliques.",
    url: "https://nice-readme.vercel.app",
    siteName: "Nice Readme",
    images: [
      {
        url: "/demo.png",
        width: 1200,
        height: 630,
        alt: "Exemplo de perfil GitHub bonito criado com Nice Readme"
      }
    ],
    locale: "pt_PT",
    type: "website"
  },

  twitter: {
    card: "summary_large_image",
    title: "Nice Readme – Torna o teu perfil GitHub mais profissional",
    description: "Streak stats, estatísticas, pinned repos, badges — tudo automático e personalizável.",
    images: ["/demo.png"],
    creator: "@heliocarlitos"
  },

  alternates: {
    canonical: "https://nice-readme.vercel.app"
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt">
      <head>
        <meta name="theme-color" content="#1a1a1a" />
      </head>
      <body>
        <TopProgressLoader />
        <Header />
        <LenisWrapper>
          <main>{children}</main>
        </LenisWrapper>
        <IrparaTop />
        <UsuarioGuardado />
      </body>
    </html>
  )
}
