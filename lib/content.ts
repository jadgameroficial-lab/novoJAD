export interface SiteContent {
  nav: { items: { label: string; href: string }[]; ctaLabel: string; ctaHref: string };
  hero: {
    badge: string;
    headline: string;
    headlineShortAlt: string;
    subheadline: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
  clients: { headline: string; subheadline: string; names: string[] };
  authority: { items: string[] };
  tagline: { lines: string[] };
  faq: { headline: string; items: { question: string; answer: string }[] };
  solutions: {
    headline: string;
    subheadline: string;
    items: { title: string; description: string }[];
  };
  process: {
    headline: string;
    steps: { title: string; description: string }[];
  };
  tech: { headline: string; subheadline: string; stack: string[] };
  cases: {
    headline: string;
    subheadline: string;
    items: { title: string; category: string; image: string }[];
  };
  differentiators: {
    headline: string;
    items: { title: string; description: string }[];
  };
  finalCta: { headline: string; subheadline: string; cta: { label: string; href: string } };
  footer: { wordmark: string; wordmarkFull: string; tagline: string; stack: string; links: { label: string; href: string }[] };
}

export const content: SiteContent = {
  nav: {
    items: [
      { label: "Soluções", href: "#solucoes" },
      { label: "Processo", href: "#processo" },
      { label: "Tecnologia", href: "#tecnologia" },
      { label: "Cases", href: "#cases" },
    ],
    ctaLabel: "Falar com especialista",
    ctaHref: "#cta-final",
  },
  hero: {
    badge: "ENGENHARIA DIGITAL INTELIGENTE",
    headline: "Construímos sistemas inteligentes para empresas que querem evoluir.",
    // Alternativa curta (até 6 palavras), aprovada para testes futuros. Não usar em produção sem confirmação explícita.
    headlineShortAlt: "Engenharia que constrói o futuro.",
    subheadline:
      "Criamos softwares, plataformas digitais e soluções com inteligência artificial para transformar processos complexos em experiências simples, eficientes e escaláveis.",
    primaryCta: { label: "Conhecer soluções", href: "#solucoes" },
    secondaryCta: { label: "Falar com especialista", href: "#cta-final" },
  },
  clients: {
    headline: "Empresas que buscam o próximo nível.",
    subheadline:
      "Tecnologia, automação e inteligência para organizações que querem evoluir seus processos e criar novas possibilidades.",
    names: ["Placeholder Co.", "Norte Sistemas", "Vetor Digital", "Alfa Tech", "Cinza Labs"],
  },
  authority: {
    items: [
      "Arquitetura moderna",
      "Desenvolvimento escalável",
      "Tecnologias atuais",
      "Processo estruturado",
      "Segurança e performance",
    ],
  },
  tagline: {
    lines: ["Tecnologia não é sobre código.", "É sobre transformar como sua empresa decide, opera e cresce."],
  },
  faq: {
    headline: "Perguntas frequentes.",
    items: [
      {
        question: "O que a JAD desenvolve?",
        answer:
          "Sistemas inteligentes, plataformas digitais, soluções de inteligência artificial e automação de processos, sempre construídos sob medida para o negócio do cliente.",
      },
      {
        question: "Por que escolher uma solução sob medida em vez de uma pronta?",
        answer:
          "Uma solução sob medida é desenhada para o seu processo real, não o contrário. Isso evita pagar por funcionalidades que você não usa e garante exatamente o que sua operação precisa para escalar.",
      },
      {
        question: "A JAD trabalha com inteligência artificial?",
        answer:
          "Sim. Aplicamos IA para automatizar tarefas, melhorar decisões e criar eficiência operacional, sempre integrada à arquitetura do sistema, não como um recurso isolado.",
      },
      {
        question: "Quanto tempo leva um projeto?",
        answer:
          "Depende do escopo. Definimos prazo com clareza logo na etapa de Descoberta, antes de qualquer compromisso, para que você saiba exatamente o que esperar.",
      },
      {
        question: "A JAD consegue evoluir um sistema já existente?",
        answer:
          "Sim. Trabalhamos tanto com projetos novos quanto com a modernização de sistemas legados, sempre avaliando o que vale a pena manter e o que precisa ser reconstruído.",
      },
      {
        question: "A JAD constrói plataformas SaaS?",
        answer: "Sim, incluindo arquitetura, autenticação, escalabilidade e a base técnica para o produto crescer com o negócio.",
      },
      {
        question: "Como funciona o processo de desenvolvimento?",
        answer:
          "Cinco etapas claras: Descoberta, Estratégia, Design, Desenvolvimento e Evolução contínua. Você acompanha cada uma, sem caixa preta.",
      },
      {
        question: "Como eu inicio um projeto com a JAD?",
        answer:
          "Fale com o nosso time pelo botão Falar com especialista em qualquer parte do site. Respondemos em até um dia útil com os próximos passos.",
      },
    ],
  },
  solutions: {
    headline: "Tecnologia criada para desafios reais.",
    subheadline: "Da estratégia à automação, construímos os sistemas que sustentam o crescimento da sua empresa.",
    items: [
      {
        title: "Sistemas Personalizados",
        description: "Desenvolvemos softwares personalizados para conectar pessoas, processos e dados.",
      },
      {
        title: "Plataformas SaaS",
        description: "Construímos plataformas SaaS escaláveis, prontas para crescer com o negócio.",
      },
      {
        title: "Inteligência Artificial",
        description: "Criamos soluções inteligentes capazes de automatizar tarefas e aumentar a eficiência operacional.",
      },
      {
        title: "Automação Inteligente",
        description: "Integramos sistemas e eliminamos atividades repetitivas com automação inteligente.",
      },
      {
        title: "Experiências Digitais",
        description: "Criamos interfaces premium, sites institucionais e experiências digitais de alto impacto.",
      },
    ],
  },
  process: {
    headline: "Da ideia ao sistema em produção.",
    steps: [
      { title: "01 • Descoberta", description: "Entendimento do negócio, objetivos e desafios." },
      { title: "02 • Estratégia", description: "Definição da arquitetura, tecnologia e direcionamento." },
      { title: "03 • Design", description: "Criação da experiência visual e interface." },
      { title: "04 • Desenvolvimento", description: "Construção do produto utilizando tecnologias modernas." },
      { title: "05 • Evolução", description: "Melhoria contínua, análise e escala." },
    ],
  },
  tech: {
    headline: "Construído com as melhores tecnologias.",
    subheadline:
      "Utilizamos ferramentas modernas de desenvolvimento, inteligência artificial e arquitetura digital para criar soluções rápidas, seguras e escaláveis.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "GSAP", "Three.js", "Vercel"],
  },
  cases: {
    headline: "Projetos desenvolvidos para transformar negócios.",
    subheadline: "Cada projeto nasce de um desafio específico e evolui para uma solução capaz de gerar impacto real.",
    items: [
      { title: "Almeida & Torres Advogados", category: "Serviços Jurídicos", image: "/cases/almeida-torres.webp" },
      { title: "Clara Odontologia", category: "Saúde e Clínicas", image: "/cases/clara-odontologia.webp" },
      { title: "Kōji", category: "Hospitalidade e Restaurantes", image: "/cases/koji.webp" },
      { title: "Nova Studio", category: "Agências Criativas", image: "/cases/nova-studio.webp" },
      { title: "Nexora AI", category: "Inteligência Artificial", image: "/cases/nexora-ai.webp" },
      { title: "Brasa 77", category: "Food e Delivery", image: "/cases/brasa-77.webp" },
    ],
  },
  differentiators: {
    headline: "Mais do que desenvolvimento. Engenharia.",
    items: [
      { title: "Visão de produto", description: "Pensamos além do código. Criamos soluções alinhadas aos objetivos do negócio." },
      { title: "Arquitetura escalável", description: "Construímos sistemas preparados para crescer." },
      { title: "Inteligência aplicada", description: "Usamos tecnologia para resolver problemas reais." },
      { title: "Experiência premium", description: "Unimos engenharia, design e inovação em cada detalhe." },
    ],
  },
  finalCta: {
    headline: "Pronto para construir o futuro da sua empresa?",
    subheadline: "Transforme suas ideias em sistemas inteligentes.",
    cta: { label: "Iniciar projeto", href: "#cta-final" },
  },
  footer: {
    wordmark: "JAD",
    wordmarkFull: "Just A Dream",
    tagline: "Engenharia digital inteligente.",
    stack: "Sistemas • IA • Automação",
    links: [
      { label: "Soluções", href: "#solucoes" },
      { label: "Processo", href: "#processo" },
      { label: "Cases", href: "#cases" },
    ],
  },
};
