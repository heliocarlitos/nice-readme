import "./hero.css"
import { PiStarFourFill } from "react-icons/pi"
import { UsersGithub } from "../users-github/users-github"
import { Botao } from "@/components/btn/botao/botao"
import RepoStars from "@/components/automatizados/total-estrelas-github/total-estrelas-github"
import { GoStar } from "react-icons/go"

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

          <Botao
            className="star-github"
            target="_blank"
            href="https://github.com/heliocarlitos/nice-readme/stargazers"
            content={
              <>
                Estrela no GitHub
                <div className="icon">
                  <GoStar />
                </div>
                <RepoStars />
              </>
            }
          />
        </div>
      </section>
    </>
  )
}
