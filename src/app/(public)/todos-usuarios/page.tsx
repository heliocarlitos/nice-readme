import type { Metadata } from "next"
import { TitleSection } from "@/components/intro/title-section/title-section"
import "./todos-usuarios.css"
import { GridTodosUsuarios } from "@/components/grid/grid-todos-usuarios/grid-todos-usuarios"

export const metadata: Metadata = {
  metadataBase: new URL("https://nice-readme.vercel.app"),

  title: "Todos os utilizadores GitHub | Nice Readme",
  description: "Lista completa de utilizadores e organizações GitHub que já utilizaram a ferramenta Nice Readme para personalizar o seu perfil e README. Veja perfis reais que adoptaram streaks, estatísticas e badges.",

  keywords: ["utilizadores nice readme", "todos usuários github", "perfis github nice readme", "quem usa nice readme", "utilizadores github stats", "perfis github personalizados", "comunidade nice readme", "github readme tool users"],

  openGraph: {
    title: "Todos os utilizadores GitHub que usam Nice Readme",
    description: "Descobre quem já personalizou o seu perfil GitHub com streaks, estatísticas, badges e repositórios destacados usando a ferramenta Nice Readme.",
    url: "https://nice-readme.vercel.app/todos-usuarios",
    siteName: "Nice Readme",
    images: [
      {
        url: "/todos-usuarios.png",
        width: 1200,
        height: 630,
        alt: "Lista de utilizadores GitHub que utilizaram Nice Readme"
      }
    ],
    locale: "pt_PT",
    type: "website"
  },

  twitter: {
    card: "summary_large_image",
    title: "Todos os utilizadores GitHub | Nice Readme",
    description: "Veja os perfis reais de quem já adoptou streaks, estatísticas e badges com Nice Readme.",
    images: ["/todos-usuarios.png"],
    creator: "@heliocarlitos"
  },

  alternates: {
    canonical: "https://nice-readme.vercel.app/todos-usuarios"
  },

  robots: {
    index: true,
    follow: true
  }
}

export default function Page() {
  return (
    <>
      <section className="todos-usuarios">
        <TitleSection title="Todos os utilizadores GitHub" text="Contas reais (pessoas e organizações) que já utilizaram esta ferramenta para melhorar o seu perfil e README público" />

        <GridTodosUsuarios />
      </section>
    </>
  )
}
