import Lenis, { LenisOptions } from "lenis"
import { useEffect, useRef, useCallback } from "react"

export const useLenis = (options?: LenisOptions): Lenis | null => {
  const lenisRef = useRef<Lenis | null>(null)
  const raf = useCallback((time: number) => {
    lenisRef.current?.raf(time)
    requestAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      ...options
    })

    lenisRef.current = lenis
    const animationFrameId = requestAnimationFrame(raf)
    return () => {
      lenis.destroy()
      lenisRef.current = null
      cancelAnimationFrame(animationFrameId)
    }
  }, [raf, options])

  return lenisRef.current
}
