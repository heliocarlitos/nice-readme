import React from "react"
import { Header } from "@/components/header/header"
import "./globals.css"
import { LenisWrapper } from "@/components/leniswrapper/page"
import TopProgressLoader from "@/components/topprogressloader/TopProgressLoader"

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt">
      <body>
        <TopProgressLoader />
        <Header />
        <LenisWrapper>
          <main>{children}</main>
        </LenisWrapper>
      </body>
    </html>
  )
}
