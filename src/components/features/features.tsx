import { Botao } from "../btn/botao/botao"
import "./features.css"

export function Features() {
  const features = [
    {
      id: "1",
      title: "GitHub Readme Streak Stats",
      desc: "Exibe a sequência contínua de contribuições diárias no GitHub. Incentiva consistência, reforça disciplina e motiva o utilizador ao mostrar o progresso directamente no README do perfil público.",
      link: "/streak-stats",
      img: <img src="https://github-streak-stats-ruby.vercel.app/?user=heliocarlitos&theme=default&hide_border=false&border_radius=4.5&locale=pt_BR&short_numbers=false&mode=daily&disable_animations=false&card_width=466&card_height=194&hide_total_contributions=false&hide_current_streak=false&hide_longest_streak=false" alt="GitHub Streak de heliocarlitos" width={466} height={194} loading="lazy" />
    },
    {
      id: "2",
      title: "Git Readme Stats",
      desc: "Mostra um cartão com estatísticas completas do GitHub: commits totais, repositórios, pull requests, issues, linguagens mais usadas e outras métricas importantes. Oferece uma visão clara e rápida da actividade.",
      link: "/stats",
      img: <img src="https://helio-github-stats.vercel.app/api?username=heliocarlitos&custom_title=GitHub+Stats&theme=default&title_color=2f80ed&text_color=434d58&icon_color=4c71f2&ring_color=2f80ed&border_color=e4e2e2&hide_border=false&locale=en&border_radius=4.5&card_width=466&hide_title=false&hide_rank=false&rank_icon=default&show_icons=false&include_all_commits=false&line_height=25&text_bold=true&disable_animations=false&number_format=short" alt="GitHub Stats de heliocarlitos" width={466} height={194} loading="lazy" />,
      figure_className: ""
    },
    {
      id: "3",
      title: "WakaTime Stats",
      desc: "Apresenta estatísticas detalhadas do WakaTime: tempo total de codificação, linguagens mais utilizadas, editores, sistemas operativos e ferramentas. Revela os teus hábitos reais de programação de forma visual.",
      link: "/stats",
      img: <img src="https://helio-github-stats.vercel.app/api/wakatime?username=heliocarlitos&custom_title=WakaTime+Stats&card_width=466&line_height=25&layout=default&display_format=time&disable_animations=false" alt="WakaTime Stats de heliocarlitos" width={466} loading="lazy" />,
      figure_className: ""
    },
    {
      id: "4",
      title: "Pins (Repositórios destacados)",
      desc: "Permite fixar repositórios importantes no topo do README, independentemente da popularidade ou data de criação. Destaca os teus melhores projectos e melhora a apresentação do teu perfil.",
      link: "/extra-pins",
      img: <img src="https://helio-github-stats.vercel.app/api/pin?username=heliocarlitos&repo=nice-readme&theme=default&hide_border=false&border_radius=4.5&card_width=466" alt="Repositório destacado" width={466} loading="lazy" />,
      figure_className: ""
    },
    {
      id: "5",
      title: "Pins Gist",
      desc: "Possibilita fixar Gists relevantes no topo do README. Dá destaque a trechos de código, configurações ou notas importantes, mesmo que não sejam os mais visualizados ou recentes.",
      link: "/extra-pins",
      img: <img src="https://helio-github-stats.vercel.app/api/gist?id=709fbee67b48e330507b9b7f10fef16f&theme=default&hide_border=false&border_radius=4.5&card_width=466&locale=pt-br" alt="Gist destacado" width={466} loading="lazy" />,
      figure_className: ""
    },
    {
      id: "6",
      title: "Pins Top Languages",
      desc: "Exibe e fixa as linguagens de programação mais usadas no topo do README. Mostra percentagens claras e actualizadas, ajudando visitantes a compreenderem rapidamente as tuas principais tecnologias.",
      link: "/extra-pins",
      img: <img src="https://helio-github-stats.vercel.app/api/top-langs?username=heliocarlitos&layout=normal&stats_format=percentages&theme=default&hide_border=false&border_radius=4.5&card_width=466&locale=pt-br&custom_title=Linguagens+mais+usadas" alt="Linguagens mais usadas" width={466} loading="lazy" />
    },
    {
      id: "7",
      title: "Badges sem logo",
      desc: "Cria badges simples e elegantes sem logotipo. Transmitem informação de forma visualmente atractiva, limpa e profissional, ideais para mostrar versões, licenças, estado ou outras métricas.",
      link: "/badges",
      img: <img src="https://img.shields.io/badge/Github-nicereadme-blue?style=flat" alt="Badge simples" loading="lazy" />,
      figure_className: "w-real"
    },
    {
      id: "8",
      title: "Badges com logo",
      desc: "Gera badges personalizados com logotipo integrado. Comunicam informação de maneira visualmente rica e reconhecível, aumentando o impacto visual e a identificação imediata da tecnologia ou serviço.",
      link: "/badges",
      img: <img src="https://img.shields.io/badge/Github-nicereadme-blue?style=flat&logo=github" alt="Badge com logo" loading="lazy" />,
      figure_className: "w-real"
    },
    {
      figure_className: "w-real",
      id: "9",
      title: "Badges com link",
      desc: "Cria badges interativos com ou sem logotipo que incluem ligação clicável. Permitem direcionar o visitante para repositórios, sites, documentação ou perfis de forma visual e funcional.",
      link: "/badges",
      img: (
        <a href="https://github.com/heliocarlitos/nice-readme" target="_blank" rel="noopener noreferrer">
          <img src="https://img.shields.io/badge/Github-nicereadme-blue?style=flat&logo=github" alt="Badge com ligação" loading="lazy" />
        </a>
      )
    }
  ]

  return (
    <section className="features">
      {features.map(feature => (
        <div className="card-feature" key={feature.id}>
          <div className="info">
            <div className="detal">
              <div className="tt">{feature.title}</div>
              <p className="text">{feature.desc}</p>
            </div>
            <Botao className="btn-experimentar" href={feature.link} content="Experimentar" />
          </div>

          <figure className={feature.figure_className}>{feature.img}</figure>
        </div>
      ))}
    </section>
  )
}
