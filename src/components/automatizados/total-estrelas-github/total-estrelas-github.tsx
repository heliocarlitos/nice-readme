"use client"

import { useEffect, useState } from "react"

function formatCompactNumber(num: number): string {
  if (num < 1000) return num.toString()

  const units = ["", "K", "M", "B"]
  const exponent = Math.floor(Math.log10(num) / 3)
  const value = num / Math.pow(1000, exponent)

  return value.toFixed(value < 10 ? 1 : 0).replace(/\.0$/, "") + units[exponent]
}

export default function RepoStars() {
  const [display, setDisplay] = useState("...")

  useEffect(() => {
    fetch("https://api.github.com/repos/heliocarlitos/nice-readme")
      .then(r => r.json())
      .then(data => {
        const count = data.stargazers_count
        if (typeof count === "number") {
          setDisplay(formatCompactNumber(count))
        } else {
          setDisplay("—")
        }
      })
      .catch(() => setDisplay("—"))
  }, [])

  return <>{display}</>
}
