"use client"

import { ReactNode } from "react"
import { useRouter } from "next/navigation"
import "./botao.css"

interface BotaoProps {
  className?: string
  content?: ReactNode
  href?: string
  target?: "_self" | "_blank"
  onClick?: () => void
  isActive?: boolean
}

export function Botao({ className, content = "Botão", href, target = "_self", onClick, isActive = false }: BotaoProps) {
  const router = useRouter()

  function handleClick() {
    if (onClick) {
      onClick()
      return
    }

    if (!href) return

    if (target === "_blank") {
      window.open(href, "_blank")
      return
    }

    router.push(href)
  }

  const activeClass = isActive ? "active" : ""
  const fullClassName = `botao ${activeClass} ${className || ""}`.trim()

  return (
    <button type="button" className={fullClassName} onClick={handleClick} aria-label={`Ir para ${typeof content === "string" ? content : "página"}`}>
      {content}
    </button>
  )
}
