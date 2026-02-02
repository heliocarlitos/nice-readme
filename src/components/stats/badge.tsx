"use client"
import { useState, useEffect } from "react"
import "./stats.css"
import { CodeCard } from "../card/codecard/codecard"
import { Botao } from "../btn/botao/botao"
import { MdOpenInNew } from "react-icons/md"

import { db } from "@/lib/firebase"
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"

const PROFILE_STYLES = ["flat", "flat-square", "plastic", "for-the-badge"]
const BADGE_STYLES = ["flat", "flat-square", "plastic", "for-the-badge", "social", "pixel"]
const COMMON_COLORS = ["brightgreen", "green", "yellowgreen", "yellow", "orange", "red", "lightgrey", "blue", "success", "important", "critical", "inactive", "informational", "grey", "blueviolet"]
const LOGO_SLUGS = ["android", "angular", "ansible", "apple", "assemblyscript", "bootstrap", "c", "circleci", "cplusplus", "css", "dart", "digitalocean", "discord", "docker", "dotnet", "elixir", "facebook", "figma", "firebase", "firefox", "flutter", "git", "github", "githubcopilot", "gitlab", "gmail", "gnubash", "go", "googlechrome", "googlecloud", "haskell", "html5", "intellijidea", "instagram", "ios", "javascript", "jenkins", "jira", "julia", "kotlin", "kubernetes", "linux", "lua", "mongodb", "mysql", "netlify", "nextdotjs", "nodedotjs", "notion", "npm", "php", "postgresql", "postman", "prometheus", "python", "pytorch", "r", "react", "redis", "ruby", "rust", "safari", "sass", "scala", "shell", "slackware", "snapchat", "solidity", "springboot", "sqlite", "swift", "tailwindcss", "telegram", "terraform", "tiktok", "travisci", "typescript", "vercel", "vite", "vuedotjs", "wechat", "webpack", "whatsapp", "yarn", "youtube"]

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

