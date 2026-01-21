"use client"
import { ReactNode } from "react"
import { useLenis } from "@/hook/useLenis"

interface LenisWrapperProps {
  children: ReactNode
}

export function LenisWrapper({ children }: LenisWrapperProps) {
  useLenis({
    duration: 1.5,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
  })

  return <>{children}</>
}
