"use client"

import { useEffect, useRef } from "react"

export default function SiteEffects() {
  const progressRef = useRef<HTMLDivElement | null>(null)
  const glowRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const finePointer = window.matchMedia("(pointer: fine)").matches

    let ticking = false
    function atualizarProgresso() {
      const el = progressRef.current
      if (!el) return
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progresso = max > 0 ? Math.min(window.scrollY / max, 1) : 0
      el.style.setProperty("--progress", progresso.toString())
      ticking = false
    }

    function aoRolar() {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(atualizarProgresso)
      }
    }

    atualizarProgresso()
    window.addEventListener("scroll", aoRolar, { passive: true })
    window.addEventListener("resize", aoRolar, { passive: true })

    let glowFrame = 0
    function aoMover(evento: MouseEvent) {
      const glow = glowRef.current
      if (!glow) return
      glow.classList.add("is-active")
      cancelAnimationFrame(glowFrame)
      glowFrame = requestAnimationFrame(() => {
        glow.style.transform = `translate(${evento.clientX}px, ${evento.clientY}px)`
      })
    }

    if (finePointer && !reduce) {
      window.addEventListener("mousemove", aoMover, { passive: true })
    }

    return () => {
      window.removeEventListener("scroll", aoRolar)
      window.removeEventListener("resize", aoRolar)
      window.removeEventListener("mousemove", aoMover)
      cancelAnimationFrame(glowFrame)
    }
  }, [])

  return (
    <>
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
      <div ref={progressRef} className="scroll-progress" aria-hidden="true" />
    </>
  )
}
