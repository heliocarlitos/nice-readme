import { Botao } from "@/components/btn/botao/botao"
import "./hero.css"
import { PiStarFourFill } from "react-icons/pi"
import { FaGithub } from "react-icons/fa6"
import { HiOutlineArrowSmRight } from "react-icons/hi"

export function Hero() {
  return (
    <>
      <section className="hero">
        <div className="tag_">
          <div className="icon">
            <PiStarFourFill />
          </div>
          <p>Melhore seu README.md</p>
        </div>
        <h1>Criador de Readme</h1>
        <p className="text">O Nice Readme é uma ferramenta intuitiva para criar e personalizar estatísticas do GitHub directamente no seu README. Oferece suporte a cartões de sequência, temas, cores, idiomas e pré-visualização em tempo real, tudo numa interface simples e visual. Ideal para developers que querem um perfil mais atrativo e profissional.</p>
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
      </section>
    </>
  )
}
