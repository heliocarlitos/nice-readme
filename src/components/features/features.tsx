import { Botao } from "../btn/botao/botao"
import { TitleSection } from "../intro/title-section/title-section"
import "./features.css"

export function Features() {
  const features = [
    {
      id: "1",
      title: "GitHub Streak Stats",
      desc: "Exibe a sequência contínua de contribuições diárias no GitHub. Incentiva consistência, reforça disciplina e motiva o utilizador ao mostrar o progresso directamente no README do perfil público",
      link: "/streak-stats",
      img: <img src="https://github-streak-stats-ruby.vercel.app/?user=heliocarlitos&theme=default&hide_border=false&border_radius=4.5&locale=pt_BR&short_numbers=false&mode=daily&disable_animations=false&card_width=466&card_height=194&hide_total_contributions=false&hide_current_streak=false&hide_longest_streak=false" alt="GitHub Streak de heliocarlitos" width={466} height={194} loading="lazy" />
    },
    {
      id: "2",
      title: "Github Stats",
      desc: "Mostra um cartão com estatísticas completas do GitHub: commits totais, repositórios, pull requests, issues, linguagens mais usadas e outras métricas importantes. Oferece uma visão clara e rápida da actividade.",
      link: "/github-stats",
      img: <img src="https://helio-github-stats.vercel.app/api?username=heliocarlitos&custom_title=GitHub+Stats&theme=default&title_color=2f80ed&text_color=434d58&icon_color=4c71f2&ring_color=2f80ed&border_color=e4e2e2&hide_border=false&locale=en&border_radius=4.5&card_width=466&hide_title=false&hide_rank=false&rank_icon=default&show_icons=false&include_all_commits=false&line_height=25&text_bold=true&disable_animations=false&number_format=short" alt="GitHub Stats de heliocarlitos" width={466} height={194} loading="lazy" />,
      figure_className: ""
    },
    {
      id: "3",
      title: "WakaTime Stats",
      desc: "Apresenta estatísticas detalhadas do WakaTime: tempo total de codificação, linguagens mais utilizadas, editores, sistemas operativos e ferramentas. Revela os teus hábitos reais de programação de forma visual.",
      link: "/wakatime",
      img: <img src="https://helio-github-stats.vercel.app/api/wakatime?username=heliocarlitos&custom_title=WakaTime+Stats&card_width=466&line_height=25&layout=default&display_format=time&disable_animations=false" alt="WakaTime Stats de heliocarlitos" width={466} loading="lazy" />,
      figure_className: ""
    },
    {
      id: "4",
      title: "Pin Repositório ",
      desc: "Permite fixar repositórios importantes no topo do README, independentemente da popularidade ou data de criação. Destaca os teus melhores projectos e melhora a apresentação do teu perfil.",
      link: "/repo-pins",
      img: <img src="https://helio-github-stats.vercel.app/api/pin?username=heliocarlitos&repo=nice-readme&theme=default&hide_border=false&border_radius=4.5&card_width=466" alt="Repositório destacado" width={466} loading="lazy" />,
      figure_className: ""
    },
    {
      id: "5",
      title: "Pins Gist",
      desc: "Possibilita fixar Gists relevantes no topo do README. Dá destaque a trechos de código, configurações ou notas importantes, mesmo que não sejam os mais visualizados ou recentes.",
      link: "/gist-pins",
      img: <img src="https://helio-github-stats.vercel.app/api/gist?id=709fbee67b48e330507b9b7f10fef16f&theme=default&hide_border=false&border_radius=4.5&card_width=466&locale=pt-br" alt="Gist destacado" width={466} loading="lazy" />,
      figure_className: ""
    },
    {
      id: "6",
      title: "Top Languages",
      desc: "Exibe e fixa as linguagens de programação mais usadas no topo do README. Mostra percentagens claras e actualizadas, ajudando visitantes a compreenderem rapidamente as tuas principais tecnologias.",
      link: "/top-langs",
      img: <img src="https://helio-github-stats.vercel.app/api/top-langs?username=heliocarlitos&layout=normal&stats_format=percentages&theme=default&hide_border=false&border_radius=4.5&card_width=466&locale=pt-br&custom_title=Linguagens+mais+usadas" alt="Linguagens mais usadas" width={466} loading="lazy" />
    },
    {
      id: "7",
      title: "Badges",
      desc: "Cria badges simples, com logotipo ou sem logotipo. Ideais para mostrar versões, licenças, estado ou outras métricas, incluem ligação clicável que permitem direcionar o visitante para repositórios, sites, documentação ou perfis.",
      link: "/badges",
      img: <img src="https://img.shields.io/badge/Github-nicereadme-blue?style=flat" alt="Badge simples" loading="lazy" />,
      figure_className: "w-real"
    },
    {
      id: "8",
      title: "Badge de Visualizações",
      desc: "Mostra o número total de visualizações do teu perfil GitHub. É um indicador simples e popular da visibilidade e interesse gerado pelo teu perfil e README.",
      link: "/views-badge",
      img: <img src="https://komarev.com/ghpvc/?username=heliocarlitos&style=for-the-badge" alt="Visualizações do perfil" loading="lazy" />,
      figure_className: "w-real"
    }
  ]

  return (
    <>
      <section className="features">
        <TitleSection title="Funcionalidades" text="Cada gerador permite personalização completa: temas, cores, estilos de badge, idiomas, tamanhos de cartão, formatação de números, exclusão de itens, entre outros. As pré-visualizações apresentadas nestas páginas utilizam sempre as configurações padrão, sem qualquer alteração visual ou funcional aplicada." />
        {features.map(feature => (
          <div className="card-feature" key={feature.id}>
            <div className="info">
              <div className="detal">
                <div className="tt">{feature.title}</div>
                <p className="text">{feature.desc}</p>
              </div>
              <Botao className="btn-experimentar btn-geral" href={feature.link} content="Experimentar" />
            </div>

            <figure className={feature.figure_className}>{feature.img}</figure>
          </div>
        ))}
      </section>
    </>
  )
}
