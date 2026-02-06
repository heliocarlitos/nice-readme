"use client"

import { FC } from "react"

const AnoActual: FC = () => {
  const ano = new Date().getFullYear()

  return <span>{ano}</span>
}

export default AnoActual
