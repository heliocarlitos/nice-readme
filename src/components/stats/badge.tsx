"use client"
import { useState, useEffect } from "react"
import "./stats.css"
import { CodeCard } from "../card/codecard/codecard"
import { UserImg } from "../card/userimg/userimg"

const STYLES = ["flat", "flat-square", "plastic", "for-the-badge", "social"]
const COMMON_COLORS = ["brightgreen", "green", "yellowgreen", "yellow", "orange", "red", "lightgrey", "blue", "success", "important", "critical", "inactive", "informational"]
const LOGO_SLUGS = ["android", "angular", "ansible", "apple", "assemblyscript", "bootstrap", "c", "circleci", "cplusplus", "css", "dart", "digitalocean", "discord", "docker", "dotnet", "elixir", "facebook", "figma", "firebase", "firefox", "flutter", "git", "github", "githubcopilot", "gitlab", "gmail", "gnubash", "go", "googlechrome", "googlecloud", "haskell", "html5", "intellijidea", "instagram", "ios", "javascript", "jenkins", "jira", "julia", "kotlin", "kubernetes", "linux", "lua", "mongodb", "mysql", "netlify", "nextdotjs", "nodedotjs", "notion", "npm", "php", "postgresql", "postman", "prometheus", "python", "pytorch", "r", "react", "redis", "ruby", "rust", "safari", "sass", "scala", "shell", "slackware", "snapchat", "solidity", "springboot", "sqlite", "swift", "tailwindcss", "telegram", "terraform", "tiktok", "travisci", "typescript", "vercel", "vite", "vuedotjs", "wechat", "webpack", "whatsapp", "yarn", "youtube"]

export function Badges() {
  const [type, setType] = useState<"static" | "logo">("static")
  const [label, setLabel] = useState("Github")
  const [message, setMessage] = useState("nicereadme")
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

  useEffect(() => {
    let path = ""
    if (label) {
      path = `${encodeURIComponent(label)}-${encodeURIComponent(message)}-${color}`
    } else {
      path = `${encodeURIComponent(message)}-${color}`
    }

    const params = new URLSearchParams()
    if (style && style !== "flat") params.append("style", style)
    if (type === "logo" && logo) params.append("logo", logo)
    if (logoColor) params.append("logoColor", logoColor)
    if (logoSize) params.append("logoSize", logoSize)
    if (labelColor) params.append("labelColor", labelColor)
    if (cacheSeconds) params.append("cacheSeconds", cacheSeconds)

    const url = `https://img.shields.io/badge/${path}${params.toString() ? `?${params.toString()}` : ""}`
    setImageUrl(url)

    if (linkUrl) {
      setMarkdown(`[![Badge](${url})](${linkUrl})`)
    } else {
      setMarkdown(`![Badge](${url})`)
    }

    setLoading(false)
  }, [type, label, message, color, style, logo, logoColor, logoSize, labelColor, cacheSeconds, linkUrl])

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
              <select id="badge_type" value={type} onChange={e => setType(e.target.value as any)}>
                <option value="static">Sem logotipo</option>
                <option value="logo">Com logotipo</option>
              </select>
            </div>

            <div className="box">
              <div className="input-box">
                <label htmlFor="label">Rótulo (opcional)</label>
                <input type="text" id="label" value={label} onChange={e => setLabel(e.target.value)} placeholder="ex: Github" />
              </div>
              <div className="input-box">
                <label htmlFor="message">Mensagem</label>
                <input type="text" id="message" value={message} onChange={e => setMessage(e.target.value)} placeholder="ex: passing" />
              </div>
            </div>

            <div className="box">
              <div className="input-box">
                <label htmlFor="color">Cor do fundo (Name, HEX, RGB)</label>
                <input type="text" id="color" value={color} onChange={e => setColor(e.target.value)} placeholder="ex: brightgreen, #ff69b4, rgb(255,0,0)" />
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
                <label htmlFor="style">Layout</label>
                <select id="style" value={style} onChange={e => setStyle(e.target.value)}>
                  {STYLES.map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              {type === "logo" ? (
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
              ) : (
                <div></div>
              )}
            </div>

            {type === "logo" && (
              <>
                <div className="box">
                  <div className="input-box">
                    <label htmlFor="logoColor">Cor do logotipo</label>
                    <input type="text" id="logoColor" value={logoColor} onChange={e => setLogoColor(e.target.value)} placeholder="ex: white, #ffffff, hsl(0, 0%, 100%)" />
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
                    <input type="text" id="labelColor" value={labelColor} onChange={e => setLabelColor(e.target.value)} placeholder="ex: #ff0000, red, rgb(255,0,0), hsl(0,100%,50%)" />
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
                <input type="url" id="linkUrl" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://exemplo.com" />
              </div>
              <div></div>
            </div>

            <div className="box">
              <div className="input-box">
                <label>Documentação</label>
                <a href="https://simpleicons.org/" target="_blank" rel="noopener noreferrer">
                  Ver ícones disponíveis
                </a>
              </div>
              <div></div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="intro">
            <h2>Preview do Badges</h2>
          </div>

          <div className="content">
            <div className="bag-code">
              {loading && <p>A carregar...</p>}
              {imageUrl && !loading && (
                <>
                  {linkUrl ? (
                    <a href={linkUrl} target="_blank" rel="noopener noreferrer">
                      <img className="badge-preview" src={imageUrl} alt="Badge preview" />
                    </a>
                  ) : (
                    <img className="badge-preview" src={imageUrl} alt="Badge preview" />
                  )}
                  <CodeCard code={markdown} lang="Markdown" />
                  <CodeCard code={linkUrl ? `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">\n  <img src="${imageUrl}" alt="Badge" />\n</a>` : `<img src="${imageUrl}" alt="Badge" />`} lang="HTML" />
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
