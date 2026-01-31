import React from "react"
import { Header } from "@/components/header/header"
import "./globals.css"
import { LenisWrapper } from "@/components/leniswrapper/page"
import TopProgressLoader from "@/components/topprogressloader/TopProgressLoader"
import { IrparaTop } from "@/components/btn/irparatop/irparatop"

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt">
      <body>
        <TopProgressLoader />
        <Header />
        <LenisWrapper>
          <main>{children}</main>
        </LenisWrapper>
        <IrparaTop />
      </body>
    </html>
  )
}
