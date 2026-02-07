import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const username = searchParams.get("username")
  const repo = searchParams.get("repo")

  if (!username || !repo) {
    return NextResponse.json({ exists: false })
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${username}/${repo}`)

    if (response.status === 200) {
      return NextResponse.json({ exists: true })
    } else if (response.status === 404) {
      return NextResponse.json({ exists: false })
    } else {
      return NextResponse.json({ exists: false })
    }
  } catch (error) {
    return NextResponse.json({ exists: false })
  }
}
