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
  onMouseUp?: () => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void
}

export function Botao({ className, content = "Botão", href, target = "_self", onClick, isActive = false, onMouseUp, onKeyDown }: BotaoProps) {
  const router = useRouter()

  function handleClick() {
    if (onClick) {
      onClick()
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
    <button type="button" className={fullClassName} onClick={handleClick} onMouseUp={onMouseUp} onKeyDown={onKeyDown} aria-label={`Ir para ${typeof content === "string" ? content : "página"}`}>
      {content}
    </button>
  )
}
