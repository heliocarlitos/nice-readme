import "./hero.css"
import { PiStarFourFill } from "react-icons/pi"
import { UsersGithub } from "../users-github/users-github"

export function Hero() {
  return (
    <>
      <section className="hero">
        <div className="content">
          <div className="tag_">
            <div className="icon">
              <PiStarFourFill />
            </div>
            <p>Melhore seu README.md</p>
          </div>

          <h1>Nice Readme - Dedicado para readme e documentações do Github</h1>

          <p className="text">É uma ferramenta para criar e personalizar estatísticas, streak e badges do GitHub. Ideal para developers que querem um perfil mais organizado.</p>

          <div className="user-github">
            <p className="tt">Alguns perfis do Github já estão usando uma das nossas ferramentas</p>
            <UsersGithub />
          </div>
        </div>
      </section>
    </>
  )
}
