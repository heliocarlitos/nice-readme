import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const gistId = searchParams.get("gistId")

  if (!gistId) {
    return NextResponse.json({ exists: false })
  }

  try {
    const response = await fetch(`https://api.github.com/gists/${gistId}`)

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
