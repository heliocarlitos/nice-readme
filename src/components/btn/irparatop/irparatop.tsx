"use client"

import { useEffect, useState } from "react"
import { IoArrowUp } from "react-icons/io5"
import { Botao } from "../botao/botao"
import "./irparatop.css"

export function IrparaTop() {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    function controlarScroll() {
      if (window.scrollY > 100) {
        setVisivel(true)
      } else {
        setVisivel(false)
      }
    }

    window.addEventListener("scroll", controlarScroll)
    return () => window.removeEventListener("scroll", controlarScroll)
  }, [])

  function irParaTopo() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  return (
    <Botao
      className={`ir-para-top ${visivel ? "visivel" : ""}`}
      onClick={irParaTopo}
      content={
        <div className="icon">
          <IoArrowUp />
        </div>
      }
    />
  )
}
