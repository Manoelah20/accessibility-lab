# Accessibility Lab

> **Auditoria automatizada de acessibilidade para aplicações web.**

O **Accessibility Lab** é uma aplicação web desenvolvida para analisar páginas acessíveis por URL, identificar problemas de acessibilidade com **axe-core** e transformar os resultados em informações técnicas para investigação, priorização e correção.

**Aplicação:** <https://accessibility-lab-orcin.vercel.app>

O projeto foi desenvolvido com foco em **Front-end moderno, acessibilidade Web, automação de testes, integração com APIs, segurança de entrada e qualidade de software**.

---

## Sobre o projeto

Uma auditoria automatizada pode identificar diversos problemas de acessibilidade, mas o valor do resultado está em conseguir entender:

* **o que foi identificado;**
* **qual é o impacto;**
* **quais elementos foram afetados;**
* **qual critério ou regra está relacionado;**
* **como investigar e corrigir o problema.**

O Accessibility Lab foi construído justamente para trabalhar esse fluxo.

A aplicação recebe uma URL, abre a página em um navegador automatizado, executa o **axe-core**, processa os resultados e apresenta as violações de forma organizada.

---

## Principais funcionalidades

### Auditoria por URL

O usuário informa uma URL pública e a aplicação:

1. valida a entrada;
2. verifica o protocolo HTTP/HTTPS;
3. aplica regras de proteção para determinados endereços locais e privados;
4. abre a página com Playwright;
5. executa a auditoria com axe-core;
6. processa os resultados;
7. apresenta o relatório na interface.

### Análise das violações

Cada problema identificado pode apresentar:

* ID da regra;
* descrição;
* nível de impacto;
* categoria;
* critérios WCAG relacionados;
* elementos afetados;
* seletor CSS;
* evidência retornada pelo axe-core;
* orientação de correção;
* documentação da regra.

### Classificação por impacto

| Impacto  | Prioridade |
| -------- | ---------- |
| Critical | Muito alta |
| Serious  | Alta       |
| Moderate | Média      |
| Minor    | Baixa      |

Os resultados podem ser filtrados por nível de impacto.

### Categorias de acessibilidade

As violações são organizadas em categorias utilizadas pela aplicação:

* Perceptível
* Operável
* Compreensível
* Robusto
* Boas práticas
* Outros

Quando disponível, a aplicação também apresenta a relação com critérios WCAG.

### Score

O projeto possui uma métrica própria de **0 a 100** para facilitar a interpretação dos resultados.

A pontuação considera o impacto das violações e a quantidade de elementos afetados.

> **Importante:** esse score é uma métrica criada para o Accessibility Lab. Ele não representa percentual oficial de conformidade com WCAG e não substitui uma avaliação de acessibilidade.

### Busca e filtros

É possível pesquisar os resultados por informações como:

* ID da regra;
* descrição;
* tags;
* elementos afetados;
* seletores;
* evidências.

### Exportação

Os resultados podem ser:

* copiados em **Markdown**;
* exportados em **JSON**.

O relatório Markdown pode ser utilizado como base para documentação técnica, abertura de issues ou acompanhamento de correções.

---

## Arquitetura

O fluxo principal da aplicação é:

```text
URL informada pelo usuário
        ↓
Interface
        ↓
POST /api/audit
        ↓
Validação da URL
        ↓
Proteção contra determinados endereços locais/privados
        ↓
Playwright + Chromium
        ↓
Carregamento da página
        ↓
axe-core
        ↓
Resultados da auditoria
        ↓
Classificação e cálculo do score
        ↓
Interface de análise
        ↓
Filtros / detalhes / exportação
```

A aplicação utiliza o **Next.js App Router**, mantendo a execução do navegador automatizado no ambiente do servidor.

---

## Principais decisões técnicas

### Next.js

O Next.js é utilizado tanto para a interface quanto para a API responsável pela auditoria.

A execução do Playwright fica concentrada no servidor, evitando colocar a automação do navegador diretamente no cliente.

### Playwright

O Playwright é utilizado para carregar a página real em um navegador automatizado antes da execução da auditoria.

Isso permite analisar páginas públicas e aplicações web que podem ser renderizadas no navegador.

### Axe-core

O axe-core é o motor responsável pela identificação automatizada das violações.

Os resultados são posteriormente tratados pela aplicação para apresentação, classificação e geração do relatório.

### TypeScript

A tipagem é utilizada entre API, utilitários e interface para representar:

* resultados da auditoria;
* violações;
* impactos;
* nós afetados;
* filtros;
* informações do relatório.

### Separação da lógica

A lógica de classificação, score, critérios WCAG e geração de relatório foi concentrada em:

```text
src/lib/audit-utils.ts
```

Isso mantém regras de negócio separadas dos componentes de apresentação.

---

## Estrutura do projeto

```text
accessibility-lab/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── audit/
│   │   │       └── route.ts
│   │   │
│   │   ├── components/
│   │   │   ├── AuditStatus.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── ImpactFilters.tsx
│   │   │   ├── ImpactSummary.tsx
│   │   │   ├── ViolationCard.tsx
│   │   │   └── ViolationSection.tsx
│   │   │
│   │   ├── test-page/
│   │   │   └── page.tsx
│   │   │
│   │   ├── test-page-ok/
│   │   │   └── page.tsx
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── lib/
│   │   └── audit-utils.ts
│   │
│   └── types/
│       └── audit.ts
│
├── tests/
│   ├── accessibility/
│   ├── api/
│   ├── ui/
│   └── utils/
│
├── playwright.config.ts
├── package.json
└── README.md
```

