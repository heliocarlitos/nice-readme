"use client"

import { useEffect, useState } from "react"
import "./userimg.css"

interface UserImgProps {
  url: string
}

export function UserImg({ url }: UserImgProps) {
  const [nome, setNome] = useState<string | null>(null)

  useEffect(() => {
    fetch(`https://api.github.com/users/${url}`)
      .then(res => res.json())
      .then(data => {
        setNome(data.name)
      })
      .catch(() => {
        setNome(null)
      })
  }, [url])

  return (
    <figure className="userimg">
      <img src={`https://github.com/${url}.png`} alt={`Foto de perfil de ${nome ?? url} no GitHub`} width={100} height={100} />
    </figure>
  )
}
