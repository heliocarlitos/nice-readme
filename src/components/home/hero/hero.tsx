import { Botao } from "@/components/btn/botao/botao"
import "./hero.css"
import { PiStarFourFill } from "react-icons/pi"
import { FaGithub } from "react-icons/fa6"
import { HiOutlineArrowSmRight } from "react-icons/hi"

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
          <h1>Criador de Stats</h1>
          <p className="text">O Nice Readme é uma ferramenta para criar e personalizar estatísticas do GitHub. Ideal para developers que querem um perfil mais organizado. Eu criei esse projecto para ajudar quem esta iniciando no GitHub, quem tem dificuldades de entender documentações mas gostaria de deixar seu README mais limpo, organizado e profissional, sem precisar escrever código.</p>
          <div className="btn">
            <Botao
              className="btn-geral txunar"
              href="/streak-stats"
              content={
                <>
                  Txunar meu readme
                  <div className="icon">
                    <HiOutlineArrowSmRight />
                  </div>
                </>
              }
            />

            <Botao
              className="github"
              href="https://github.com/heliocarlitos/nice-readme"
              target="_blank"
              content={
                <>
                  <div className="icon">
                    <FaGithub />
                  </div>
                  Github
                </>
              }
            />
          </div>
        </div>
      </section>
    </>
  )
}