---

## Testes automatizados

O projeto utiliza **Playwright Test** e possui cobertura de diferentes camadas da aplicação.

Atualmente são **30 testes automatizados** cobrindo:

### Acessibilidade

* detecção de violações intencionais;
* execução do axe-core;
* página com problemas;
* página sem violações automatizadas;
* estrutura acessível da própria interface.

### API

* URL obrigatória;
* URL inválida;
* protocolo não permitido;
* bloqueio de determinados endereços locais;
* auditoria bem-sucedida;
* contrato da resposta da API;
* página sem violações;
* score retornado.

### Interface

* formulário de auditoria;
* navegação por teclado;
* Skip Link;
* estados de carregamento;
* mensagens de erro;
* filtros;
* pesquisa;
* detalhes das violações;
* score;
* cópia do relatório;
* download do JSON;
* estado de auditoria aprovada.

### Utilitários

* cálculo do score;
* diferentes níveis de impacto;
* múltiplas violações;
* múltiplos elementos afetados;
* cenário sem violações.

---

## Executando localmente

### Pré-requisitos

* Node.js
* npm

### Instalação

```bash
npm install
```

### Ambiente de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em:

```text
http://localhost:3000
```

### Testes

```bash
npx playwright test --workers=1
```

### Testes com interface

```bash
npx playwright test --ui
```

### Verificação TypeScript

```bash
npx tsc --noEmit
```

### Build de produção

```bash
npm run build
```

---

## Páginas de teste

O projeto possui duas páginas internas utilizadas para validar o comportamento da auditoria.

### `/test-page`

Página criada propositalmente com problemas de acessibilidade.

Ela contém elementos que permitem validar a detecção de violações pelo axe-core.

### `/test-page-ok`

Página criada para representar um cenário sem violações automatizadas identificadas pelo axe-core.

Esse cenário é utilizado nos testes para validar:

```text
0 violações
Score: 100
```

---

## Acessibilidade da própria aplicação

O Accessibility Lab também considera acessibilidade na construção da própria interface.

Entre as práticas utilizadas estão:

* HTML semântico;
* Skip Link;
* navegação por teclado;
* foco visual;
* labels associados aos campos;
* regiões `aria-live`;
* mensagens de status acessíveis;
* estados de carregamento;
* hierarquia de títulos;
* nomes acessíveis para controles;
* contraste visual.

A interface também é submetida a testes automatizados.

> Passar em uma auditoria automatizada não significa que uma interface seja totalmente acessível.

---

## Segurança da entrada

Como a aplicação recebe uma URL fornecida pelo usuário e utiliza um navegador automatizado para acessá-la, a API possui uma camada específica de validação.

São verificadas, entre outras condições:

* existência da URL;
* formato válido;
* protocolo HTTP/HTTPS;
* determinados endereços locais;
* determinados endereços privados.

Essa validação busca reduzir riscos associados ao acesso automatizado a recursos internos ou que não deveriam ser analisados.

---

## Limitações

O Accessibility Lab realiza **auditoria automatizada de aplicações web acessíveis por URL**.

Ele não substitui uma avaliação completa de acessibilidade.

Alguns problemas dependem de avaliação humana e podem não ser identificados automaticamente, como:

* qualidade e clareza do conteúdo;
* ordem de leitura;
* experiência real com leitor de tela;
* comportamento complexo de componentes;
* adequação dos textos e instruções;
* experiência de navegação;
* fluxos específicos da aplicação;
* contexto de uso.

Uma avaliação completa deve combinar automação com testes manuais e, quando possível, testes com usuários.

### Escopo atual

O projeto é destinado a:

* páginas web públicas;
* aplicações web;
* SPAs;
* aplicações React;
* aplicações Next.js;
* aplicações Angular;
* aplicações Vue;
* outras aplicações acessíveis por URL.

Aplicações móveis nativas para Android ou iOS não fazem parte do escopo atual da ferramenta.

---

## Tecnologias

### Front-end

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS 4

### Auditoria

* axe-core
* @axe-core/playwright
* Playwright
* Chromium

### Qualidade

* Playwright Test
* TypeScript
* ESLint

### Deploy

* Vercel

---

## Resultado do projeto

O Accessibility Lab foi desenvolvido como um projeto prático para explorar a integração entre:

```text
Front-end
+
Acessibilidade
+
Automação
+
API
+
Testes
+
Segurança
+
Análise de resultados
```

Mais do que apresentar uma interface de auditoria, o projeto demonstra uma abordagem de desenvolvimento baseada em **separação de responsabilidades, validação de entradas, testes automatizados, análise técnica e preocupação com acessibilidade desde a própria construção da aplicação**.

---

## Status

**Projeto concluído e publicado.**

Aplicação em produção:

**<https://accessibility-lab-orcin.vercel.app>**

Repositório:

**<https://github.com/Manoelah20/accessibility-lab>**
