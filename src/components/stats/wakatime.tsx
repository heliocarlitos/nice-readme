"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import "./stats.css"

import { CodeCard } from "@/components/card/codecard/codecard"

import { db } from "@/lib/firebase"
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"
import { MdOpenInNew } from "react-icons/md"
import { Botao } from "@/components/btn/botao/botao"
import { IoIosArrowDown } from "react-icons/io"

const TOOL_URL = "https://nice-readme.vercel.app/wakatime"

const WAKATIME_LAYOUTS = ["default", "compact"] as const
const WAKATIME_DISPLAY_FORMATS = ["time", "percent"] as const

type Layout = (typeof WAKATIME_LAYOUTS)[number]
type DisplayFormat = (typeof WAKATIME_DISPLAY_FORMATS)[number]

interface BooleanSelectProps {
  id: string
  label: string
  value: boolean
  onChange: (value: boolean) => void
}

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
    const q = query(collection(db, "tool_usage"), where("username", "==", username.trim().toLowerCase()), where("tool", "==", "wakatime-stats"))
    const snapshot = await getDocs(q)
    return !snapshot.empty
  } catch {
    return false
  }
}

export function WakaTimeStats() {
  const [username, setUsername] = useState("")
  const [customTitle, setCustomTitle] = useState("WakaTime Stats")
  const [hide, setHide] = useState("")
  const [hideTitle, setHideTitle] = useState(false)
  const [cardWidth, setCardWidth] = useState(466)
  const [lineHeight, setLineHeight] = useState(25)
  const [hideProgress, setHideProgress] = useState(false)
  const [layout, setLayout] = useState<Layout>("default")
  const [langsCount, setLangsCount] = useState<number | "">("")
  const [displayFormat, setDisplayFormat] = useState<DisplayFormat>("time")
  const [disableAnimations, setDisableAnimations] = useState(false)

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

  const buildImageUrl = useCallback(() => {
    if (!username.trim()) return ""

    const params = new URLSearchParams({
      username: username.trim(),
      custom_title: customTitle,
      card_width: String(cardWidth),
      line_height: String(lineHeight),
      layout,
      display_format: displayFormat,
      disable_animations: String(disableAnimations)
    })

    if (hide) params.append("hide", hide)
    if (hideTitle) params.append("hide_title", "true")
    if (hideProgress) params.append("hide_progress", "true")
    if (langsCount !== "") params.append("langs_count", String(langsCount))

    return `https://helio-github-stats.vercel.app/api/wakatime?${params.toString()}`
  }, [username, customTitle, cardWidth, lineHeight, layout, displayFormat, disableAnimations, hide, hideTitle, hideProgress, langsCount])

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

    const md = `[![${customTitle}](${url})](${TOOL_URL})`
    setMarkdown(md)

    const img = new Image()
    img.onload = () => setLoading(false)
    img.onerror = () => setLoading(false)
    img.src = url
  }, [buildImageUrl, username, customTitle, userExists])

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
        tool: "wakatime-stats",
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

        {username.trim() && userExists && (
          <div className="info">
            <p>
              Você precisa ter uma conta no WakaTime vinculada com o seu GitHub. Pode levar até 24 horas para que as estatísticas fiquem visíveis no cartão.
              <Botao
                href="https://wakatime.com/oauth/github/authorize?next=%2Fwelcome&reason=login"
                target="_blank"
                content={
                  <>
                    Criar conta
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
              Nome de utilizador do WakaTime <span>*</span>
            </label>
            <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value.trim())} placeholder="ex: heliocarlitos" />
            {!userExists && <span className="error-message">Utilizador não encontrado no GitHub</span>}
          </div>

          <div className="box">
            <div className="input-box">
              <label htmlFor="custom_title">Título do cartão</label>
              <input type="text" id="custom_title" value={customTitle} onChange={e => setCustomTitle(e.target.value)} placeholder="ex: WakaTime Stats" />
            </div>

            <div className="input-box">
              <label htmlFor="card_width">Largura (px)</label>
              <input type="number" id="card_width" min={270} value={cardWidth} onChange={e => setCardWidth(parseInt(e.target.value) || 466)} />
            </div>
          </div>

          <div className="box">
            <div className="input-box">
              <label htmlFor="hide">Ocultar linguagens (separar por vírgula)</label>
              <input type="text" id="hide" value={hide} onChange={e => setHide(e.target.value)} placeholder="ex: javascript,html,css" />
            </div>

            <div className="input-box">
              <label htmlFor="langs_count">Número de linguagens</label>
              <input type="number" id="langs_count" min={1} max={20} value={langsCount} onChange={e => setLangsCount(e.target.value ? parseInt(e.target.value) : "")} placeholder="ex: 5" />
            </div>
          </div>

          <div className="box">
            <BooleanSelect id="hide_title" label="Ocultar título" value={hideTitle} onChange={setHideTitle} />
            <BooleanSelect id="hide_progress" label="Ocultar barra de progresso" value={hideProgress} onChange={setHideProgress} />
          </div>

          <div className="box">
            <div className="input-box">
              <div className="icon icon-ajustado">
                <IoIosArrowDown />
              </div>
              <label htmlFor="layout">Layout</label>
              <select id="layout" value={layout} onChange={e => setLayout(e.target.value as Layout)}>
                {WAKATIME_LAYOUTS.map(l => (
                  <option key={l} value={l}>
                    {l === "default" ? "Padrão" : "Compacto"}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-box">
              <div className="icon icon-ajustado">
                <IoIosArrowDown />
              </div>
              <label htmlFor="display_format">Formato</label>
              <select id="display_format" value={displayFormat} onChange={e => setDisplayFormat(e.target.value as DisplayFormat)}>
                {WAKATIME_DISPLAY_FORMATS.map(f => (
                  <option key={f} value={f}>
                    {f === "time" ? "Tempo" : "Percentagem"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="box">
            <BooleanSelect id="disable_animations" label="Desativar animações" value={disableAnimations} onChange={setDisableAnimations} />

            <div className="input-box">
              <label htmlFor="line_height">Altura da linha</label>
              <input type="number" id="line_height" min={10} value={lineHeight} onChange={e => setLineHeight(parseInt(e.target.value) || 25)} />
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
                  <a href={TOOL_URL} target="_blank" rel="noopener noreferrer">
                    <img
                      src={imageUrl}
                      alt={`Estatísticas WakaTime - ${username}`}
                      width={cardWidth}
                      height="auto"
                      loading="lazy"
                      onError={e => {
                        ;(e.target as HTMLImageElement).alt = "Erro ao carregar."
                      }}
                    />
                  </a>
                </figure>

                <CodeCard code={markdown} lang="Markdown" onCopy={() => handleCopy(markdown)} />

                <CodeCard code={`<a href="${TOOL_URL}" target="_blank" rel="noopener noreferrer"><img src="${imageUrl}" alt="${customTitle}" width="${cardWidth}" height="auto" loading="lazy" /></a>`} lang="HTML" onCopy={() => handleCopy(`<a href="${TOOL_URL}" target="_blank" rel="noopener noreferrer"><img src="${imageUrl}" alt="${customTitle}" width="${cardWidth}" height="auto" loading="lazy" /></a>`)} />
              </>
            )}

            {!imageUrl && !loading && <p>Introduz o nome de utilizador do WakaTime para ver a pré-visualização.</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
