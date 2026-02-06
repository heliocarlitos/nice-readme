"use client"

import { useState, useEffect, useRef } from "react"
import "./stats.css"
import { CodeCard } from "@/components/card/codecard/codecard"
import { Botao } from "@/components/btn/botao/botao"
import { MdOpenInNew } from "react-icons/md"

import { db } from "@/lib/firebase"
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"

const TOOL_URL = "https://nice-readme.vercel.app/views-badge"

const PROFILE_STYLES = ["flat", "flat-square", "plastic", "for-the-badge"] as const

type ProfileStyle = (typeof PROFILE_STYLES)[number]

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
    const q = query(collection(db, "tool_usage"), where("username", "==", username.trim().toLowerCase()), where("tool", "==", "profile-views"))
    const snapshot = await getDocs(q)
    return !snapshot.empty
  } catch {
    return false
  }
}

export function ViewsBadge() {
  const [username, setUsername] = useState("")
  const [label, setLabel] = useState("Visualizações")
  const [color, setColor] = useState("blue")
  const [style, setStyle] = useState<ProfileStyle>("for-the-badge")
  const [base, setBase] = useState("")
  const [abbreviated, setAbbreviated] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")

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
    }, 1000)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [username])

  useEffect(() => {
    if (!userExists) {
      setImageUrl("")
      setMarkdown("")
      setLoading(false)
      return
    }

    if (!username.trim()) {
      setImageUrl("")
      setMarkdown("")
      setLoading(false)
      return
    }

    setLoading(true)

    const params = new URLSearchParams({
      username: username.trim()
    })

    if (label.trim() && label.trim() !== "Visualizações") params.append("label", label.trim())
    if (color.trim() && color.trim() !== "blue") params.append("color", color.trim())
    params.append("style", style)
    if (base.trim()) params.append("base", base.trim())
    if (abbreviated) params.append("abbreviated", "true")

    const url = `https://komarev.com/ghpvc/?${params.toString()}`
    setImageUrl(url)

    // Se o utilizador não definir linkUrl, usa o link da ferramenta
    const finalLink = linkUrl.trim() || TOOL_URL

    const md = `[![${label}](${url})](${finalLink})`
    setMarkdown(md)

    const img = new Image()
    img.onload = () => setLoading(false)
    img.onerror = () => setLoading(false)
    img.src = url
  }, [username, label, color, style, base, abbreviated, userExists, linkUrl])

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
        tool: "profile-views",
        timestamp: new Date()
      })
    } catch {}
  }

  return (
    <section className="stats">
      <div className="container">
        <div className="intro">
          <h2>Propriedades</h2>
        </div>

        {username.trim() && userExists && (
          <div className="info">
            <p>
              As visualizações começam a ser contadas depois de adicionares o badge ao teu README e actualizares a página.
              <Botao
                href={`https://github.com/${username}/edit/main/README.md`}
                target="_blank"
                content={
                  <>
                    Adicionar agora
                    <div className="icon">
                      <MdOpenInNew />
                    </div>
                  </>
                }
              />
            </p>
          </div>
        )}

        <div className="content">
          <div className={`input-box ${!userExists ? "input-error" : ""}`}>
            <label htmlFor="username">
              Nome de utilizador <span>*</span>
            </label>
            <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value.trim())} placeholder="ex: heliocarlitos" />
            {!userExists && <span className="error-message">Utilizador não encontrado no GitHub</span>}
          </div>

          <div className="box">
            <div className="input-box">
              <label htmlFor="label">Rótulo</label>
              <input type="text" id="label" value={label} onChange={e => setLabel(e.target.value)} placeholder="ex: Visualizações" />
            </div>

            <div className="input-box">
              <label htmlFor="color">Cor do fundo (nome ou HEX)</label>
              <input type="text" id="color" value={color} onChange={e => setColor(e.target.value.trim())} placeholder="ex: blue, #007ec6" />
            </div>
          </div>

          <div className="box">
            <div className="input-box">
              <label htmlFor="style">Estilo</label>
              <select id="style" value={style} onChange={e => setStyle(e.target.value as ProfileStyle)}>
                {PROFILE_STYLES.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-box">
              <label htmlFor="base">Número base (opcional)</label>
              <input type="number" id="base" min="0" value={base} onChange={e => setBase(e.target.value)} placeholder="ex: 1000" />
            </div>
          </div>

          <div className="box">
            <div className="input-box">
              <label htmlFor="abbreviated">Abreviar número (ex: 1.2K)</label>
              <select id="abbreviated" value={abbreviated ? "true" : "false"} onChange={e => setAbbreviated(e.target.value === "true")}>
                <option value="false">Não</option>
                <option value="true">Sim</option>
              </select>
            </div>

            <div className="input-box">
              <label htmlFor="linkUrl">Link ao clicar (opcional)</label>
              <input type="url" id="linkUrl" value={linkUrl} onChange={e => setLinkUrl(e.target.value.trim())} placeholder="ex: https://exemplo.com" />
            </div>
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
                  <a href={linkUrl.trim() || TOOL_URL} target="_blank" rel="noopener noreferrer">
                    <img
                      src={imageUrl}
                      alt="Pré-visualização do badge de visualizações"
                      loading="lazy"
                      onError={e => {
                        ;(e.target as HTMLImageElement).alt = "Erro ao carregar."
                      }}
                    />
                  </a>
                </figure>

                <CodeCard code={markdown} lang="Markdown" onCopy={() => handleCopy(markdown)} />

                <CodeCard code={`<a href="${linkUrl.trim() || TOOL_URL}" target="_blank" rel="noopener noreferrer"><img src="${imageUrl}" alt="${label}" loading="lazy" /></a>`} lang="HTML" onCopy={() => handleCopy(`<a href="${linkUrl.trim() || TOOL_URL}" target="_blank" rel="noopener noreferrer"><img src="${imageUrl}" alt="${label}" loading="lazy" /></a>`)} />
              </>
            )}

            {!imageUrl && !loading && <p>Introduz o nome de utilizador para ver a pré-visualização.</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
