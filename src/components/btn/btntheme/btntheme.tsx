"use client"
import { useEffect, useState } from "react"
import "./btntheme.css"
import { IoSunny, IoMoon } from "react-icons/io5"

export function BtnTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const root = document.documentElement
    root.classList.remove("theme-loaded")
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null

    if (savedTheme === "light") {
      root.classList.remove("dark")
      root.classList.add("light")
      setTheme("light")
    } else {
      root.classList.remove("light")
      root.classList.add("dark")
      setTheme("dark")
      if (!savedTheme) localStorage.setItem("theme", "dark")
    }

    setTimeout(() => {
      root.classList.add("theme-loaded")
      setIsInitialized(true)
    }, 50)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    const root = document.documentElement
    root.style.transition = "none"
    root.classList.remove("light", "dark")
    root.classList.add(newTheme)
    void root.offsetWidth
    root.style.transition = ""
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
  }

  return (
    <button className={`theme-toggle ${!isInitialized ? "theme-toggle-loading" : ""}`} onClick={toggleTheme} aria-label="Mudar tema do site" type="button" aria-pressed={theme === "light"}>
      <div className={`icon icon-sun ${theme === "light" ? "icon-active" : "icon-inactive"}`}>
        <IoSunny />
      </div>
      <div className={`icon icon-moon ${theme === "dark" ? "icon-active" : "icon-inactive"}`}>
        <IoMoon />
      </div>
    </button>
  )
}
