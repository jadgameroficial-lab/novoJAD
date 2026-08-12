# JAD — Site institucional

Landing page da JAD (Engenharia Digital Inteligente), construída em Next.js 16 (App Router), React 19, TypeScript e Tailwind CSS v4, com GSAP, Motion, Lenis, Three.js/React Three Fiber e shadcn/ui.

## Requisitos

- Node.js 20 ou superior
- npm

## Instalação

```bash
npm install
```

## Comandos

```bash
npm run dev      # servidor de desenvolvimento em http://localhost:3000
npm run build    # build de produção
npm run start    # roda o build de produção (rodar "build" antes)
npm run lint      # ESLint
npm run test      # roda a suíte de testes (Vitest)
npm run test:watch
```

## Estrutura

```
app/            rotas do App Router (page, layout, favicon/OG dinâmicos, sitemap, robots)
components/     componentes React organizados por seção (hero, sections, nav, motion, ui)
lib/            conteúdo do site (content.ts), fontes, regras de conteúdo
hooks/          hooks compartilhados (mobile, reduced motion)
public/         imagens estáticas (cases reais em /public/cases) e fontes
test/           setup e mocks do Vitest
```

## Antes de publicar

- `lib/content.ts` — todo o texto do site vem daqui. Não use travessão (—) em nenhum texto visível (há um teste automático que garante isso).
- `app/sitemap.ts`, `app/robots.ts` e `app/layout.tsx` usam um domínio placeholder (`https://jad.com.br`). Troque pelo domínio real antes do deploy.
- A seção de clientes (`ClientsMarquee`) está com nomes placeholder até haver logos/nomes reais de clientes para substituir.
- Depoimentos e métricas numéricas foram deixados de fora propositalmente até existirem dados reais — não preencha com números fictícios.

## Deploy

Projeto pronto para deploy na Vercel (`vercel deploy` ou import do repositório pelo painel da Vercel). Nenhum deploy foi feito por mim — a publicação fica a seu critério.
