import { IoBugOutline } from "react-icons/io5"
import { Botao } from "../botao/botao"
import "./reportarbug.css"

export function ReportarBug() {
  return (
    <>
      <div className="reportarbug">
        <Botao
          href="https://github.com/heliocarlitos/nice-readme/issues/new"
          target="_blank"
          content={
            <>
              <div className="icon">
                <IoBugOutline />
              </div>
            </>
          }
        />
      </div>
    </>
  )
}
