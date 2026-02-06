"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import "./stats.css"

import { db } from "@/lib/firebase"
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"
import { StatsTheme } from "@/components/theme/stats"
import { CodeCard } from "@/components/card/codecard/codecard"

const TOOL_URL = "https://nice-readme.vercel.app/github-stats"

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

async function checkUsageExists(username: string): Promise<boolean> {
  try {
    const q = query(collection(db, "tool_usage"), where("username", "==", username.trim().toLowerCase()), where("tool", "==", "github-stats"))
    const snapshot = await getDocs(q)
    return !snapshot.empty
  } catch {
    return false
  }
}

export function GithubStats() {
  const [username, setUsername] = useState("")
  const [customTitle, setCustomTitle] = useState("GitHub Stats")
  const [theme, setTheme] = useState("default")
  const [titleColor, setTitleColor] = useState("2f80ed")
  const [textColor, setTextColor] = useState("434d58")
  const [iconColor, setIconColor] = useState("4c71f2")
  const [ringColor, setRingColor] = useState("2f80ed")
  const [borderColor, setBorderColor] = useState("e4e2e2")
  const [hideBorder, setHideBorder] = useState(false)
  const [locale, setLocale] = useState("en")
  const [borderRadius, setBorderRadius] = useState(4.5)
  const [cardWidth, setCardWidth] = useState(466)
  const [hide, setHide] = useState("")
  const [show, setShow] = useState("")
  const [hideTitle, setHideTitle] = useState(false)
  const [hideRank, setHideRank] = useState(false)
  const [rankIcon, setRankIcon] = useState<"default" | "github" | "percentile">("default")
  const [showIcons, setShowIcons] = useState(false)
  const [includeAllCommits, setIncludeAllCommits] = useState(false)
  const [lineHeight, setLineHeight] = useState(25)
  const [excludeRepo, setExcludeRepo] = useState("")
  const [textBold, setTextBold] = useState(true)
  const [disableAnimations, setDisableAnimations] = useState(false)
  const [numberFormat, setNumberFormat] = useState<"short" | "long">("short")
  const [numberPrecision, setNumberPrecision] = useState("")
  const [commitsYear, setCommitsYear] = useState<number | "">("")
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

  const buildImageUrl = useCallback(() => {
    if (!username.trim()) return ""

    const params = new URLSearchParams({
      username: username.trim(),
      custom_title: customTitle,
      theme,
      title_color: titleColor,
      text_color: textColor,
      icon_color: iconColor,
      ring_color: ringColor,
      border_color: borderColor,
      hide_border: String(hideBorder),
      locale,
      border_radius: String(borderRadius),
      card_width: String(cardWidth),
      hide_title: String(hideTitle),
      hide_rank: String(hideRank),
      rank_icon: rankIcon,
      show_icons: String(showIcons),
      include_all_commits: String(includeAllCommits),
      line_height: String(lineHeight),
      text_bold: String(textBold),
      disable_animations: String(disableAnimations),
      number_format: numberFormat
    })

    if (hide) params.append("hide", hide)
    if (show) params.append("show", show)
    if (excludeRepo) params.append("exclude_repo", excludeRepo)
    if (numberPrecision !== "") params.append("number_precision", numberPrecision)
    if (commitsYear !== "") params.append("commits_year", String(commitsYear))

    return `https://helio-github-stats.vercel.app/api?${params.toString()}`
  }, [username, customTitle, theme, titleColor, textColor, iconColor, ringColor, borderColor, hideBorder, locale, borderRadius, cardWidth, hide, show, hideTitle, hideRank, rankIcon, showIcons, includeAllCommits, lineHeight, excludeRepo, textBold, disableAnimations, numberFormat, numberPrecision, commitsYear])

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
        tool: "github-stats",
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
              Nome de utilizador do GitHub <span>*</span>
            </label>
            <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value.trim())} placeholder="ex: heliocarlitos" />
            {!userExists && <span className="error-message">Utilizador não encontrado no GitHub</span>}
          </div>

          <div className="box">
            <div className="input-box">
              <label htmlFor="custom_title">Título do cartão</label>
              <input type="text" id="custom_title" value={customTitle} onChange={e => setCustomTitle(e.target.value)} placeholder="ex: GitHub Stats" />
            </div>

            <div className="input-box">
              <label htmlFor="theme">Tema</label>
              <select id="theme" value={theme} onChange={e => setTheme(e.target.value)}>
                <StatsTheme />
              </select>
            </div>
          </div>

          <div className="box">
            <div className="input-box">
              <label htmlFor="title_color">Cor do título</label>
              <input type="color" className="input-color" id="title_color" value={`#${titleColor}`} onChange={e => setTitleColor(e.target.value.replace("#", ""))} />
            </div>

            <div className="input-box">
              <label htmlFor="text_color">Cor do texto</label>
              <input type="color" className="input-color" id="text_color" value={`#${textColor}`} onChange={e => setTextColor(e.target.value.replace("#", ""))} />
            </div>
          </div>

          <div className="box">
            <BooleanSelect id="show_icons" label="Mostrar ícones" value={showIcons} onChange={setShowIcons} />

            <div className="input-box">
              <label htmlFor="icon_color">Cor dos ícones</label>
              <input type="color" className="input-color" id="icon_color" value={`#${iconColor}`} onChange={e => setIconColor(e.target.value.replace("#", ""))} />
            </div>
          </div>

          <div className="box">
            <div className="input-box">
              <label htmlFor="ring_color">Cor do círculo de rank</label>
              <input type="color" className="input-color" id="ring_color" value={`#${ringColor}`} onChange={e => setRingColor(e.target.value.replace("#", ""))} />
            </div>

            <div className="input-box">
              <label htmlFor="border_color">Cor da borda</label>
              <input type="color" className="input-color" id="border_color" value={`#${borderColor}`} onChange={e => setBorderColor(e.target.value.replace("#", ""))} />
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
            <div className="input-box">
              <label htmlFor="border_radius">Raio da borda</label>
              <input type="number" id="border_radius" step="0.1" min="0" value={borderRadius} onChange={e => setBorderRadius(parseFloat(e.target.value) || 0)} />
            </div>

            <div className="input-box">
              <label htmlFor="card_width">Largura do cartão (px)</label>
              <input type="number" id="card_width" min="270" value={cardWidth} onChange={e => setCardWidth(parseInt(e.target.value) || 466)} />
            </div>
          </div>

          <div className="box">
            <div className="input-box">
              <label htmlFor="hide">Ocultar itens (separar por vírgula)</label>
              <input type="text" id="hide" value={hide} onChange={e => setHide(e.target.value)} placeholder="ex: stars,commits,prs" />
            </div>

            <div className="input-box">
              <label htmlFor="show">Mostrar itens (separar por vírgula)</label>
              <input type="text" id="show" value={show} onChange={e => setShow(e.target.value)} placeholder="ex: reviews,prs_merged" />
            </div>
          </div>

          <div className="box">
            <BooleanSelect id="hide_title" label="Ocultar título" value={hideTitle} onChange={setHideTitle} />
            <BooleanSelect id="hide_rank" label="Ocultar rank" value={hideRank} onChange={setHideRank} />
          </div>

          <div className="box">
            <div className="input-box">
              <label htmlFor="rank_icon">Ícone do rank</label>
              <select id="rank_icon" value={rankIcon} onChange={e => setRankIcon(e.target.value as "default" | "github" | "percentile")}>
                <option value="default">Padrão</option>
                <option value="github">GitHub</option>
                <option value="percentile">Percentil</option>
              </select>
            </div>

            <BooleanSelect id="include_all_commits" label="Incluir todos os commits" value={includeAllCommits} onChange={setIncludeAllCommits} />
          </div>

          <div className="box">
            <div className="input-box">
              <label htmlFor="line_height">Altura da linha</label>
              <input type="number" id="line_height" min="10" value={lineHeight} onChange={e => setLineHeight(parseInt(e.target.value) || 25)} />
            </div>

            <div className="input-box">
              <label htmlFor="exclude_repo">Excluir repositórios</label>
              <input type="text" id="exclude_repo" value={excludeRepo} onChange={e => setExcludeRepo(e.target.value)} placeholder="ex: repo1,repo2" />
            </div>
          </div>

          <div className="box">
            <div className="input-box">
              <label htmlFor="commits_year">Ano dos commits</label>
              <input type="number" id="commits_year" min="2005" max={new Date().getFullYear()} value={commitsYear} onChange={e => setCommitsYear(e.target.value ? parseInt(e.target.value) : "")} placeholder="ex: 2026" />
            </div>

            <BooleanSelect id="text_bold" label="Texto em negrito" value={textBold} onChange={setTextBold} />
          </div>

          <div className="box">
            <BooleanSelect id="disable_animations" label="Desativar animações" value={disableAnimations} onChange={setDisableAnimations} />

            <div className="input-box">
              <label htmlFor="number_format">Formato dos números</label>
              <select id="number_format" value={numberFormat} onChange={e => setNumberFormat(e.target.value as "short" | "long")}>
                <option value="short">Curto (ex: 1.5k)</option>
                <option value="long">Longo (ex: 1500)</option>
              </select>
            </div>
          </div>

          <div className="box">
            <div className="input-box">
              <label htmlFor="number_precision">Precisão decimal (0–2)</label>
              <input type="text" id="number_precision" value={numberPrecision} onChange={e => setNumberPrecision(e.target.value)} placeholder="ex: 1" />
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
                      alt={`Estatísticas do GitHub - ${username}`}
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

                <CodeCard code={`<a href="${linkUrl.trim() || TOOL_URL}" target="_blank" rel="noopener noreferrer"><img src="${imageUrl}" alt="${customTitle}" width="${cardWidth}" height="auto" loading="lazy" /></a>`} lang="HTML" onCopy={() => handleCopy(`<a href="${linkUrl.trim() || TOOL_URL}" target="_blank" rel="noopener noreferrer"><img src="${imageUrl}" alt="${customTitle}" width="${cardWidth}" height="auto" loading="lazy" /></a>`)} />
              </>
            )}

            {!imageUrl && !loading && <p>Introduz o nome de utilizador para ver a pré-visualização.</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
