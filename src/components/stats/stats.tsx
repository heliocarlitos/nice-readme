"use client"
import { useState, useEffect, useCallback } from "react"
import "./stats.css"
import { CodeCard } from "../card/codecard/codecard"
import { UserImg } from "../card/userimg/userimg"
import { StatsTheme } from "../theme/stats"

const HIDE_OPTIONS = ["stars", "commits", "prs", "issues", "contribs"]
const SHOW_OPTIONS = ["reviews", "discussions_started", "discussions_answered", "prs_merged", "prs_merged_percentage"]

const WAKATIME_LAYOUTS = ["default", "compact"]
const WAKATIME_DISPLAY_FORMATS = ["time", "percent"]

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

export function Stats() {
  const [type, setType] = useState<"github" | "wakatime">("github")

  // GitHub Stats
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

  // WakaTime Stats
  const [wakaUsername, setWakaUsername] = useState("")
  const [wakaCustomTitle, setWakaCustomTitle] = useState("WakaTime Stats")
  const [wakaHide, setWakaHide] = useState("")
  const [wakaHideTitle, setWakaHideTitle] = useState(false)
  const [wakaCardWidth, setWakaCardWidth] = useState(466)
  const [wakaLineHeight, setWakaLineHeight] = useState(25)
  const [wakaHideProgress, setWakaHideProgress] = useState(false)
  const [wakaLayout, setWakaLayout] = useState<"default" | "compact">("default")
  const [wakaLangsCount, setWakaLangsCount] = useState<number | "">("")
  const [wakaDisplayFormat, setWakaDisplayFormat] = useState<"time" | "percent">("time")
  const [wakaDisableAnimations, setWakaDisableAnimations] = useState(false)

  const [imageUrl, setImageUrl] = useState("")
  const [markdown, setMarkdown] = useState("")
  const [loading, setLoading] = useState(false)

  const buildImageUrl = useCallback(() => {
    if (type === "github") {
      if (!username.trim()) return ""
      const params = new URLSearchParams({
        username: username.trim(),
        custom_title: encodeURIComponent(customTitle),
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
    }

    if (type === "wakatime") {
      if (!wakaUsername.trim()) return ""
      const params = new URLSearchParams({
        username: wakaUsername.trim(),
        custom_title: encodeURIComponent(wakaCustomTitle),
        card_width: String(wakaCardWidth),
        line_height: String(wakaLineHeight),
        layout: wakaLayout,
        display_format: wakaDisplayFormat,
        disable_animations: String(wakaDisableAnimations)
      })

      if (wakaHide) params.append("hide", wakaHide)
      if (wakaHideTitle) params.append("hide_title", "true")
      if (wakaHideProgress) params.append("hide_progress", "true")
      if (wakaLangsCount !== "") params.append("langs_count", String(wakaLangsCount))

      return `https://helio-github-stats.vercel.app/api/wakatime?${params.toString()}`
    }

    return ""
  }, [
    type,
    // GitHub
    username,
    customTitle,
    theme,
    titleColor,
    textColor,
    iconColor,
    ringColor,
    borderColor,
    hideBorder,
    locale,
    borderRadius,
    cardWidth,
    hide,
    show,
    hideTitle,
    hideRank,
    rankIcon,
    showIcons,
    includeAllCommits,
    lineHeight,
    excludeRepo,
    textBold,
    disableAnimations,
    numberFormat,
    numberPrecision,
    commitsYear,
    // WakaTime
    wakaUsername,
    wakaCustomTitle,
    wakaHide,
    wakaHideTitle,
    wakaCardWidth,
    wakaLineHeight,
    wakaHideProgress,
    wakaLayout,
    wakaLangsCount,
    wakaDisplayFormat,
    wakaDisableAnimations
  ])

  useEffect(() => {
    const url = buildImageUrl()
    if (!url) {
      setImageUrl("")
      setMarkdown("")
      setLoading(false)
      return
    }

    setLoading(true)
    const timer = setTimeout(() => {
      setImageUrl(url)
      let md = ""
      if (type === "github") {
        md = `[![${customTitle}](${url})](https://github.com/${username})`
      } else {
        md = `[![${wakaCustomTitle}](${url})](https://nice-readme.vercel.app/)`
      }
      setMarkdown(md)

      const img = new Image()
      img.onload = () => setLoading(false)
      img.onerror = () => setLoading(false)
      img.src = url
    }, 500)

    return () => clearTimeout(timer)
  }, [buildImageUrl, type, username, wakaUsername, customTitle, wakaCustomTitle])

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
              <label htmlFor="stats_type">Tipo de estatísticas</label>
              <select id="stats_type" value={type} onChange={e => setType(e.target.value as any)}>
                <option value="github">GitHub Stats</option>
                <option value="wakatime">WakaTime Stats</option>
              </select>
            </div>

            {type === "github" ? (
              <>
                <div className="input-box">
                  <label htmlFor="username">
                    Nome de utilizador do GitHub <span>*</span>
                  </label>
                  <input type="text" id="username" className="user-input" value={username} onChange={e => setUsername(e.target.value)} placeholder="heliocarlitos" />
                </div>

                <div className="box">
                  <div className="input-box">
                    <label htmlFor="custom_title">Título do cartão</label>
                    <input type="text" id="custom_title" value={customTitle} onChange={e => setCustomTitle(e.target.value)} placeholder="GitHub Stats" />
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
                    <label htmlFor="card_width">Largura (px)</label>
                    <input type="number" id="card_width" min="270" value={cardWidth} onChange={e => setCardWidth(parseInt(e.target.value) || 466)} />
                  </div>
                </div>

                <div className="box">
                  <div className="input-box">
                    <label htmlFor="hide">Ocultar (ex: stars,commits)</label>
                    <select id="hide" value={hide} onChange={e => setHide(e.target.value)}>
                      <option value="">Nenhum</option>
                      {HIDE_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="input-box">
                    <label htmlFor="show">Mostrar (ex: reviews,prs_merged)</label>
                    <select id="show" value={show} onChange={e => setShow(e.target.value)}>
                      <option value="">Nenhum</option>
                      {SHOW_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="box">
                  <BooleanSelect id="hide_title" label="Ocultar título" value={hideTitle} onChange={setHideTitle} />
                  <BooleanSelect id="hide_rank" label="Ocultar rank" value={hideRank} onChange={setHideRank} />
                </div>

                <div className="box">
                  <div className="input-box">
                    <label htmlFor="rank_icon">Ícone do rank</label>
                    <select id="rank_icon" value={rankIcon} onChange={e => setRankIcon(e.target.value as any)}>
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
                    <input type="text" id="exclude_repo" value={excludeRepo} onChange={e => setExcludeRepo(e.target.value)} placeholder="repo1,repo2" />
                  </div>
                </div>

                <div className="box">
                  <div className="input-box">
                    <label htmlFor="commits_year">Ano dos commits</label>
                    <input type="number" id="commits_year" min="2005" max={new Date().getFullYear()} value={commitsYear} onChange={e => setCommitsYear(e.target.value ? parseInt(e.target.value) : "")} placeholder="ex: 2023" />
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
                </div>
              </>
            ) : (
              <>
                <div className="input-box">
                  <label htmlFor="waka_username">
                    Nome de utilizador do WakaTime <span>*</span>
                  </label>
                  <input type="text" id="waka_username" className="user-input" value={wakaUsername} onChange={e => setWakaUsername(e.target.value)} placeholder="heliocarlitos" />
                </div>

                <div className="box">
                  <div className="input-box">
                    <label htmlFor="waka_custom_title">Título personalizado</label>
                    <input type="text" id="waka_custom_title" value={wakaCustomTitle} onChange={e => setWakaCustomTitle(e.target.value)} placeholder="WakaTime Stats" />
                  </div>
                  <div className="input-box">
                    <label htmlFor="waka_card_width">Largura (px)</label>
                    <input type="number" id="waka_card_width" min="270" value={wakaCardWidth} onChange={e => setWakaCardWidth(parseInt(e.target.value) || 466)} />
                  </div>
                </div>

                <div className="box">
                  <div className="input-box">
                    <label htmlFor="waka_hide">Ocultar linguagens</label>
                    <input type="text" id="waka_hide" value={wakaHide} onChange={e => setWakaHide(e.target.value)} placeholder="javascript,html" />
                  </div>
                  <div className="input-box">
                    <label htmlFor="waka_langs_count">Nº de linguagens</label>
                    <input type="number" id="waka_langs_count" min="1" max="20" value={wakaLangsCount} onChange={e => setWakaLangsCount(e.target.value ? parseInt(e.target.value) : "")} placeholder="ex: 5" />
                  </div>
                </div>

                <div className="box">
                  <BooleanSelect id="waka_hide_title" label="Ocultar título" value={wakaHideTitle} onChange={setWakaHideTitle} />
                  <BooleanSelect id="waka_hide_progress" label="Ocultar progresso" value={wakaHideProgress} onChange={setWakaHideProgress} />
                </div>

                <div className="box">
                  <div className="input-box">
                    <label htmlFor="waka_layout">Layout</label>
                    <select id="waka_layout" value={wakaLayout} onChange={e => setWakaLayout(e.target.value as any)}>
                      {WAKATIME_LAYOUTS.map(l => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="input-box">
                    <label htmlFor="waka_display_format">Formato</label>
                    <select id="waka_display_format" value={wakaDisplayFormat} onChange={e => setWakaDisplayFormat(e.target.value as any)}>
                      {WAKATIME_DISPLAY_FORMATS.map(f => (
                        <option key={f} value={f}>
                          {f === "time" ? "Tempo" : "Percentagem"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="box">
                  <BooleanSelect id="waka_disable_animations" label="Desativar animações" value={wakaDisableAnimations} onChange={setWakaDisableAnimations} />
                  <div className="input-box">
                    <label htmlFor="waka_line_height">Altura da linha</label>
                    <input type="number" id="waka_line_height" min="10" value={wakaLineHeight} onChange={e => setWakaLineHeight(parseInt(e.target.value) || 25)} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="container">
          <div className="intro">
            <h2>Preview do Stats</h2>
          </div>

          <div className="content">
            <div className="bag-code">
              {loading && <p>A carregar...</p>}
              {imageUrl && !loading && (
                <>
                  <figure>
                    <img
                      src={imageUrl}
                      alt={`Pré-visualização das estatísticas de ${type}`}
                      width={type === "github" ? cardWidth : wakaCardWidth}
                      height="auto"
                      onError={e => {
                        ;(e.target as HTMLImageElement).alt = "Erro ao carregar. Verifique se o utilizador existe e tem perfil público."
                      }}
                    />
                  </figure>
                  <CodeCard code={markdown} lang="Markdown" />
                  <CodeCard code={`<img src="${imageUrl}" alt="${type === "github" ? "GitHub Stats" : "WakaTime Stats"}" width="${type === "github" ? cardWidth : wakaCardWidth}" height="auto" loading="lazy" />`} lang="HTML" />
                </>
              )}
              {!imageUrl && !loading && <p>Seleccione um tipo e preencha os campos obrigatórios para ver a pré-visualização.</p>}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
