import { TitleSection } from "@/components/intro/title-section/title-section"
import "./todos-usuarios.css"
import { GridTodosUsuarios } from "@/components/grid/grid-todos-usuarios/grid-todos-usuarios"

export default function Page() {
  return (
    <>
      <section className="todos-usuarios">
        <TitleSection title="Todos usuários do github que usaram essa ferramenta." text="Todas contas do GitHub (pessoas e organizações) que utilizaram esta ferramenta em seus projectos públicos" />

        <GridTodosUsuarios />
      </section>
    </>
  )
}
