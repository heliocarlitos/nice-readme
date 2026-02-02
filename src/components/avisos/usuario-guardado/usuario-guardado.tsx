"use client"
import { useEffect, useState } from "react"
import { Botao } from "@/components/btn/botao/botao"
import "./usuario-guardado.css"

const LOCALSTORAGE_KEY = "aceitou-aviso-dados-github"

export function UsuarioGuardado() {
  const [visivel, setVisivel] = useState(false)
  const [deveMontar, setDeveMontar] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(LOCALSTORAGE_KEY)) {
      return
    }

    const timer = setTimeout(() => {
      setDeveMontar(true)
      setTimeout(() => {
        setVisivel(true)
      }, 50)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  function aceitar() {
    localStorage.setItem(LOCALSTORAGE_KEY, "true")
    setVisivel(false)
  }

  function handleTransitionEnd() {
    if (!visivel) {
      setDeveMontar(false)
    }
  }

  if (!deveMontar) return null

  return (
    <div className={`usuario-guardado ${visivel ? "entrar" : "sair"}`} onTransitionEnd={handleTransitionEnd}>
      <p className="text">Ao usar uma ferramenta deste site, guardamos o teu @username do Github, nome e foto de perfil. Se não concorda com isso recomendamos que não use essa ferramenta.</p>

      <div className="btn">
        <Botao href="https://github.com/heliocarlitos/nice-readme/blob/main/privacidade.md" className="detal" content="Mais detalhes" target="_blank" />
        <Botao onClick={aceitar} className="aceitar" content="Compreendi" />
      </div>
    </div>
  )
}
