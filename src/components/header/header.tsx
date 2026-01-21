import { FaGithub } from "react-icons/fa6"
import { Botao } from "../btn/botao/botao"
import "./header.css"

export function Header() {
  return (
    <>
      <header className="header">
        <nav>
          <ul>
            <li>
              <Botao content="Home" href="/" />
            </li>
            <li>
              <Botao content="Readme" href="/readme" />
            </li>
            <li>
              <Botao content="Documentação" />
            </li>
          </ul>
        </nav>

        <div className="btn">
          <Botao
            className="github"
            href="https://github.com/heliocarlitos/nice-readme"
            target="_blank"
            content={
              <>
                <div className="icon">
                  <FaGithub />
                </div>
              </>
            }
          />
        </div>
      </header>
    </>
  )
}
