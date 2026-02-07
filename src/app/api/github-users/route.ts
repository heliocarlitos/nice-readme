import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")

  if (!username) {
    return NextResponse.json({ error: "Username é obrigatório" }, { status: 400 })
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN

  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: "Token GitHub não configurado" }, { status: 500 })
  }

  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json"
      }
    })

    if (!res.ok) {
      return NextResponse.json({ error: "Utilizador não encontrado" }, { status: res.status })
    }

    const data = await res.json()

    return NextResponse.json({
      login: data.login,
      name: data.name,
      followers: data.followers || 0
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao contactar GitHub" }, { status: 500 })
  }
}
