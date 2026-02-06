"use client"

import { usePathname } from "next/navigation"
import { FaGithub } from "react-icons/fa6"
import { Botao } from "../btn/botao/botao"
import "./header.css"
import { MenuMobile } from "../btn/menumobile/menumobile"
import { BtnTheme } from "../btn/btntheme/btntheme"

export function Header() {
  const pathname = usePathname()

  return (
    <>
      <header className="header">
        <nav>
          <ul>
            <li>
              <Botao content="Home" href="/" isActive={pathname === "/"} />
            </li>
            <li>
              <Botao content="Badges" href="/badges" isActive={pathname === "/badges"} />
            </li>
            <li>
              <Botao content="Perfil Views" href="/views-badge" isActive={pathname === "/views-badge"} />
            </li>
            <li>
              <Botao content="Streak" href="/streak-stats" isActive={pathname === "/streak-stats"} />
            </li>
            <li>
              <Botao content="Stats" href="/github-stats" isActive={pathname === "/github-stats"} />
            </li>
            <li>
              <Botao content="Top Langs" href="/top-langs" isActive={pathname === "/top-langs"} />
            </li>
            <li>
              <Botao content="Repo Pin" href="/repo-pins" isActive={pathname === "/repo-pins"} />
            </li>
            <li>
              <Botao content="Gist Pin" href="/gist-pins" isActive={pathname === "/gist-pins"} />
            </li>
            <li>
              <Botao content="Wakatime" href="/wakatime" isActive={pathname === "/wakatime"} />
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
          <BtnTheme />
          <MenuMobile />
        </div>
      </header>
    </>
  )
}
