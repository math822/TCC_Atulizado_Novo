"use client"

import { useEffect, useRef, useState } from "react"

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: string
}

export default function Reveal({
  children,
  className = "",
  delay = 0,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisivel(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const Tag = as as any

  return (
    <Tag
      ref={ref as any}
      className={`reveal ${visivel ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}
