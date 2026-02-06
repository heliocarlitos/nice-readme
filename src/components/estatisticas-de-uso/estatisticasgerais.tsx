"use client"

import { useState, useEffect } from "react"
import "./estatisticasgerais.css"

import { db } from "@/lib/firebase"
import { collection, getDocs, query, orderBy } from "firebase/firestore"

interface UsoRegistro {
  username: string
  tool: string
  timestamp: Date
}

const FERRAMENTAS = [
  { id: "badge", nome: "Badges" },
  { id: "profile-views", nome: "Perfil Views" },
  { id: "streak-stats", nome: "Streak Stats" },
  { id: "github-stats", nome: "GitHub Stats" },
  { id: "top-langs", nome: "Top Languages" },
  { id: "repo-pin", nome: "Pin Repositório" },
  { id: "gist-pin", nome: "Pins Gist" },
  { id: "wakatime-stats", nome: "WakaTime Stats" }
]

export function EstatisticasGerais() {
  const [registros, setRegistros] = useState<UsoRegistro[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregarDados() {
      try {
        const q = query(collection(db, "tool_usage"), orderBy("timestamp", "desc"))
        const snapshot = await getDocs(q)

        const dados = snapshot.docs.map(doc => {
          const data = doc.data()
          return {
            username: data.username,
            tool: data.tool,
            timestamp: data.timestamp.toDate()
          }
        })

        setRegistros(dados)
      } catch (err) {
        console.error("Erro ao carregar estatísticas:", err)
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [])

  if (carregando) {
    return <p className="estatisticasgerais">A carregar estatísticas...</p>
  }

  const agora = new Date()

  const formatarNumero = (num: number): string => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + "B"
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "k"
    return num.toString()
  }

  const estaNoDia = (data: Date) => data.getFullYear() === agora.getFullYear() && data.getMonth() === agora.getMonth() && data.getDate() === agora.getDate()

  const estaNaSemana = (data: Date) => {
    const diffTempo = Math.abs(agora.getTime() - data.getTime())
    const diffDias = Math.ceil(diffTempo / (1000 * 60 * 60 * 24))
    return diffDias <= 7
  }

  const estaNoMes = (data: Date) => data.getFullYear() === agora.getFullYear() && data.getMonth() === agora.getMonth()

  const estaNoAno = (data: Date) => data.getFullYear() === agora.getFullYear()

  const contarPorFerramenta = (filtro: (d: Date) => boolean) => {
    const contagem: Record<string, number> = {}

    FERRAMENTAS.forEach(f => {
      contagem[f.id] = 0
    })

    registros.forEach(r => {
      if (filtro(r.timestamp)) {
        contagem[r.tool] = (contagem[r.tool] || 0) + 1
      }
    })

    return Object.entries(contagem)
      .map(([toolId, qtd]) => {
        const nome = FERRAMENTAS.find(f => f.id === toolId)?.nome || toolId
        return { toolId, nome, qtd }
      })
      .sort((a, b) => b.qtd - a.qtd)
  }

  const hoje = contarPorFerramenta(estaNoDia)
  const semana = contarPorFerramenta(estaNaSemana)
  const mes = contarPorFerramenta(estaNoMes)
  const ano = contarPorFerramenta(estaNoAno)
  const geral = contarPorFerramenta(() => true)

  return (
    <div className="estatisticasgerais">
      <h2>Estatísticas Gerais de Uso</h2>

      <p className="atualizacao">Actualizado em: {agora.toLocaleString("pt-PT", { dateStyle: "long", timeStyle: "short" })}</p>

      <div className="content">
        <section className="seccao">
          <h3>Mais usadas hoje</h3>
          <table>
            <thead>
              <tr>
                <th>Ferramenta</th>
                <th>Utilizações</th>
              </tr>
            </thead>
            <tbody>
              {hoje.map(item => (
                <tr key={item.toolId}>
                  <td>{item.nome}</td>
                  <td>{formatarNumero(item.qtd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="seccao">
          <h3>Mais usadas na última semana</h3>
          <table>
            <thead>
              <tr>
                <th>Ferramenta</th>
                <th>Utilizações</th>
              </tr>
            </thead>
            <tbody>
              {semana.map(item => (
                <tr key={item.toolId}>
                  <td>{item.nome}</td>
                  <td>{formatarNumero(item.qtd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="seccao">
          <h3>Mais usadas no último mês</h3>
          <table>
            <thead>
              <tr>
                <th>Ferramenta</th>
                <th>Utilizações</th>
              </tr>
            </thead>
            <tbody>
              {mes.map(item => (
                <tr key={item.toolId}>
                  <td>{item.nome}</td>
                  <td>{formatarNumero(item.qtd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="seccao">
          <h3>Mais usadas no último ano</h3>
          <table>
            <thead>
              <tr>
                <th>Ferramenta</th>
                <th>Utilizações</th>
              </tr>
            </thead>
            <tbody>
              {ano.map(item => (
                <tr key={item.toolId}>
                  <td>{item.nome}</td>
                  <td>{formatarNumero(item.qtd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <section className="seccao destaque">
        <h3>Ranking geral (todas as utilizações)</h3>
        <table>
          <thead>
            <tr>
              <th>Posição</th>
              <th>Ferramenta</th>
              <th>Total de utilizações</th>
            </tr>
          </thead>
          <tbody>
            {geral.map((item, index) => (
              <tr key={item.toolId}>
                <td>{index + 1}º</td>
                <td>{item.nome}</td>
                <td>{formatarNumero(item.qtd)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <p className="total-registos">
        Total de registos analisados: <strong>{registros.length}</strong>
      </p>
    </div>
  )
}
