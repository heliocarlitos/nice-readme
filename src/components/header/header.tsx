"use client"

import { usePathname } from "next/navigation"
import { FaGithub } from "react-icons/fa6"
import { Botao } from "../btn/botao/botao"
import "./header.css"
import { MenuMobile } from "../btn/menumobile/menumobile"

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
              <Botao content="Streak" href="/streak-stats" isActive={pathname === "/streak-stats"} />
            </li>
            <li>
              <Botao content="Stats" href="/stats" isActive={pathname === "/stats"} />
            </li>
            <li>
              <Botao content="Pins" href="/extra-pins" isActive={pathname === "/extra-pins"} />
            </li>
            <li>
              <Botao content="Badges" href="/badges" isActive={pathname === "/badges"} />
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

          <MenuMobile />
        </div>
      </header>
    </>
  )
}
