import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")

  if (!username || !username.trim()) {
    return NextResponse.json({ exists: false }, { status: 400 })
  }

  const token = process.env.GITHUB_TOKEN

  if (!token) {
    return NextResponse.json({ error: "Token não configurado" }, { status: 500 })
  }

  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username.trim())}`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json"
      }
    })

    return NextResponse.json({ exists: res.status === 200 })
  } catch {
    return NextResponse.json({ exists: false })
  }
}
