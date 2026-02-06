"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore"
import Image from "next/image"
import "./admin.css"
import { FaPowerOff, FaRegTrashCan } from "react-icons/fa6"
import { FaSearch } from "react-icons/fa"
import { EstatisticasGerais } from "@/components/estatisticas-de-uso/estatisticasgerais"

interface ToolUsage {
  id: string
  username: string
  tool: string
  timestamp: Date
}

interface AdminCredentials {
  authenticated: boolean
  user: string
}

function abreviarNumero(num: number): string {
  if (num < 1000) return num.toString()
  const unidades = ["", "k", "M", "B"]
  let indice = 0
  let valor = num
  while (valor >= 1000 && indice < unidades.length - 1) {
    valor /= 1000
    indice++
  }
  const formatado = valor.toFixed(valor % 1 === 0 ? 0 : 1)
  return formatado + unidades[indice]
}

export default function AdminDashboard() {
  const [credentials, setCredentials] = useState<AdminCredentials>({ authenticated: false, user: "" })
  const [loginUser, setLoginUser] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  const [searchTerm, setSearchTerm] = useState("")
  const [userDetails, setUserDetails] = useState<{
    username: string
    name: string | null
    avatar: string
    followers: number
  } | null>(null)
  const [tools, setTools] = useState<ToolUsage[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth")
    if (auth) {
      try {
        const data = JSON.parse(auth)
        if (data && data.expiry > Date.now()) {
          setCredentials({ authenticated: true, user: data.user })
        }
      } catch {
        localStorage.removeItem("admin_auth")
      }
    }
  }, [])

  const handleLogin = async () => {
    if (!loginUser || !loginPassword) {
      setLoginError("Preencha todos os campos.")
      return
    }

    try {
      const q = query(collection(db, "admin"), where("user", "==", loginUser), where("password", "==", loginPassword))
      const snapshot = await getDocs(q)
      if (!snapshot.empty) {
        const expiry = Date.now() + 2 * 60 * 60 * 1000
        localStorage.setItem("admin_auth", JSON.stringify({ user: loginUser, expiry }))
        setCredentials({ authenticated: true, user: loginUser })
        setLoginError("")
      } else {
        setLoginError("Credenciais inválidas.")
      }
    } catch (error) {
      setLoginError("Erro ao conectar ao banco de dados.")
    }
  }

  const handleSearch = async () => {
    if (!credentials.authenticated || !searchTerm.trim()) return

    setLoading(true)
    setMessage("")
    setUserDetails(null)
    setTools([])

    try {
      const usernameLower = searchTerm.trim().toLowerCase()

      const q = query(collection(db, "tool_usage"), where("username", "==", usernameLower))
      const snapshot = await getDocs(q)

      if (snapshot.empty) {
        setMessage("Este utilizador não tem registos no sistema.")
        setLoading(false)
        return
      }

      const usage: ToolUsage[] = []
      snapshot.forEach(doc => {
        usage.push({
          id: doc.id,
          username: doc.data().username,
          tool: doc.data().tool,
          timestamp: doc.data().timestamp.toDate()
        })
      })

      const ghRes = await fetch(`https://api.github.com/users/${encodeURIComponent(searchTerm.trim())}`)
      if (!ghRes.ok) {
        setMessage("Utilizador não encontrado no GitHub.")
        setLoading(false)
        return
      }
      const ghData = await ghRes.json()

      setUserDetails({
        username: ghData.login,
        name: ghData.name || ghData.login,
        avatar: ghData.avatar_url,
        followers: ghData.followers
      })

      setTools(usage)
    } catch (error) {
      setMessage("Erro ao carregar os dados.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    const overlay = document.createElement("div")
    overlay.className = "admin-delete-overlay"
    overlay.innerHTML = `
      <div class="admin-delete-popup">
        <p>Tem a certeza que deseja eliminar todos os dados deste utilizador?</p>
        <div class="admin-delete-buttons">
          <button class="admin-delete-cancel">Cancelar</button>
          <button class="admin-delete-confirm">Eliminar</button>
        </div>
      </div>
    `
    document.body.appendChild(overlay)

    const cancelBtn = overlay.querySelector(".admin-delete-cancel") as HTMLButtonElement
    const confirmBtn = overlay.querySelector(".admin-delete-confirm") as HTMLButtonElement

    cancelBtn.onclick = () => document.body.removeChild(overlay)

    confirmBtn.onclick = async () => {
      try {
        for (const tool of tools) {
          await deleteDoc(doc(db, "tool_usage", tool.id))
        }
        setTools([])
        setUserDetails(null)
        setMessage("Utilizador removido com sucesso. Não existem mais registos.")
        document.body.removeChild(overlay)
      } catch (error) {
        setMessage("Erro ao eliminar os dados.")
        document.body.removeChild(overlay)
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_auth")
    setCredentials({ authenticated: false, user: "" })
  }

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") action()
  }

  if (!credentials.authenticated) {
    return (
      <div className="admin-login-overlay">
        <div className="admin-login-popup">
          <h2>Acesso Restrito</h2>
          <input type="text" placeholder="Nome de utilizador" value={loginUser} onChange={e => setLoginUser(e.target.value)} onKeyDown={e => handleKeyDown(e, handleLogin)} className="admin-input" />
          <input type="password" placeholder="Palavra-passe" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} onKeyDown={e => handleKeyDown(e, handleLogin)} className="admin-input" />
          {loginError && <p className="admin-error">{loginError}</p>}
          <button onClick={handleLogin} className="admin-btn">
            Entrar
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="admin-container">
        <header className="admin-header">
          <h1>Dashboard de Administração</h1>
          <button onClick={handleLogout} className="admin-logout-btn">
            <div className="icon">
              <FaPowerOff />
            </div>
            Sair
          </button>
        </header>

        <div className="admin-search-section">
          <input type="text" placeholder="Pesquisar username..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyDown={e => handleKeyDown(e, handleSearch)} className="admin-input" />
          <button onClick={handleSearch} className="btn-geral" disabled={loading}>
            <div className="icon">
              <FaSearch />
            </div>
            {loading ? "A procurar..." : "Pesquisar"}
          </button>
        </div>

        {message && <p className="admin-message">{message}</p>}

        {userDetails && (
          <div className="admin-user-card">
            <div className="admin-user-header">
              <Image src={userDetails.avatar} alt={`Foto de ${userDetails.username}`} width={80} height={80} className="admin-avatar" />
              <div>
                <h2>{userDetails.name}</h2>
                <p>@{userDetails.username}</p>
                <p>{abreviarNumero(userDetails.followers)} seguidores</p>
              </div>
            </div>

            <div className="admin-tools-section">
              <h3>Ferramentas Utilizadas ({tools.length})</h3>
              {tools.length > 0 ? (
                <ul className="admin-tools-list">
                  {tools.map(tool => (
                    <li key={tool.id} className="admin-tool-item">
                      <span className="admin-tool-name">{tool.tool}</span>
                      <span className="admin-tool-date">{tool.timestamp.toLocaleString("pt-PT")}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhuma ferramenta utilizada.</p>
              )}
            </div>

            {tools.length > 0 && (
              <button onClick={handleDelete} className="admin-delete-btn">
                <div className="icon">
                  <FaRegTrashCan />
                </div>
                Eliminar usuário
              </button>
            )}
          </div>
        )}
      </div>
      <EstatisticasGerais />
    </>
  )
}
