"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import "./users-github.css"
import user_default from "@/assets/user_default.webp"
import { Botao } from "@/components/btn/botao/botao"
import { db } from "@/lib/firebase"
import { collection, getCountFromServer, getDocs, query, orderBy, limit } from "firebase/firestore"

export function UsersGithub() {
  const [users, setUsers] = useState<string[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const countSnapshot = await getCountFromServer(collection(db, "tool_usage"))
        setTotalCount(countSnapshot.data().count)

        const q = query(collection(db, "tool_usage"), orderBy("timestamp", "desc"), limit(20))
        const snapshot = await getDocs(q)

        const uniqueUsernames = Array.from(new Set(snapshot.docs.map(doc => (doc.data() as { username: string }).username)))
          .filter(username => username && username.trim().length > 0 && username !== "anonymous")
          .map(u => u.trim())

        setUsers(uniqueUsernames.slice(0, 15))
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
        setUsers([])
        setTotalCount(0)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="users-github">A carregar...</div>
  }

  const exibidos = users.length
  const restantes = totalCount - exibidos
  const deveMostrarBotao = restantes > 0

  return (
    <div className="users-github">
      {users.map((username, index) => (
        <Botao
          key={`${username}-${index}`}
          className="btn-user"
          href={`https://github.com/${username}`}
          target="_blank"
          content={
            <figure>
              <Image
                loading="lazy"
                src={`https://github.com/${username}.png`}
                alt={`Foto de perfil do ${username}`}
                width={40}
                height={40}
                onError={e => {
                  ;(e.target as HTMLImageElement).src = user_default.src
                }}
              />
              <figcaption>{username}</figcaption>
            </figure>
          }
        />
      ))}

      {deveMostrarBotao && <Botao className="todos-user btn-user" href="/todos-usuarios" content={`+${restantes}`} />}
    </div>
  )
}
