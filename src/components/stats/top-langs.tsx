"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import "./stats.css"

import { CodeCard } from "@/components/card/codecard/codecard"

import { db } from "@/lib/firebase"
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"
import { IoIosArrowDown } from "react-icons/io"

interface BooleanSelectProps {
  id: string
  label: string
  value: boolean
  onChange: (value: boolean) => void
}

const TOOL_URL = "https://nice-readme.vercel.app/top-langs"

const LAYOUTS = ["normal", "compact", "donut", "donut-vertical", "pie"] as const
const STATS_FORMATS = ["percentages", "bytes"] as const
const LANGS_THEMES = ["default", "dark"] as const

type LayoutType = (typeof LAYOUTS)[number]
type StatsFormat = (typeof STATS_FORMATS)[number]
type ThemeType = (typeof LANGS_THEMES)[number]

async function checkGitHubUserExists(username: string): Promise<boolean> {
  if (!username.trim()) return false

  try {
    const res = await fetch(`/api/check-user?username=${encodeURIComponent(username.trim())}`)
    const data = await res.json()
    return data.exists === true
  } catch {
    return false
  }
}

async function checkUsageExists(username: string): Promise<boolean> {
  try {
    const q = query(collection(db, "tool_usage"), where("username", "==", username.trim().toLowerCase()), where("tool", "==", "top-langs"))
    const snapshot = await getDocs(q)
    return !snapshot.empty
  } catch {
    return false
  }
}

