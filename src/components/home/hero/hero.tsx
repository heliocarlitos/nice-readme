import { Botao } from "@/components/btn/botao/botao"
import "./hero.css"
import { PiStarFourFill } from "react-icons/pi"
import { FaGithub, FaLeftLong, FaRightLeft } from "react-icons/fa6"
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
        <h1>Criador de Readme Maning Nices</h1>
        <p className="text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio aliquid quas fugiat eligendi harum magni magnam optio suscipit, totam quasi expedita rerum aliquam corrupti neque incidunt! Hic, maiores molestiae?</p>
        <div className="btn">
          <Botao
            className="btn-geral txunar"
            href="/readme"
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
