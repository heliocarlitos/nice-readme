"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import "./stats.css"

import { CodeCard } from "@/components/card/codecard/codecard"

import { db } from "@/lib/firebase"
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"

interface BooleanSelectProps {
  id: string
  label: string
  value: boolean
  onChange: (value: boolean) => void
}

async function checkGitHubUserExists(username: string): Promise<boolean> {
  if (!username.trim()) return false
  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username.trim())}`)
    return res.status === 200
  } catch {
    return false
  }
}

async function checkUsageExists(username: string): Promise<boolean> {
  try {
    const q = query(collection(db, "tool_usage"), where("username", "==", username.trim().toLowerCase()), where("tool", "==", "gist-pin"))
    const snapshot = await getDocs(q)
    return !snapshot.empty
  } catch {
    return false
  }
}

export function GistPin() {
  const [gistId, setGistId] = useState("")
  const [username, setUsername] = useState("")
  const [theme, setTheme] = useState("default")
  const [hideBorder, setHideBorder] = useState(false)
  const [borderRadius, setBorderRadius] = useState(4.5)
  const [locale, setLocale] = useState("pt-br")
  const [showOwner, setShowOwner] = useState(false)

  const [imageUrl, setImageUrl] = useState("")
  const [markdown, setMarkdown] = useState("")
  const [loading, setLoading] = useState(false)
  const [userExists, setUserExists] = useState(true)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    if (!username.trim()) {
      setUserExists(true)
      return
    }

    timeoutRef.current = setTimeout(async () => {
      const exists = await checkGitHubUserExists(username)
      setUserExists(exists)
    }, 500)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [username])

  const buildImageUrl = useCallback(() => {
    if (!gistId.trim()) return ""

    const params = new URLSearchParams({
      id: gistId.trim(),
      theme,
      hide_border: String(hideBorder),
      border_radius: String(borderRadius),
      card_width: "466",
      locale
    })

    if (showOwner) params.append("show_owner", "true")

    return `https://helio-github-stats.vercel.app/api/gist?${params.toString()}`
  }, [gistId, theme, hideBorder, borderRadius, locale, showOwner])

  useEffect(() => {
    if (!userExists) {
      setImageUrl("")
      setMarkdown("")
      setLoading(false)
      return
    }

    const url = buildImageUrl()
    if (!url) {
      setImageUrl("")
      setMarkdown("")
      setLoading(false)
      return
    }

    setLoading(true)
    setImageUrl(url)

    const md = `[![Gist Card](${url})](https://gist.github.com/${gistId.trim()})`
    setMarkdown(md)

    const img = new Image()
    img.onload = () => setLoading(false)
    img.onerror = () => setLoading(false)
    img.src = url
  }, [buildImageUrl, gistId, userExists])

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)

      if (!username.trim()) return

      const cleanUsername = username.trim().toLowerCase()

      const existsOnGitHub = await checkGitHubUserExists(username)
      if (!existsOnGitHub) return

      const existsInDb = await checkUsageExists(cleanUsername)
      if (existsInDb) return

      await addDoc(collection(db, "tool_usage"), {
        username: cleanUsername,
        tool: "gist-pin",
        timestamp: new Date()
      })
    } catch {}
  }

  const BooleanSelect = ({ id, label, value, onChange }: BooleanSelectProps) => (
    <div className="input-box">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value ? "true" : "false"} onChange={e => onChange(e.target.value === "true")}>
        <option value="false">Não</option>
        <option value="true">Sim</option>
      </select>
    </div>
  )

  return (
    <section className="stats">
      <div className="container">
        <div className="intro">
          <h2>Propriedades</h2>
        </div>

        <div className="content">
          <div className="box">
            <div className={`input-box ${!userExists ? "input-error" : ""}`}>
              <label htmlFor="username">
                Nome de utilizador do GitHub <span>*</span>
              </label>
              <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value.trim())} placeholder="heliocarlitos" />
              {!userExists && <span className="error-message">Utilizador não encontrado no GitHub</span>}
            </div>

            <div className="input-box">
              <label htmlFor="gist_id">
                ID do Gist <span>*</span>
              </label>
              <input type="text" id="gist_id" value={gistId} onChange={e => setGistId(e.target.value.trim())} placeholder="709fbee67b48e330507b9b7f10fef16f" />
            </div>
          </div>

          <div className="box">
            <div className="input-box">
              <label htmlFor="theme">Tema</label>
              <select id="theme" value={theme} onChange={e => setTheme(e.target.value)}>
                <option value="default">Default</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <BooleanSelect id="hide_border" label="Ocultar borda" value={hideBorder} onChange={setHideBorder} />
          </div>

          <div className="box">
            <div className="input-box">
              <label htmlFor="border_radius">Raio da borda</label>
              <input type="number" id="border_radius" step="0.1" min="0" value={borderRadius} onChange={e => setBorderRadius(parseFloat(e.target.value) || 0)} />
            </div>

            <div className="input-box">
              <label htmlFor="locale">Idioma</label>
              <select id="locale" value={locale} onChange={e => setLocale(e.target.value)}>
                <option value="pt-br">Português (Brasil)</option>
                <option value="pt-pt">Português (Portugal)</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <div className="box">
            <BooleanSelect id="show_owner" label="Mostrar proprietário" value={showOwner} onChange={setShowOwner} />
          </div>
        </div>
      </div>

      <div className="container">
        <div className="intro">
          <h2>Pré-visualização</h2>
        </div>

        <div className="content">
          <div className="bag-code">
            {loading && <p>A carregar...</p>}

            {imageUrl && userExists && !loading && (
              <>
                <figure>
                  <img
                    src={imageUrl}
                    alt="Pré-visualização do Gist Pin"
                    loading="lazy"
                    onError={e => {
                      ;(e.target as HTMLImageElement).alt = "Erro ao carregar."
                    }}
                  />
                </figure>

                <CodeCard code={markdown} lang="Markdown" onCopy={() => handleCopy(markdown)} />

                <CodeCard code={`<img src="${imageUrl}" alt="Gist Card" loading="lazy" />`} lang="HTML" onCopy={() => handleCopy(`<img src="${imageUrl}" alt="Gist Card" loading="lazy" />`)} />
              </>
            )}

            {!imageUrl && !loading && <p>Introduz o ID do Gist para ver a pré-visualização.</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
