import AnoActual from "../automatizados/anoactual/anoactual"
import { Botao } from "../btn/botao/botao"
import "./footer.css"

export function Footer() {
  return (
    <>
      <footer className="footer">
        <p>
          &copy; <AnoActual /> | Nice Readme
        </p>

        <Botao href="https://github.com/heliocarlitos/formatacao-e-sintaxe-basica-do-github" target="_blank" content="Github Sintaxe" />
      </footer>
    </>
  )
}