export function TopLangs() {
  const [username, setUsername] = useState("")
  const [customTitle, setCustomTitle] = useState("Linguagens mais usadas")
  const [theme, setTheme] = useState<ThemeType>("default")
  const [hideBorder, setHideBorder] = useState(false)
  const [borderRadius, setBorderRadius] = useState(4.5)
  const [hideTitle, setHideTitle] = useState(false)
  const [hideLangs, setHideLangs] = useState("")
  const [layout, setLayout] = useState<LayoutType>("normal")
  const [langsCount, setLangsCount] = useState<number | "">("")
  const [disableAnimations, setDisableAnimations] = useState(false)
  const [hideProgress, setHideProgress] = useState(false)
  const [sizeWeight, setSizeWeight] = useState<number | "">("")
  const [countWeight, setCountWeight] = useState<number | "">("")
  const [statsFormat, setStatsFormat] = useState<StatsFormat>("percentages")
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

  const CARD_WIDTH = 466

  const buildImageUrl = useCallback(() => {
    if (!username.trim()) return ""

    const params = new URLSearchParams({
      username: username.trim(),
      layout,
      stats_format: statsFormat,
      theme,
      hide_border: String(hideBorder),
      border_radius: String(borderRadius),
      card_width: String(CARD_WIDTH),
      locale: "pt-br"
    })

    if (!hideTitle) params.append("custom_title", customTitle)
    if (hideLangs) params.append("hide", hideLangs)
    if (hideTitle) params.append("hide_title", "true")
    if (langsCount !== "") params.append("langs_count", String(langsCount))
    if (disableAnimations) params.append("disable_animations", "true")
    if (hideProgress) params.append("hide_progress", "true")
    if (sizeWeight !== "") params.append("size_weight", String(sizeWeight))
    if (countWeight !== "") params.append("count_weight", String(countWeight))

    return `https://helio-github-stats.vercel.app/api/top-langs?${params.toString()}`
  }, [username, customTitle, theme, hideBorder, borderRadius, hideTitle, hideLangs, layout, langsCount, disableAnimations, hideProgress, sizeWeight, countWeight, statsFormat])

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

    const finalLink = linkUrl.trim() || TOOL_URL

    const md = `[![${customTitle}](${url})](${finalLink})`
    setMarkdown(md)

    const img = new Image()
    img.onload = () => setLoading(false)
    img.onerror = () => setLoading(false)
    img.src = url
  }, [buildImageUrl, username, customTitle, userExists, linkUrl])

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
        tool: "top-langs",
        timestamp: new Date()
      })
    } catch {}
  }

  const BooleanSelect = ({ id, label, value, onChange }: BooleanSelectProps) => (
    <div className="input-box">
      <div className="icon icon-ajustado">
        <IoIosArrowDown />
      </div>
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
          <div className={`input-box ${!userExists ? "input-error" : ""}`}>
            <label htmlFor="username">
              Nome de utilizador <span>*</span>
            </label>
            <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value.trim())} placeholder="heliocarlitos" />
            {!userExists && <span className="error-message">Utilizador não encontrado no GitHub</span>}
          </div>

          <div className="box">
            <div className="input-box">
              <div className="icon icon-ajustado">
                <IoIosArrowDown />
              </div>
              <label htmlFor="theme">Tema</label>
              <select id="theme" value={theme} onChange={e => setTheme(e.target.value as ThemeType)}>
                {LANGS_THEMES.map(t => (
                  <option key={t} value={t}>
                    {t === "default" ? "Padrão" : "Escuro"}
                  </option>
                ))}
              </select>
            </div>

            <BooleanSelect id="hide_border" label="Ocultar borda" value={hideBorder} onChange={setHideBorder} />
          </div>

          <div className="box">
            <div className="input-box">
              <label htmlFor="border_radius">Raio da borda</label>
              <input type="number" id="border_radius" step="0.1" min="0" value={borderRadius} onChange={e => setBorderRadius(parseFloat(e.target.value) || 0)} />
            </div>

            {!hideTitle && (
              <div className="input-box">
                <label htmlFor="custom_title">Título personalizado</label>
                <input type="text" id="custom_title" value={customTitle} onChange={e => setCustomTitle(e.target.value)} placeholder="Linguagens mais usadas" />
              </div>
            )}
          </div>

          <div className="box">
            <BooleanSelect id="hide_title" label="Ocultar título" value={hideTitle} onChange={setHideTitle} />

            <BooleanSelect id="disable_animations" label="Desativar animações" value={disableAnimations} onChange={setDisableAnimations} />
          </div>

          <div className="box">
            <div className="input-box">
              <div className="icon icon-ajustado">
                <IoIosArrowDown />
              </div>
              <label htmlFor="layout">Layout</label>
              <select id="layout" value={layout} onChange={e => setLayout(e.target.value as LayoutType)}>
                {LAYOUTS.map(l => (
                  <option key={l} value={l}>
                    {l.charAt(0).toUpperCase() + l.slice(1).replace("-", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-box">
              <label htmlFor="langs_count">Nº de linguagens (1–20)</label>
              <input type="number" id="langs_count" min={1} max={20} value={langsCount} onChange={e => setLangsCount(e.target.value ? parseInt(e.target.value) : "")} placeholder="5" />
            </div>
          </div>

          <div className="box">
            <div className="input-box">
              <label htmlFor="hide_langs">Ocultar linguagens</label>
              <input type="text" id="hide_langs" value={hideLangs} onChange={e => setHideLangs(e.target.value)} placeholder="javascript,html,css" />
            </div>

            <BooleanSelect id="hide_progress" label="Ocultar barras de progresso" value={hideProgress} onChange={setHideProgress} />
          </div>

          <div className="box">
            <div className="input-box">
              <div className="icon icon-ajustado">
                <IoIosArrowDown />
              </div>
              <label htmlFor="stats_format">Formato das estatísticas</label>
              <select id="stats_format" value={statsFormat} onChange={e => setStatsFormat(e.target.value as StatsFormat)}>
                <option value="percentages">Percentagem</option>
                <option value="bytes">Bytes</option>
              </select>
            </div>

            <div className="input-box">
              <label htmlFor="size_weight">Peso do tamanho</label>
              <input type="number" step="0.1" min="0" value={sizeWeight} onChange={e => setSizeWeight(e.target.value ? parseFloat(e.target.value) : "")} placeholder="0.5" />
            </div>
          </div>

          <div className="box">
            <div className="input-box">
              <label htmlFor="count_weight">Peso da contagem</label>
              <input type="number" step="0.1" min="0" value={countWeight} onChange={e => setCountWeight(e.target.value ? parseFloat(e.target.value) : "")} placeholder="0.5" />
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
                      alt="Pré-visualização das linguagens mais usadas"
                      width={CARD_WIDTH}
                      height="auto"
                      loading="lazy"
                      onError={e => {
                        ;(e.target as HTMLImageElement).alt = "Erro ao carregar."
                      }}
                    />
                  </a>
                </figure>

                <CodeCard code={markdown} lang="Markdown" onCopy={() => handleCopy(markdown)} />

                <CodeCard code={`<a href="${linkUrl.trim() || TOOL_URL}" target="_blank" rel="noopener noreferrer"><img src="${imageUrl}" alt="${customTitle}" width="${CARD_WIDTH}" height="auto" loading="lazy" /></a>`} lang="HTML" onCopy={() => handleCopy(`<a href="${linkUrl.trim() || TOOL_URL}" target="_blank" rel="noopener noreferrer"><img src="${imageUrl}" alt="${customTitle}" width="${CARD_WIDTH}" height="auto" loading="lazy" /></a>`)} />
              </>
            )}

            {!imageUrl && !loading && <p>Introduz o nome de utilizador para ver a pré-visualização.</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
