## Política de Privacidade e Utilização de Dados

Este projecto recolhe e armazena informações mínimas quando utilizas qualquer uma das ferramentas e copias o código gerado.

### Dados recolhidos

Quando copias o código de uma ferramenta, são registados automaticamente no Firestore (base de dados do Firebase) os seguintes dados:

- Nome de utilizador do GitHub (@username)
- Nome completo (se disponível no perfil público do GitHub)
- Foto de perfil (URL do avatar público do GitHub)
- Nome da ferramenta utilizada
- Data e hora exacta do uso

Estes dados são obtidos através da **API pública do GitHub**, utilizando apenas o nome de utilizador que o próprio utilizador fornece ao usar uma feramenta que requere nome de usuário. **Não é necessária qualquer autenticação ou login** no site.

### Finalidade da recolha

Os dados são guardados exclusivamente para:

- Gerar estatísticas internas de utilização
- Identificar quais ferramentas são mais usadas
- Perceber padrões de uso (horários, frequência, popularidade das ferramentas)
- Melhorar o projecto com base em dados reais de utilização

### O que **não** acontece com estes dados

- Não são utilizados para identificar ou contactar pessoalmente qualquer utilizador
- Não são partilhados com terceiros
- Não são utilizados para publicidade ou marketing
- Não são cruzados com outros dados pessoais fora do contexto público do GitHub
- Não existe qualquer rastreamento de comportamento fora das ferramentas deste site

### Armazenamento e protecção

- Os dados são armazenados no **Cloud Firestore** (Google Firebase)
- As regras de segurança do Firestore impedem alterações ou eliminação por parte de utilizadores
- Apenas o proprietário do projecto tem acesso aos dados
- Os dados são considerados públicos, uma vez que provêm exclusivamente de perfis públicos do GitHub

### Como deixar de ter os teus dados registados

Não existe actualmente um mecanismo automático de remoção ou opt-out individual.  
Se desejas que os teus dados não sejam mais registados, basta **não copiar código das ferramentas** que utilizam este mecanismo.

### Apagar seus dados

Se deseja que suas informações sejam apagadas você pode fazer uma solicitação no issues do projecto clicando [aqui](https://github.com/heliocarlitos/nice-readme/issues/new). Escreva no título do issues "Remoção de dados" e na descrição apenas seu nome de usuário do Github ou WakaTime. Dentro de 48h seus dados serão removidos, faça apenas uma vez esse pedido e não use novamente essa ferramenta.

### Transparência

Este projecto não utiliza cookies de rastreamento, não tem sistemas de analytics externos (Google Analytics, etc.) e não envia dados para serviços de terceiros além do Firebase.

Se tens dúvidas ou queres mais detalhes sobre esta política, podes abrir uma issue clicando [aqui](https://github.com/heliocarlitos/nice-readme/issues/new).

Última actualização: 02 de Fevereiro de 2026 pelas 12:48:14
