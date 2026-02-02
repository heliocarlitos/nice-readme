"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs, query } from "firebase/firestore"

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
    const fetchUniqueUserCount = async () => {
      try {
        const q = query(collection(db, "tool_usage"))
        const snapshot = await getDocs(q)
        const usernames = new Set<string>()

        snapshot.docs.forEach(doc => {
          const data = doc.data()
          if (data.username && typeof data.username === "string") {
            usernames.add(data.username.trim().toLowerCase())
          }
        })

        const total = usernames.size
        setCount(total)
        onCount?.(total)
      } catch (error) {
        console.error("Erro ao buscar contagem de utilizadores únicos:", error)
        setCount(0)
        onCount?.(0)
      }
    }

    fetchUniqueUserCount()
  }, [onCount])

  return <span>{formatCompactNumber(count)}</span>
}
