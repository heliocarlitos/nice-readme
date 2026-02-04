"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import "./stats.css"

import { CodeCard } from "@/components/card/codecard/codecard"
import { UserImg } from "@/components/card/userimg/userimg"
import { StreakTheme } from "@/components/theme/streak"

import { db } from "@/lib/firebase"
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"

const LOCALES = [
  { code: "en", name: "English" },
  { code: "pt_BR", name: "Português (Brasil)" },
  { code: "pt_PT", name: "Português (Portugal)" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "zh_Hans", name: "中文（简体）" },
  { code: "zh_Hant", name: "中文（繁體）" },
  { code: "ru", name: "Русский" },
  { code: "ar", name: "العربية" },
  { code: "hi", name: "हिन्दी" }
]

const EXCLUDE_DAYS_OPTIONS = [
  { value: "", label: "Nenhum" },
  { value: "Sun", label: "Domingo" },
  { value: "Sat", label: "Sábado" },
  { value: "Sun,Sat", label: "Fim de semana (Dom + Sáb)" },
  { value: "Mon", label: "Segunda-feira" },
  { value: "Tue", label: "Terça-feira" },
  { value: "Wed", label: "Quarta-feira" },
  { value: "Thu", label: "Quinta-feira" },
  { value: "Fri", label: "Sexta-feira" },
  { value: "Mon,Tue,Wed,Thu,Fri", label: "Dias úteis (Seg–Sex)" }
]

const DATE_FORMAT_OPTIONS = [
  { value: "", label: "Padrão do locale" },
  { value: "d F[, Y]", label: "14 April, 2020" },
  { value: "j/n/Y", label: "14/4/2020" },
  { value: "[Y.]n.j", label: "2020.4.14" },
  { value: "M j[, Y]", label: "Apr 14, 2020" }
]

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
    const q = query(collection(db, "tool_usage"), where("username", "==", username.trim().toLowerCase()), where("tool", "==", "streak-stats"))
    const snapshot = await getDocs(q)
    return !snapshot.empty
  } catch {
    return false
  }
}

