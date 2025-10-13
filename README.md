# david-fernandes.github.io

**Portfólio público de Certificados, Certificações, Diplomas e Projetos**  
Construído em **HTML/CSS/JS** (uma única página), com busca, filtros, ordenação, QR de verificação e modo claro/escuro.

👉 **Site:** https://david-fernandes.github.io/  
🌐 **Website oficial:** https://www.davidalexandrefernandes.com.br/  
🔗 **LinkedIn:** https://www.linkedin.com/in/david-fernandes-08b005b4/  
💻 **GitHub:** https://github.com/DavidAlexandre93

---

## ✨ Recursos

- Filtros por **Categoria** e **Emissor**
- Busca por título/emissor/skills
- Ordenação (mais recentes, mais antigos, A→Z)
- **QR Code** automático para links de verificação
- Modo **Claro/Escuro**
- Botão **Exportar (Imprimir/PDF)**

---

## 🚀 Publicação (GitHub Pages)

1. Garanta que o arquivo principal chama-se **`index.html`** na raiz do repositório.
2. Vá em **Settings → Pages**  
   - **Source:** *Deploy from a branch*  
   - **Branch:** `main` — **/root**  
3. Salve e aguarde o deploy. O site ficará disponível em `https://<seu-usuario>.github.io/`.

> Este repositório já está preparado: apenas mantenha o `index.html` na raiz.

---

## 🛠️ Como editar seus certificados

Abra o arquivo **`index.html`** e localize o bloco:

```js
// ========= DATA (edite aqui) =========
const CERTS = [
  {
    id: "AZ-204",
    title: "AZ-204: Developing Solutions for Microsoft Azure",
    issuer: "Microsoft",
    category: "Certificações",
    issueDate: "",
    expireDate: "",
    verifyUrl: "",
    badgeUrl: "",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    skills: ["Azure", "APIs", "Functions", "App Services", "DevOps"]
  },
];

--- 

## Campos aceitos

- id: identificador opcional que você usa (ex.: código do exame)

- title: título do certificado/curso/diploma

- issuer: emissor (ex.: Microsoft, Udemy, Alura…)

- category: uma das opções abaixo

- issueDate: YYYY-MM (ex.: 2025-03)

- expireDate: YYYY-MM ou vazio

- verifyUrl: link oficial para verificação (recomendado)

- badgeUrl: imagem do badge (opcional)

- logoUrl: logo do emissor (opcional)

- skills: lista de palavras-chave

---

## Categorias disponíveis

- Certificações

- Diplomas

- Certificados

- Projetos

## Emissores disponíveis no filtro

- Microsoft

- Udemy

- Alura

- Amazon

- FIAP

- FullCycle

- USJT

- Outro

---

## QR Code

É gerado automaticamente quando verifyUrl está preenchido.

---

## 🧾 Exportar para PDF

No site publicado, use o botão “🖨️ Exportar (Imprimir/PDF)” para gerar um PDF formatado do portfólio.

---

## 📜 Licença

Este projeto está licenciado sob a MIT License.

---

## ✉️ Contato

Website: https://www.davidalexandrefernandes.com.br/

LinkedIn: https://www.linkedin.com/in/david-fernandes-08b005b4/

GitHub: https://github.com/DavidAlexandre93