"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import "./grid-todos-usuarios.css"
import Image from "next/image"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { Botao } from "@/components/btn/botao/botao"
import { FaSearch } from "react-icons/fa"

interface GitHubUser {
  username: string
  name: string | null
  followers: number
}

export function GridTodosUsuarios() {
  const [allUsers, setAllUsers] = useState<GitHubUser[]>([])
  const [visibleCount, setVisibleCount] = useState(8)
  const [filteredUsers, setFilteredUsers] = useState<GitHubUser[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const loaderRef = useRef<HTMLDivElement>(null)

  // Buscar todos os utilizadores únicos
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, "tool_usage"), orderBy("timestamp", "desc"))
        const snapshot = await getDocs(q)
        const uniqueUsernames = Array.from(new Set(snapshot.docs.map(doc => (doc.data() as { username: string }).username))).filter(u => u && u !== "anonymous")

        const githubPromises = uniqueUsernames.map(async username => {
          try {
            const res = await fetch(`https://api.github.com/users/${username}`)
            if (!res.ok) return null
            const data = await res.json()
            return {
              username,
              name: data.name || data.login,
              followers: data.followers || 0
            }
          } catch {
            return null
          }
        })

        const results = await Promise.all(githubPromises)
        const validUsers = results.filter((user): user is GitHubUser => user !== null)
        setAllUsers(validUsers)
        setFilteredUsers(validUsers.slice(0, 8))
      } catch (error) {
        console.error("Erro ao buscar utilizadores:", error)
        setAllUsers([])
        setFilteredUsers([])
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Actualizar lista filtrada sempre que houver pesquisa ou mudança nos dados
  useEffect(() => {
    let result = allUsers
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase()
      result = allUsers.filter(user => user.username.toLowerCase().includes(term) || (user.name && user.name.toLowerCase().includes(term)))
    }
    setFilteredUsers(result.slice(0, visibleCount))
  }, [searchTerm, allUsers, visibleCount])

  // Função para carregar mais ao rolar
  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + 4, filteredUsers.length))
  }, [filteredUsers.length])

  // Observar scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && filteredUsers.length > visibleCount) {
          loadMore()
        }
      },
      { threshold: 1.0 }
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current)
      }
    }
  }, [loadMore, filteredUsers.length, visibleCount])

  if (loading) {
    return (
      <div className="text">
        <p>A carregar...</p>
      </div>
    )
  }

  return (
    <>
      <label htmlFor="pesquisar" className="input-search">
        <div className="icon">
          <FaSearch />
        </div>
        <input
          id="pesquisar"
          type="text"
          placeholder="Pesquisar usuário..."
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value)
            setVisibleCount(8)
          }}
        />
      </label>

      <div className="grid-todos-usuarios">
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <Botao
              key={user.username}
              className="card"
              href={`https://github.com/${user.username}`}
              target="_blank"
              content={
                <>
                  <figure>
                    <Image src={`https://github.com/${user.username}.png`} width={100} height={100} alt={`Foto de perfil do Github de ${user.username}`} unoptimized loading="lazy" />
                  </figure>
                  <div className="detal">
                    <p className="tt">{user.name}</p>
                    <p className="text">{user.followers} seguidores</p>
                  </div>
                </>
              }
            />
          ))
        ) : (
          <p>Nenhum utilizador encontrado.</p>
        )}

        <div ref={loaderRef} style={{ height: "1px" }} />
      </div>
    </>
  )
}
