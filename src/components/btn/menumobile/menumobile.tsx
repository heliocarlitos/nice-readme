"use client"

import { HiMenuAlt4, HiOutlineX } from "react-icons/hi"
import "./menumobile.css"
import { FaGithub } from "react-icons/fa6"
import { usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { Botao } from "../botao/botao"

export function MenuMobile() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMenuOpen(prev => !prev)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node) && btnRef.current && !btnRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="menumobile">
      <button ref={btnRef} className="btn-menu" onClick={toggleMenu} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen}>
        <div className="icon">
          <HiMenuAlt4 className={`open-menu ${menuOpen ? "hidden" : ""}`} />
          <HiOutlineX className={`close-menu ${menuOpen ? "" : "hidden"}`} />
        </div>
      </button>

      <div className={`content ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <nav className={`nav ${menuOpen ? "open" : ""}`} ref={navRef}>
          <Botao className="link" href="/" content="Home" isActive={pathname === "/"} onClick={closeMenu} />
          <Botao className="link" href="/badges" content="Badges" isActive={pathname === "/badges"} onClick={closeMenu} />
          <Botao className="link" href="/views-badge" content="Perfil view" isActive={pathname === "/views-badge"} onClick={closeMenu} />
          <Botao className="link" href="/badges" content="Badges" isActive={pathname === "/badges"} onClick={closeMenu} />
          <Botao className="link" href="/streak-stats" content="Streak" isActive={pathname === "/streak-stats"} onClick={closeMenu} />
          <Botao className="link" href="/github-stats" content="Stats" isActive={pathname === "/github-stats"} onClick={closeMenu} />
          <Botao className="link" href="/wakatime" content="Wakatime" isActive={pathname === "/wakatime"} onClick={closeMenu} />

          <Botao
            href="https://github.com/hutauta"
            target="_blank"
            className="github"
            content={
              <>
                <div className="icon">
                  <FaGithub />
                </div>
                <p>Github</p>
              </>
            }
            onClick={closeMenu}
          />
        </nav>
      </div>
    </div>
  )
}
