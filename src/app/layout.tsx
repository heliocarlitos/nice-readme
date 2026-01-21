import React from "react"
import { Header } from "@/components/header/header"
import "./globals.css"
import { LenisWrapper } from "@/components/leniswrapper/page"

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt">
      <body>
        <Header />
        <LenisWrapper>
          <main>{children}</main>
        </LenisWrapper>
      </body>
    </html>
  )
}
