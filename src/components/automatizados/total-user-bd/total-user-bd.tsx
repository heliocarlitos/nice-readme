"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, getCountFromServer } from "firebase/firestore"

type Props = {
  onCount?: (total: number) => void
}

function formatCompactNumber(num: number): string {
  if (num < 1000) return num.toString()

  const units = ["", "K", "M", "B"]
  const exponent = Math.floor(Math.log10(num) / 3)
  const value = num / Math.pow(1000, exponent)

  return value.toFixed(value < 10 ? 1 : 0).replace(/\.0$/, "") + units[exponent]
}

export function TotalDeUsuariosBd({ onCount }: Props = {}) {
  const [count, setCount] = useState<number>(0)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const snapshot = await getCountFromServer(collection(db, "tool_usage"))
        const total = snapshot.data().count
        setCount(total)
        onCount?.(total)
      } catch (error) {
        console.error("Erro ao buscar contagem:", error)
        setCount(0)
        onCount?.(0)
      }
    }

    fetchCount()
  }, [onCount])

  return <span>{formatCompactNumber(count)}</span>
}
