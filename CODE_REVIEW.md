# Code Review Frontend — varredura completa

## Escopo analisado
- Estrutura do projeto e documentação.
- HTML semântico, acessibilidade e SEO.
- CSS (organização, responsividade e performance).
- JavaScript (arquitetura, segurança, estado e manutenção).
- Confiabilidade de dependências externas e ativos.

## Diagnóstico executivo
- **Nível geral:** bom para um site estático de portfólio, com boa UX visual e funcionalidades práticas (busca, filtros, ordenação, tema e exportação).
- **Riscos principais:** uso de `innerHTML` com dados dinâmicos sem sanitização, dependência total de CDNs sem fallback/SRI, possíveis vazamentos/performance por rebind de eventos/animações em re-render.
- **Prioridade recomendada:** corrigir segurança e robustez primeiro, depois acessibilidade avançada e organização de código.

## Pontos fortes
1. **Boa base de UX e funcionalidades**
   - Busca, filtros, ordenação e métricas trazem navegação eficiente.
2. **Uso de variáveis CSS e tema**
   - Tokens em `:root` e modo claro/escuro facilitam consistência visual.
3. **Responsividade inicial adequada**
   - Breakpoints para grid e stats atendem cenários mobile básicos.
4. **Microinterações modernas**
   - Motion + GSAP elevam percepção de qualidade visual.

## Achados detalhados

### 1) Segurança (alta prioridade)
1. **Renderização via `innerHTML` com dados de certificado**
   - Campos como `title`, `issuer`, `skills`, `badgeUrl`, `verifyUrl` são interpolados diretamente no HTML.
   - Se esses dados forem futuramente alimentados por fonte externa, existe risco de XSS.
   - **Recomendação:** construir nós com `createElement` + `textContent`, validar URLs com allowlist (`https:`) e sanitizar quando necessário.

2. **Dependências externas sem SRI/CSP**
   - Scripts de GSAP e Motion vindos de CDN sem Subresource Integrity e sem política CSP explícita.
   - **Recomendação:** adicionar SRI quando possível e configurar `Content-Security-Policy` (meta/header), ou empacotar libs localmente.

3. **QR API terceirizada**
   - Geração de QR depende de serviço externo (`api.qrserver.com`), com impacto de privacidade/disponibilidade.
   - **Recomendação:** avaliar geração local de QR (biblioteca client-side) para reduzir dependência.

### 2) Performance (alta/média prioridade)
1. **Re-render total + reanexação de listeners a cada filtro**
   - Em cada `render()`, os cards são recriados e `attachCardPhysics()` adiciona listeners de mouse e animações novamente.
   - Em listas grandes, isso degrada desempenho.
   - **Recomendação:** usar delegação de eventos, virtualização para listas grandes e lifecycle para matar/reusar ScrollTriggers.

2. **Animações contínuas sem preferência de movimento reduzido**
   - Orbs animadas em loop e efeitos de hover/scroll sempre ativos.
   - **Recomendação:** respeitar `prefers-reduced-motion` e desligar/reduzir animações para acessibilidade e bateria.

3. **ScrollTrigger sem limpeza explícita**
   - Triggers são criados para cada card novo; ausência de `kill()` pode acumular estado.
   - **Recomendação:** remover triggers antigos antes de novo render.

### 3) Acessibilidade (média prioridade)
1. **Input de busca sem `label` explícita**
   - Há placeholder, mas faltam labels associadas para leitores de tela.
   - **Recomendação:** adicionar `<label for="search">` e labels nos selects.

2. **Modal de zoom sem foco gerenciado**
   - Overlay abre/fecha, mas sem trap de foco, retorno de foco ao gatilho e role apropriado.
   - **Recomendação:** usar `role="dialog"`, `aria-modal="true"`, foco inicial e fechamento robusto por teclado.

3. **Estados de toggle de tema**
   - Botões de tema usam classe visual `active`, mas podem ficar melhores com `aria-pressed`.
   - **Recomendação:** refletir estado para tecnologias assistivas.

### 4) Qualidade de código e manutenção (média prioridade)
1. **HTML/CSS/JS monolítico em um único arquivo**
   - Bom para simplicidade, mas dificulta manutenção, testes e evolução.
   - **Recomendação:** separar em `styles.css`, `app.js` e, se possível, `data/certs.json`.

2. **Dados de exemplo hardcoded**
   - IDs e links placeholders (`SEU-ID`) podem confundir produção.
   - **Recomendação:** padronizar ambiente de dados (JSON real) com validação de schema.

3. **Inconsistência entre README e implementação**
   - README cita categorias no plural (ex.: “Certificações”, “Diplomas”), enquanto o HTML usa singular em opções.
   - **Recomendação:** alinhar nomenclaturas para evitar filtros quebrados por divergência de conteúdo.

4. **Constante `LINKEDIN` vazia no runtime**
   - O botão é ocultado por lógica condicional, o que é correto funcionalmente, mas deveria vir de configuração explícita.

### 5) SEO, resiliência e entrega (média/baixa prioridade)
1. **Metadados sociais ausentes**
   - Falta Open Graph/Twitter cards para compartilhamento.
2. **Ausência de favicon/manifests e sem versionamento de assets**
   - Pode prejudicar branding/caching.
3. **Dependência de arquivos `perfil@2x.webp` e `perfil@3x.webp` não presentes no repositório**
   - `srcset` referencia arquivos inexistentes.
   - **Recomendação:** adicionar os arquivos ou remover as referências para evitar 404.

## Plano de ação sugerido (ordem)
1. **Segurança:** eliminar `innerHTML` para conteúdo dinâmico + validação de URLs + CSP/SRI.
2. **Performance:** controlar lifecycle do ScrollTrigger e reduzir custo de render/listeners.
3. **Acessibilidade:** labels, `aria-pressed`, dialog acessível e `prefers-reduced-motion`.
4. **Manutenibilidade:** modularizar CSS/JS e padronizar fonte de dados.
5. **Documentação:** alinhar README com comportamento real e revisar exemplos.

## Checklist objetivo (pass/fail)
- [ ] Sem `innerHTML` para dados externos.
- [ ] URLs validadas antes de inserir em `href/src`.
- [ ] Dependências CDN com estratégia de fallback/integridade.
- [ ] `prefers-reduced-motion` implementado.
- [ ] Labels e atributos ARIA essenciais implementados.
- [ ] Re-render sem acumular listeners/triggers.
- [ ] README consistente com opções reais da UI.
- [ ] `srcset` sem assets ausentes.

## Conclusão
A base é visualmente sólida e já oferece boa experiência para um portfólio estático. Com as correções prioritárias de segurança, performance e acessibilidade, o projeto evolui para um padrão de frontend mais robusto e pronto para crescer com baixo risco técnico.
