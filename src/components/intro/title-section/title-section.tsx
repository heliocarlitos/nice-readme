import "./title-section.css"

interface TitleSectionProps {
  title?: string
  text?: string
}

export function TitleSection({ title, text }: TitleSectionProps) {
  return (
    <>
      <div className="title-section">
        <h1>{title}</h1>
        <p className="text">{text}</p>
      </div>
    </>
  )
}