export function Badges() {
  const [type, setType] = useState<"static" | "logo" | "profile-views">("static")
  const [username, setUsername] = useState("")
  const [profileLabel, setProfileLabel] = useState("Visualizações")
  const [profileColor, setProfileColor] = useState("blue")
  const [profileStyle, setProfileStyle] = useState("for-the-badge")
  const [base, setBase] = useState("")
  const [abbreviated, setAbbreviated] = useState(false)

  const [label, setLabel] = useState("")
  const [message, setMessage] = useState("")
  const [color, setColor] = useState("blue")
  const [style, setStyle] = useState("flat")
  const [logo, setLogo] = useState("github")
  const [logoColor, setLogoColor] = useState("")
  const [logoSize, setLogoSize] = useState("")
  const [labelColor, setLabelColor] = useState("")
  const [cacheSeconds, setCacheSeconds] = useState("")
  const [linkUrl, setLinkUrl] = useState("")

  const [imageUrl, setImageUrl] = useState("")
  const [markdown, setMarkdown] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)

      if (type !== "profile-views" || !username.trim()) return

      const cleanUsername = username.trim().toLowerCase()
      const tool = "profile-views"

      const existsInDb = await checkUsageExists(cleanUsername, tool)
      if (existsInDb) return

      const existsOnGitHub = await checkGitHubUserExists(username)
      if (!existsOnGitHub) return

      await addDoc(collection(db, "tool_usage"), {
        username: cleanUsername,
        tool,
        timestamp: new Date()
      })
    } catch {}
  }

  useEffect(() => {
    let url = ""
    let md = ""

    setLoading(true)

    if (type === "profile-views") {
      if (!username.trim()) {
        setImageUrl("")
        setMarkdown("")
        setLoading(false)
        return
      }

      const params = new URLSearchParams()
      params.append("username", username.trim())
      if (profileLabel.trim() && profileLabel !== "Visualizações") params.append("label", profileLabel.trim())
      if (profileColor.trim() && profileColor !== "blue") params.append("color", profileColor.trim())
      if (profileStyle) params.append("style", profileStyle)
      if (base.trim()) params.append("base", base.trim())
      if (abbreviated) params.append("abbreviated", "true")

      url = `https://komarev.com/ghpvc/?${params.toString()}`
      md = `[![${profileLabel}](${url})](https://github.com/${username.trim()})`
    } else {
      if (!message.trim()) {
        setImageUrl("")
        setMarkdown("")
        setLoading(false)
        return
      }

      let path = label.trim() ? `${label.trim()}-${message.trim()}-${color.trim()}` : `${message.trim()}-${color.trim()}`

      const params = new URLSearchParams()
      if (style) params.append("style", style)
      if (type === "logo" && logo) params.append("logo", logo)
      if (logoColor.trim()) params.append("logoColor", logoColor.trim())
      if (logoSize) params.append("logoSize", logoSize)
      if (labelColor.trim()) params.append("labelColor", labelColor.trim())
      if (cacheSeconds.trim()) params.append("cacheSeconds", cacheSeconds.trim())

      url = `https://img.shields.io/badge/${path}${params.toString() ? `?${params.toString()}` : ""}`
      md = linkUrl.trim() ? `[![Badge](${url})](${linkUrl.trim()})` : `![Badge](${url})`
    }

    setImageUrl(url)
    setMarkdown(md)

    const img = new Image()
    img.onload = () => setLoading(false)
    img.onerror = () => setLoading(false)
    img.src = url
  }, [type, username, profileLabel, profileColor, profileStyle, base, abbreviated, label, message, color, style, logo, logoColor, logoSize, labelColor, cacheSeconds, linkUrl])

  const BooleanSelect = ({ id, label: selectLabel, value, onChange }: { id: string; label: string; value: boolean; onChange: (v: boolean) => void }) => (
    <div className="input-box">
      <label htmlFor={id}>{selectLabel}</label>
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
              <label htmlFor="badge_type">Tipo de badge</label>
              <select id="badge_type" value={type} onChange={e => setType(e.target.value as "static" | "logo" | "profile-views")}>
                <option value="static">Sem logotipo</option>
                <option value="logo">Com logotipo</option>
                <option value="profile-views">Visualizações de perfil</option>
              </select>
            </div>

            {type === "profile-views" ? (
              <>
                <div className="input-box">
                  <label htmlFor="username">
                    Nome de utilizador <span>*</span>
                  </label>
                  <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value.trim())} placeholder="heliocarlitos" />
                </div>

                <div className="box">
                  <div className="input-box">
                    <label htmlFor="profileLabel">Rótulo</label>
                    <input type="text" id="profileLabel" value={profileLabel} onChange={e => setProfileLabel(e.target.value)} placeholder="Visualizações" />
                  </div>
                  <div className="input-box">
                    <label htmlFor="profileColor">Cor do fundo (nome ou HEX)</label>
                    <input type="text" id="profileColor" value={profileColor} onChange={e => setProfileColor(e.target.value.trim())} placeholder="ex: blue, #007ec6" />
                  </div>
                </div>

                <div className="box">
                  <div className="input-box">
                    <label htmlFor="profileStyle">Estilo</label>
                    <select id="profileStyle" value={profileStyle} onChange={e => setProfileStyle(e.target.value)}>
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
                  <BooleanSelect id="abbreviated" label="Abreviar número (ex: 1.2K)" value={abbreviated} onChange={setAbbreviated} />
                  <div></div>
                </div>

                {username.trim() && (
                  <div className="info">
                    <p>
                      As visualizações são contadas a partir do momento que adicionares a badge no teu README.
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
              </>
            ) : (
              <>
                <div className="box">
                  <div className="input-box">
                    <label htmlFor="label">Rótulo (opcional)</label>
                    <input type="text" id="label" value={label} onChange={e => setLabel(e.target.value)} placeholder="ex: Github" />
                  </div>
                  <div className="input-box">
                    <label htmlFor="message">
                      Mensagem <span>*</span>
                    </label>
                    <input type="text" id="message" value={message} onChange={e => setMessage(e.target.value.trim())} placeholder="ex: nicereadme" />
                  </div>
                </div>

                <div className="box">
                  <div className="input-box">
                    <label htmlFor="color">Cor do fundo (nome ou HEX)</label>
                    <input type="text" id="color" value={color} onChange={e => setColor(e.target.value.trim())} placeholder="ex: blue, #007ec6" />
                  </div>
                  <div className="input-box">
                    <label htmlFor="common_colors">Cores comuns</label>
                    <select id="common_colors" value={color} onChange={e => setColor(e.target.value)}>
                      {COMMON_COLORS.map(c => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="box">
                  <div className="input-box">
                    <label htmlFor="style">Estilo</label>
                    <select id="style" value={style} onChange={e => setStyle(e.target.value)}>
                      {BADGE_STYLES.map(s => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  {type === "logo" && (
                    <div className="input-box">
                      <label htmlFor="logo">Logotipo (Simple Icons)</label>
                      <select id="logo" value={logo} onChange={e => setLogo(e.target.value)}>
                        {LOGO_SLUGS.map(slug => (
                          <option key={slug} value={slug}>
                            {slug}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {type === "logo" && (
                  <>
                    <div className="box">
                      <div className="input-box">
                        <label htmlFor="logoColor">Cor do logotipo</label>
                        <input type="text" id="logoColor" value={logoColor} onChange={e => setLogoColor(e.target.value.trim())} placeholder="ex: white, #ffffff" />
                      </div>
                      <div className="input-box">
                        <label htmlFor="logoSize">Tamanho do logotipo</label>
                        <select id="logoSize" value={logoSize} onChange={e => setLogoSize(e.target.value)}>
                          <option value="">Padrão</option>
                          <option value="auto">Auto</option>
                        </select>
                      </div>
                    </div>

                    <div className="box">
                      <div className="input-box">
                        <label htmlFor="labelColor">Cor do rótulo</label>
                        <input type="text" id="labelColor" value={labelColor} onChange={e => setLabelColor(e.target.value.trim())} placeholder="ex: #ff0000, red" />
                      </div>
                      <div className="input-box">
                        <label htmlFor="cacheSeconds">Cache (segundos)</label>
                        <input type="number" id="cacheSeconds" value={cacheSeconds} onChange={e => setCacheSeconds(e.target.value)} placeholder="ex: 3600" />
                      </div>
                    </div>
                  </>
                )}

                <div className="box">
                  <div className="input-box">
                    <label htmlFor="linkUrl">Link ao clicar (opcional)</label>
                    <input type="url" id="linkUrl" value={linkUrl} onChange={e => setLinkUrl(e.target.value.trim())} placeholder="https://exemplo.com" />
                  </div>
                  <div></div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="container">
          <div className="intro">
            <h2>Preview do Badge</h2>
          </div>

          <div className="content">
            <div className="bag-code">
              {loading && <p>A carregar...</p>}

              {imageUrl && !loading && (
                <>
                  {linkUrl && type !== "profile-views" ? (
                    <a href={linkUrl} target="_blank" rel="noopener noreferrer">
                      <img className="badge-preview" src={imageUrl} alt="Pré-visualização do badge" loading="lazy" />
                    </a>
                  ) : (
                    <img className="badge-preview" src={imageUrl} alt="Pré-visualização do badge" loading="lazy" />
                  )}

                  <CodeCard code={markdown} lang="Markdown" onCopy={() => handleCopy(markdown)} />

                  <CodeCard code={linkUrl && type !== "profile-views" ? `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer"><img src="${imageUrl}" alt="Badge" loading="lazy" /></a>` : `<img src="${imageUrl}" alt="${type === "profile-views" ? profileLabel : "Badge"}" loading="lazy" />`} lang="HTML" onCopy={() => handleCopy(linkUrl && type !== "profile-views" ? `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer"><img src="${imageUrl}" alt="Badge" loading="lazy" /></a>` : `<img src="${imageUrl}" alt="${type === "profile-views" ? profileLabel : "Badge"}" loading="lazy" />`)} />
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
