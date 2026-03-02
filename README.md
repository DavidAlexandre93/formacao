# david-fernandes.github.io

Portfólio público de certificados, certificações e diplomas.

## Estrutura

- `index.html`: estrutura da página.
- `styles.css`: estilos e responsividade.
- `app.js`: lógica de filtros, renderização e acessibilidade.
- `data/certs.json`: fonte de dados das credenciais.

## Recursos

- Filtro por categoria e emissor.
- Busca por título, emissor e skills.
- Ordenação por data e título.
- Tema claro/escuro com `aria-pressed`.
- Modal acessível para visualizar documentos.
- Exportação para PDF via impressão.

## Categorias usadas na UI

- Certificações
- Graduações
- MBA
- Pós-Graduação

## Como atualizar os dados

Edite `data/certs.json` com os campos:

- `id`
- `title`
- `issuer`
- `category`
- `issueDate` (YYYY-MM)
- `expireDate` (YYYY-MM ou vazio)
- `verifyUrl` (somente `https`)
- `badgeUrl` (somente `https`)
- `logoUrl` (somente `https`)
- `skills` (array)
- `docs` (array com `label` e `imagePath` local ou `url` https)

## Segurança aplicada

- Renderização dinâmica com `createElement` + `textContent`.
- Validação de URLs antes de inserir em `href`/`src`.
- `Content-Security-Policy` restritiva no HTML.

## Publicação

Com GitHub Pages, publique a branch principal com a raiz do repositório.
