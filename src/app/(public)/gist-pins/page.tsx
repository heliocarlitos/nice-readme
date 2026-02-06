import type { Metadata } from "next"

import { ReportarBug } from "@/components/btn/reportarbug/reportarbug"
import { GistPin } from "@/components/stats/gist-pins"

export const metadata: Metadata = {
  metadataBase: new URL("https://nice-readme.vercel.app"),

  title: {
    default: "Gist Pin – Destaca os teus Gists no README do GitHub",
    template: "%s | Nice Readme"
  },

  description: "Cria cartões bonitos e personalizáveis para destacar Gists no teu README do GitHub. Escolhe tema, cor da borda, raio, idioma e mostra ou esconde o proprietário. Resultado pronto para copiar e colar.",

  keywords: ["gist pin github", "github gist card", "gist readme", "destacar gist github", "gist pin", "cartão gist github", "personalizar gist readme", "gist no readme", "ferramenta gist github", "nice readme gist"],

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
    title: "Gist Pin – Destaca os teus Gists no README do GitHub",
    description: "Transforma os teus Gists em cartões elegantes para o perfil. Personaliza tema, bordas, idioma e mais. Fácil de usar e sem código.",
    url: "https://nice-readme.vercel.app/gist-pins",
    siteName: "Nice Readme",
    images: [
      {
        url: "/gist-pin.png",
        width: 1200,
        height: 630,
        alt: "Exemplo de cartão Gist criado com Nice Readme"
      }
    ],
    locale: "pt_PT",
    type: "website"
  },

  twitter: {
    card: "summary_large_image",
    title: "Gist Pin – Mostra os teus Gists com estilo no GitHub",
    description: "Cartões personalizados para Gists. Tema claro/escuro, bordas arredondadas, idiomas e mais. Rápido e grátis.",
    images: ["/gist-pin.png"],
    creator: "@heliocarlitoss"
  },

  alternates: {
    canonical: "https://nice-readme.vercel.app/gist-pins"
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
      <GistPin />
      <ReportarBug />
    </>
  )
}
