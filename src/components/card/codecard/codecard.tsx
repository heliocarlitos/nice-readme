"use client"

import { ReactNode, useState } from "react"
import "./codecard.css"
import { LuCopy, LuCopyCheck } from "react-icons/lu"

interface CodeCardProps {
  code?: ReactNode
  lang?: string
  onCopy?: () => void // ← nova prop
}

export function CodeCard({ code, lang, onCopy }: CodeCardProps) {
  const [copiado, setCopiado] = useState(false)

  function copiarCodigo() {
    if (!code) return

    const texto = typeof code === "string" ? code : (code as any)?.props?.children?.toString() || ""

    navigator.clipboard.writeText(texto).then(() => {
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)

      // Chama o callback se existir
      if (onCopy) onCopy()
    })
  }

  function impedirSeleccao(e: React.SyntheticEvent) {
    e.preventDefault()
  }

  return (
    <div className="codecard">
      <div className="btn">
        <p className="tt">{lang}</p>
        <button type="button" onClick={copiarCodigo}>
          {copiado ? <LuCopyCheck /> : <LuCopy />}
        </button>
      </div>
      <code onMouseDown={impedirSeleccao} onSelect={impedirSeleccao} onDragStart={impedirSeleccao}>
        {code}
      </code>
    </div>
  )
}