export function StreakStats() {
  const [username, setUsername] = useState("")
  const [theme, setTheme] = useState("default")
  const [hideBorder, setHideBorder] = useState(false)
  const [borderRadius, setBorderRadius] = useState(4.5)
  const [locale, setLocale] = useState("pt_BR")
  const [shortNumbers, setShortNumbers] = useState(false)
  const [mode, setMode] = useState<"daily" | "weekly">("daily")
  const [excludeDays, setExcludeDays] = useState("")
  const [disableAnimations, setDisableAnimations] = useState(false)
  const [cardWidth, setCardWidth] = useState(466)
  const [cardHeight, setCardHeight] = useState(194)
  const [hideTotalContributions, setHideTotalContributions] = useState(false)
  const [hideCurrentStreak, setHideCurrentStreak] = useState(false)
  const [hideLongestStreak, setHideLongestStreak] = useState(false)
  const [startingYear, setStartingYear] = useState<number | "">("")
  const [dateFormat, setDateFormat] = useState("")

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
      user: username.trim(),
      theme,
      hide_border: String(hideBorder),
      border_radius: String(borderRadius),
      locale,
      short_numbers: String(shortNumbers),
      mode,
      disable_animations: String(disableAnimations),
      card_width: String(cardWidth),
      card_height: String(cardHeight),
      hide_total_contributions: String(hideTotalContributions),
      hide_current_streak: String(hideCurrentStreak),
      hide_longest_streak: String(hideLongestStreak)
    })

    if (excludeDays) params.append("exclude_days", excludeDays)
    if (startingYear !== "") params.append("starting_year", String(startingYear))
    if (dateFormat) params.append("date_format", dateFormat)

    return `https://github-streak-stats-ruby.vercel.app/?${params.toString()}`
  }, [username, theme, hideBorder, borderRadius, locale, shortNumbers, mode, excludeDays, disableAnimations, cardWidth, cardHeight, hideTotalContributions, hideCurrentStreak, hideLongestStreak, startingYear, dateFormat])

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

    const md = `[![GitHub Streak](${url})](https://github.com/${username.trim()})`
    setMarkdown(md)

    const img = new Image()
    img.onload = () => setLoading(false)
    img.onerror = () => setLoading(false)
    img.src = url
  }, [buildImageUrl, username, userExists])

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
        tool: "streak-stats",
        timestamp: new Date()
      })
    } catch {}
  }

  const BooleanSelect = ({ id, label, value, onChange }: { id: string; label: string; value: boolean; onChange: (v: boolean) => void }) => (
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
          <div className={`input-box ${!userExists ? "input-error" : ""}`}>
            <label htmlFor="username">
              Nome de utilizador <span>*</span>
            </label>
            <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value.trim())} placeholder="ex: heliocarlitos" />
            {!userExists && <span className="error-message">Utilizador não encontrado no GitHub</span>}
          </div>

          <div className="box">
            <div className="input-box">
              <label htmlFor="theme">Tema</label>
              <select id="theme" value={theme} onChange={e => setTheme(e.target.value)}>
                <optgroup>
                  <StreakTheme />
                </optgroup>
              </select>
            </div>

            <div className="input-box">
              <label htmlFor="border_radius">Curvas da borda</label>
              <input type="number" id="border_radius" step="0.1" min="0" max="248" value={borderRadius} onChange={e => setBorderRadius(parseFloat(e.target.value) || 0)} />
            </div>
          </div>

          <div className="box">
            <BooleanSelect id="hide_border" label="Ocultar borda" value={hideBorder} onChange={setHideBorder} />

            <div className="input-box">
              <label htmlFor="locale">Idioma</label>
              <select id="locale" value={locale} onChange={e => setLocale(e.target.value)}>
                {LOCALES.map(loc => (
                  <option key={loc.code} value={loc.code}>
                    {loc.name} ({loc.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="box">
            <BooleanSelect id="short_numbers" label="Números curtos (ex: 1.5k)" value={shortNumbers} onChange={setShortNumbers} />

            <div className="input-box">
              <label htmlFor="mode">Modo</label>
              <select id="mode" value={mode} onChange={e => setMode(e.target.value as "daily" | "weekly")}>
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
              </select>
            </div>
          </div>

          <div className="box">
            <div className="input-box">
              <label htmlFor="exclude_days">Dias excluídos</label>
              <select id="exclude_days" value={excludeDays} onChange={e => setExcludeDays(e.target.value)}>
                {EXCLUDE_DAYS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <BooleanSelect id="disable_animations" label="Remover animações" value={disableAnimations} onChange={setDisableAnimations} />
          </div>

          <div className="box">
            <div className="input-box">
              <label htmlFor="card_width">Largura (px)</label>
              <input type="number" id="card_width" min="100" value={cardWidth} onChange={e => setCardWidth(parseInt(e.target.value) || 466)} />
            </div>

            <div className="input-box">
              <label htmlFor="card_height">Altura (px)</label>
              <input type="number" id="card_height" min="170" value={cardHeight} onChange={e => setCardHeight(parseInt(e.target.value) || 194)} />
            </div>
          </div>

          <div className="box">
            <BooleanSelect id="hide_total_contributions" label="Ocultar total de contribuições" value={hideTotalContributions} onChange={setHideTotalContributions} />

            <BooleanSelect id="hide_current_streak" label="Ocultar sequência actual" value={hideCurrentStreak} onChange={setHideCurrentStreak} />
          </div>

          <div className="box">
            <BooleanSelect id="hide_longest_streak" label="Ocultar maior sequência" value={hideLongestStreak} onChange={setHideLongestStreak} />

            <div className="input-box">
              <label htmlFor="date_format">Formato da data</label>
              <select id="date_format" value={dateFormat} onChange={e => setDateFormat(e.target.value)}>
                {DATE_FORMAT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="box">
            <div className="input-box">
              <label htmlFor="starting_year">Ano inicial (opcional)</label>
              <input type="number" id="starting_year" min="2005" max={new Date().getFullYear()} value={startingYear} onChange={e => setStartingYear(e.target.value ? parseInt(e.target.value) : "")} placeholder="ex: 2017" />
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="intro">
          <h2>Preview do Streak</h2>
        </div>

        <div className="content">
          {username.trim() && imageUrl && userExists && <UserImg url={username.trim()} />}

          <div className="bag-code">
            {loading && <p>A carregar...</p>}

            {imageUrl && userExists && !loading && (
              <>
                <figure>
                  <img
                    src={imageUrl}
                    alt="Pré-visualização da sequência de contribuições GitHub"
                    width={cardWidth}
                    height={cardHeight}
                    loading="lazy"
                    onError={e => {
                      ;(e.target as HTMLImageElement).alt = "Erro ao carregar. Verifica se o utilizador existe e tem contribuições públicas."
                    }}
                  />
                </figure>

                <CodeCard code={markdown} lang="Markdown" onCopy={() => handleCopy(markdown)} />

                <CodeCard code={`<img src="${imageUrl}" alt="GitHub Streak de ${username.trim()}" width="${cardWidth}" height="${cardHeight}" loading="lazy" />`} lang="HTML" onCopy={() => handleCopy(`<img src="${imageUrl}" alt="GitHub Streak de ${username.trim()}" width="${cardWidth}" height="${cardHeight}" loading="lazy" />`)} />
              </>
            )}

            {!username.trim() && !loading && <p>Introduz um nome de utilizador do GitHub para ver a pré-visualização.</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
