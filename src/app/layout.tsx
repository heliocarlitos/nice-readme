import React from "react"
import { Header } from "@/components/header/header"
import "./globals.css"

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt">
      <body>
        {/* <Header /> */}
        <main>{children}</main>
      </body>
    </html>
  )
}
