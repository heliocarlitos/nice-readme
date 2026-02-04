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

async function checkGitHubRepoExists(username: string, repo: string): Promise<boolean> {
  if (!username.trim() || !repo.trim()) return false
  try {
    const res = await fetch(`https://api.github.com/repos/${encodeURIComponent(username.trim())}/${encodeURIComponent(repo.trim())}`)
    return res.status === 200
  } catch {
    return false
  }
}

async function checkUsageExists(username: string): Promise<boolean> {
  try {
    const q = query(collection(db, "tool_usage"), where("username", "==", username.trim().toLowerCase()), where("tool", "==", "repo-pin"))
    const snapshot = await getDocs(q)
    return !snapshot.empty
  } catch {
    return false
  }
}

export function RepoPin() {
  const [repoUrl, setRepoUrl] = useState("")
  const [theme, setTheme] = useState("default")
  const [hideBorder, setHideBorder] = useState(false)
  const [borderRadius, setBorderRadius] = useState(4.5)
  const [showOwner, setShowOwner] = useState(false)

  const [imageUrl, setImageUrl] = useState("")
  const [markdown, setMarkdown] = useState("")
  const [loading, setLoading] = useState(false)
  const [userExists, setUserExists] = useState(true)
  const [repoExists, setRepoExists] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const parseRepoUrl = (url: string) => {
    try {
      const cleanUrl = url.trim().replace(/\/$/, "")
      const match = cleanUrl.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)/)
      if (match) return { username: match[1], repo: match[2] }
    } catch {}
    return null
  }

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    const parsed = parseRepoUrl(repoUrl)
    if (!parsed || !parsed.username.trim() || !parsed.repo.trim()) {
      setUserExists(true)
      setRepoExists(true)
      setErrorMessage("")
      return
    }

    timeoutRef.current = setTimeout(async () => {
      const userResult = await checkGitHubUserExists(parsed.username)
      setUserExists(userResult)

      if (!userResult) {
        setErrorMessage("Utilizador não encontrado no GitHub")
        setRepoExists(true)
        return
      }

      const repoResult = await checkGitHubRepoExists(parsed.username, parsed.repo)
      setRepoExists(repoResult)

      if (!repoResult) {
        setErrorMessage("Repositório não encontrado ou privado")
      } else {
        setErrorMessage("")
      }
    }, 500)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [repoUrl])

  const CARD_WIDTH = 466

  const buildImageUrl = useCallback(() => {
    const parsed = parseRepoUrl(repoUrl)
    if (!parsed) return ""

    const { username, repo } = parsed

    const params = new URLSearchParams({
      username,
      repo,
      theme,
      hide_border: String(hideBorder),
      border_radius: String(borderRadius),
      card_width: String(CARD_WIDTH)
    })

    if (showOwner) params.append("show_owner", "true")

    return `https://helio-github-stats.vercel.app/api/pin?${params.toString()}`
  }, [repoUrl, theme, hideBorder, borderRadius, showOwner])

  useEffect(() => {
    if (!userExists || !repoExists) {
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

    const parsed = parseRepoUrl(repoUrl)
    if (parsed) {
      const md = `[![${parsed.repo}](${url})](https://github.com/${parsed.username}/${parsed.repo})`
      setMarkdown(md)
    }

    const img = new Image()
    img.onload = () => setLoading(false)
    img.onerror = () => setLoading(false)
    img.src = url
  }, [buildImageUrl, repoUrl, userExists, repoExists])

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)

      const parsed = parseRepoUrl(repoUrl)
      if (!parsed) return

      const cleanUsername = parsed.username.trim().toLowerCase()

      const existsOnGitHub = await checkGitHubUserExists(parsed.username)
      if (!existsOnGitHub) return

      const repoExistsCheck = await checkGitHubRepoExists(parsed.username, parsed.repo)
      if (!repoExistsCheck) return

      const existsInDb = await checkUsageExists(cleanUsername)
      if (existsInDb) return

      await addDoc(collection(db, "tool_usage"), {
        username: cleanUsername,
        tool: "repo-pin",
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
          <div className={`input-box ${!userExists || !repoExists ? "input-error" : ""}`}>
            <label htmlFor="repo_url">
              URL do repositório <span>*</span>
            </label>
            <input type="text" id="repo_url" value={repoUrl} onChange={e => setRepoUrl(e.target.value.trim())} placeholder="https://github.com/heliocarlitos/nice-readme" />
            {(!userExists || !repoExists) && <span className="error-message">{errorMessage || "URL inválida ou repositório não encontrado"}</span>}
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

            {imageUrl && userExists && repoExists && !loading && (
              <>
                <figure>
                  <img
                    src={imageUrl}
                    alt="Pré-visualização do Repositório Pin"
                    width={CARD_WIDTH}
                    height="auto"
                    loading="lazy"
                    onError={e => {
                      ;(e.target as HTMLImageElement).alt = "Erro ao carregar."
                    }}
                  />
                </figure>

                <CodeCard code={markdown} lang="Markdown" onCopy={() => handleCopy(markdown)} />

                <CodeCard code={`<img src="${imageUrl}" alt="Repositório Pin" width="${CARD_WIDTH}" height="auto" loading="lazy" />`} lang="HTML" onCopy={() => handleCopy(`<img src="${imageUrl}" alt="Repositório Pin" width="${CARD_WIDTH}" height="auto" loading="lazy" />`)} />
              </>
            )}

            {!imageUrl && !loading && <p>Introduz a URL completa do repositório para ver a pré-visualização.</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
