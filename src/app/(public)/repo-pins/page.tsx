import type { Metadata } from "next"

import { ReportarBug } from "@/components/btn/reportarbug/reportarbug"
import { RepoPin } from "@/components/stats/repo-pins"

export const metadata: Metadata = {
  metadataBase: new URL("https://nice-readme.vercel.app"),

  title: {
    default: "Repo Pin – Destaca repositórios no teu perfil GitHub",
    template: "%s | Nice Readme"
  },

  description: "Cria cartões elegantes e personalizáveis para destacar os teus repositórios favoritos no README do GitHub. Personaliza tema, cor da borda, raio e mostra ou esconde o proprietário. Resultado pronto para copiar e colar.",

  keywords: ["repo pin github", "github repo card", "pinned repositories github", "destacar repositório github", "repo pin readme", "cartão repositório github", "personalizar pinned repo", "github repository card", "ferramenta pinned github", "nice readme repo pin"],

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
    title: "Repo Pin – Destaca repositórios no teu perfil GitHub",
    description: "Transforma os teus repositórios em cartões modernos para o README. Personaliza tema, bordas, raio e proprietário. Fácil, rápido e sem código.",
    url: "https://nice-readme.vercel.app/repo-pins",
    siteName: "Nice Readme",
    images: [
      {
        url: "/repo-pin.png",
        width: 1200,
        height: 630,
        alt: "Exemplo de cartão de repositório destacado criado com Nice Readme"
      }
    ],
    locale: "pt_PT",
    type: "website"
  },

  twitter: {
    card: "summary_large_image",
    title: "Repo Pin – Mostra os teus melhores repositórios no GitHub",
    description: "Cartões personalizados para repositórios. Tema claro/escuro, bordas arredondadas e mais. Ideal para README profissional.",
    images: ["/repo-pin.png"],
    creator: "@heliocarlitoss"
  },

  alternates: {
    canonical: "https://nice-readme.vercel.app/repo-pins"
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
      <RepoPin />
      <ReportarBug />
    </>
  )
}
