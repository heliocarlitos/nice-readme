import { ReportarBug } from "@/components/btn/reportarbug/reportarbug"
import { Badges } from "@/components/stats/badge"
import { PinsAndLangs } from "@/components/stats/pins"

export default function Page() {
  return (
    <>
      <PinsAndLangs />
      <ReportarBug />
    </>
  )
}
