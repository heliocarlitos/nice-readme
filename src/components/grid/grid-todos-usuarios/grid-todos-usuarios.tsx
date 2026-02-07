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

export function GridTodosUsuarios() {
  const [allUsers, setAllUsers] = useState<GitHubUser[]>([])
  const [visibleCount, setVisibleCount] = useState(8)
  const [filteredUsers, setFilteredUsers] = useState<GitHubUser[]>([])
  const [displayedUsers, setDisplayedUsers] = useState<GitHubUser[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const loaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, "tool_usage"), orderBy("timestamp", "desc"))
        const snapshot = await getDocs(q)
        const uniqueUsernames = Array.from(new Set(snapshot.docs.map(doc => (doc.data() as { username: string }).username))).filter(u => u && u !== "anonymous")

        const githubPromises = uniqueUsernames.map(async username => {
          try {
            const res = await fetch(`/api/github-users?username=${username}`)
            if (!res.ok) return null
            const data = await res.json()
            return {
              username,
              name: data.name || username,
              followers: data.followers || 0
            }
          } catch {
            return null
          }
        })

        const results = await Promise.all(githubPromises)
        const validUsers = results.filter((user): user is GitHubUser => user !== null)
        setAllUsers(validUsers)
      } catch (error) {
        console.error("Erro ao buscar utilizadores:", error)
        setAllUsers([])
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    let result = allUsers

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase()
      result = allUsers.filter(user => user.username.toLowerCase().includes(term) || (user.name && user.name.toLowerCase().includes(term)))
    }

    setFilteredUsers(result)
    setVisibleCount(8)
  }, [searchTerm, allUsers])

  useEffect(() => {
    setDisplayedUsers(filteredUsers.slice(0, visibleCount))
  }, [filteredUsers, visibleCount])

  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + 8, filteredUsers.length))
  }, [filteredUsers.length])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && displayedUsers.length < filteredUsers.length) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current)
      }
    }
  }, [loadMore, displayedUsers.length, filteredUsers.length])

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
        <input id="pesquisar" type="text" placeholder="Pesquisar utilizador..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </label>

      <div className="grid-todos-usuarios">
        {displayedUsers.length > 0 ? (
          displayedUsers.map(user => (
            <Botao
              key={user.username}
              className="card"
              href={`https://github.com/${user.username}`}
              target="_blank"
              content={
                <>
                  <figure className="user-photo">
                    <Image src={`https://github.com/${user.username}.png`} width={100} height={100} alt={`Foto de perfil do GitHub de ${user.username}`} unoptimized loading="lazy" />
                  </figure>
                  <div className="detal">
                    <p className="tt">{user.name}</p>
                    <p className="text">
                      {abreviarNumero(user.followers)} seguidor{user.followers <= 1 ? "" : "es"}
                    </p>
                  </div>
                </>
              }
            />
          ))
        ) : (
          <p>Nenhum utilizador encontrado.</p>
        )}

        {displayedUsers.length < filteredUsers.length && <div ref={loaderRef} style={{ height: "20px" }} />}
      </div>
    </>
  )
}
