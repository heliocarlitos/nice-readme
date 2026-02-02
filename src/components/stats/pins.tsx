"use client"
import { useState, useEffect, useCallback } from "react"
import "./stats.css"
import { CodeCard } from "../card/codecard/codecard"

import { db } from "@/lib/firebase"
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"

const COMMON_THEMES = ["default", "dark", "radical", "merko", "gruvbox", "tokyonight", "onedark", "cobalt", "synthwave", "highcontrast", "dracula", "transparent"]
const LANGS_THEMES = ["default", "dark"]

const LAYOUTS = ["normal", "compact", "donut", "donut-vertical", "pie"]

const LOCALES = [
  { code: "en", name: "English" },
  { code: "pt-br", name: "Português (Brasil)" },
  { code: "pt-pt", name: "Português (Portugal)" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "zh-cn", name: "中文（简体）" },
  { code: "zh-tw", name: "中文（繁體）" },
  { code: "ru", name: "Русский" },
  { code: "ar", name: "العربية" },
  { code: "hi", name: "हिन्दी" }
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

async function checkUsageExists(username: string, tool: string): Promise<boolean> {
  try {
    const q = query(collection(db, "tool_usage"), where("username", "==", username.trim().toLowerCase()), where("tool", "==", tool))
    const snapshot = await getDocs(q)
    return !snapshot.empty
  } catch {
    return false
  }
}

export function PinsAndLangs() {
  const [type, setType] = useState<"pin" | "gist" | "langs">("pin")

  const [username, setUsername] = useState("")
  const [theme, setTheme] = useState("default")
  const [hideBorder, setHideBorder] = useState(false)
  const [borderRadius, setBorderRadius] = useState(4.5)

  const [repoUrl, setRepoUrl] = useState("")

  const [gistId, setGistId] = useState("")
  const [showOwnerGist, setShowOwnerGist] = useState(false)

  const [customTitle, setCustomTitle] = useState("Linguagens mais usadas")
  const [hideLangs, setHideLangs] = useState("")
  const [hideTitleLangs, setHideTitleLangs] = useState(false)
  const [layout, setLayout] = useState<"normal" | "compact" | "donut" | "donut-vertical" | "pie">("normal")
  const [langsCount, setLangsCount] = useState<number | "">("")
  const [disableAnimationsLangs, setDisableAnimationsLangs] = useState(false)
  const [hideProgress, setHideProgress] = useState(false)
  const [sizeWeight, setSizeWeight] = useState<number | "">("")
  const [countWeight, setCountWeight] = useState<number | "">("")
  const [statsFormat, setStatsFormat] = useState<"percentages" | "bytes">("percentages")
  const [locale, setLocale] = useState("pt-br")

  const [imageUrl, setImageUrl] = useState("")
  const [markdown, setMarkdown] = useState("")
  const [loading, setLoading] = useState(false)

  const parseRepoUrl = (url: string) => {
    try {
      const cleanUrl = url.trim().replace(/\/$/, "")
      const match = cleanUrl.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)/)
      if (match) return { username: match[1], repo: match[2] }
    } catch {}
    return null
  }

  const buildImageUrl = useCallback(() => {
    const cardWidth = 466

    if (type === "pin") {
      const parsed = parseRepoUrl(repoUrl)
      if (!parsed) return ""
      const { username, repo } = parsed
      const params = new URLSearchParams({
        username,
        repo,
        theme,
        hide_border: String(hideBorder),
        border_radius: String(borderRadius),
        card_width: String(cardWidth)
      })
      if (showOwnerGist) params.append("show_owner", "true")
      return `https://helio-github-stats.vercel.app/api/pin?${params.toString()}`
    }

    if (type === "gist") {
      if (!gistId.trim()) return ""
      const params = new URLSearchParams({
        id: gistId.trim(),
        theme,
        hide_border: String(hideBorder),
        border_radius: String(borderRadius),
        card_width: String(cardWidth),
        locale
      })
      if (showOwnerGist) params.append("show_owner", "true")
      return `https://helio-github-stats.vercel.app/api/gist?${params.toString()}`
    }

    if (type === "langs") {
      if (!username.trim()) return ""
      const params = new URLSearchParams({
        username: username.trim(),
        layout,
        stats_format: statsFormat,
        theme,
        hide_border: String(hideBorder),
        border_radius: String(borderRadius),
        card_width: String(cardWidth),
        locale
      })
      if (!hideTitleLangs) params.append("custom_title", customTitle)
      if (hideLangs) params.append("hide", hideLangs)
      if (hideTitleLangs) params.append("hide_title", "true")
      if (langsCount !== "") params.append("langs_count", String(langsCount))
      if (disableAnimationsLangs) params.append("disable_animations", "true")
      if (hideProgress) params.append("hide_progress", "true")
      if (sizeWeight !== "") params.append("size_weight", String(sizeWeight))
      if (countWeight !== "") params.append("count_weight", String(countWeight))
      return `https://helio-github-stats.vercel.app/api/top-langs?${params.toString()}`
    }

    return ""
  }, [type, repoUrl, gistId, username, theme, hideBorder, borderRadius, locale, showOwnerGist, customTitle, hideLangs, hideTitleLangs, layout, langsCount, disableAnimationsLangs, hideProgress, sizeWeight, countWeight, statsFormat])

  useEffect(() => {
    const url = buildImageUrl()
    if (!url) {
      setImageUrl("")
      setMarkdown("")
      setLoading(false)
      return
    }

    setLoading(true)
    setImageUrl(url)

    let md = ""
    if (type === "pin") {
      const parsed = parseRepoUrl(repoUrl)
      if (parsed) {
        md = `[![${parsed.repo}](${url})](https://github.com/${parsed.username}/${parsed.repo})`
      }
    } else if (type === "gist") {
      md = `[![Gist Card](${url})](https://gist.github.com/${gistId.trim()})`
    } else {
      md = `[![${customTitle}](${url})](https://github.com/${username.trim()})`
    }
    setMarkdown(md)

    const img = new Image()
    img.onload = () => setLoading(false)
    img.onerror = () => setLoading(false)
    img.src = url
  }, [buildImageUrl, type, repoUrl, gistId, username, customTitle])

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      if (type === "langs" && username.trim()) {
        const cleanUsername = username.trim().toLowerCase()
        const tool = "top-langs"
        const existsInDb = await checkUsageExists(cleanUsername, tool)
        if (existsInDb) return
        const existsOnGitHub = await checkGitHubUserExists(username)
        if (!existsOnGitHub) return
        await addDoc(collection(db, "tool_usage"), {
          username: cleanUsername,
          tool,
          timestamp: new Date()
        })
      }
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
    <>
      <section className="stats">
        <div className="container">
          <div className="intro">
            <h2>Propriedades</h2>
          </div>

          <div className="content">
            <div className="input-box">
              <label htmlFor="card_type">Tipo de Card</label>
              <select id="card_type" value={type} onChange={e => setType(e.target.value as "pin" | "gist" | "langs")}>
                <option value="pin">Repositório Extra (Pin)</option>
                <option value="gist">Gist Pin</option>
                <option value="langs">Top Languages</option>
              </select>
            </div>

            {type === "pin" && (
              <div className="input-box">
                <label htmlFor="repo_url">
                  URL do repositório <span>*</span>
                </label>
                <input type="text" id="repo_url" value={repoUrl} onChange={e => setRepoUrl(e.target.value.trim())} placeholder="https://github.com/heliocarlitos/nice-readme" />
              </div>
            )}

            {type === "gist" && (
              <div className="input-box">
                <label htmlFor="gist_id">
                  ID do Gist <span>*</span>
                </label>
                <input type="text" id="gist_id" value={gistId} onChange={e => setGistId(e.target.value.trim())} placeholder="709fbee67b48e330507b9b7f10fef16f" />
              </div>
            )}

            {type === "langs" && (
              <div className="input-box">
                <label htmlFor="username">
                  Nome de utilizador <span>*</span>
                </label>
                <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value.trim())} placeholder="heliocarlitos" />
              </div>
            )}

            <div className="box">
              <div className="input-box">
                <label htmlFor="theme">Tema</label>
                <select id="theme" value={theme} onChange={e => setTheme(e.target.value)}>
                  {(type === "langs" ? LANGS_THEMES : COMMON_THEMES).map(t => (
                    <option key={t} value={t}>
                      {t}
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
              {type === "langs" ? (
                !hideTitleLangs ? (
                  <div className="input-box">
                    <label htmlFor="custom_title">Título personalizado</label>
                    <input type="text" id="custom_title" value={customTitle} onChange={e => setCustomTitle(e.target.value)} placeholder="Linguagens mais usadas" />
                  </div>
                ) : null
              ) : (
                <div className="input-box">
                  <label htmlFor="locale">Idioma</label>
                  <select id="locale" value={locale} onChange={e => setLocale(e.target.value)}>
                    {LOCALES.map(loc => (
                      <option key={loc.code} value={loc.code}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {type === "pin" && (
              <div className="box">
                <BooleanSelect id="show_owner_pin" label="Mostrar proprietário" value={showOwnerGist} onChange={setShowOwnerGist} />
                <div></div>
              </div>
            )}

            {type === "gist" && (
              <div className="box">
                <BooleanSelect id="show_owner_gist" label="Mostrar proprietário" value={showOwnerGist} onChange={setShowOwnerGist} />
                <div></div>
              </div>
            )}

            {type === "langs" && (
              <>
                <div className="box">
                  <BooleanSelect id="hide_title_langs" label="Ocultar título" value={hideTitleLangs} onChange={setHideTitleLangs} />
                  <BooleanSelect id="disable_animations_langs" label="Desativar animações" value={disableAnimationsLangs} onChange={setDisableAnimationsLangs} />
                </div>

                <div className="box">
                  <div className="input-box">
                    <label htmlFor="layout">Layout</label>
                    <select id="layout" value={layout} onChange={e => setLayout(e.target.value as "normal" | "compact" | "donut" | "donut-vertical" | "pie")}>
                      {LAYOUTS.map(l => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="input-box">
                    <label htmlFor="langs_count">Nº de linguagens (1–20)</label>
                    <input type="number" min="1" max="20" value={langsCount} onChange={e => setLangsCount(e.target.value ? parseInt(e.target.value) : "")} placeholder="5" />
                  </div>
                </div>

                <div className="box">
                  <div className="input-box">
                    <label htmlFor="hide_langs">Ocultar linguagens</label>
                    <input type="text" id="hide_langs" value={hideLangs} onChange={e => setHideLangs(e.target.value)} placeholder="javascript,html" />
                  </div>
                  <BooleanSelect id="hide_progress" label="Ocultar barras de progresso" value={hideProgress} onChange={setHideProgress} />
                </div>

                <div className="box">
                  <div className="input-box">
                    <label htmlFor="stats_format">Formato das estatísticas</label>
                    <select id="stats_format" value={statsFormat} onChange={e => setStatsFormat(e.target.value as "percentages" | "bytes")}>
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
                  <div></div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="container">
          <div className="intro">
            <h2>Preview do Card</h2>
          </div>

          <div className="content">
            <div className="bag-code">
              {loading && <p>A carregar...</p>}
              {imageUrl && !loading && (
                <>
                  <figure>
                    <img
                      src={imageUrl}
                      alt={`Pré-visualização do cartão ${type}`}
                      loading="lazy"
                      onError={e => {
                        ;(e.target as HTMLImageElement).alt = "Erro ao carregar. Verifica se o utilizador, repositório ou Gist existe."
                      }}
                    />
                  </figure>
                  <CodeCard code={markdown} lang="Markdown" onCopy={() => handleCopy(markdown)} />
                  <CodeCard code={`<img src="${imageUrl}" alt="Cartão ${type}" loading="lazy" />`} lang="HTML" onCopy={() => handleCopy(`<img src="${imageUrl}" alt="Cartão ${type}" loading="lazy" />`)} />
                </>
              )}
              {!imageUrl && !loading && <p>Preenche os campos obrigatórios para ver a pré-visualização.</p>}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
