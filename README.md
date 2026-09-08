# 🌐 Accessibility Lab

> Plataforma interativa de auditoria automatizada e aprendizado prático de acessibilidade web.

O **Accessibility Lab** é uma aplicação desenvolvida para explorar, de forma prática, como ferramentas automatizadas podem ajudar na identificação e compreensão de problemas de acessibilidade em páginas web.

O projeto utiliza **Next.js, TypeScript, Playwright e Axe-core** para executar auditorias, apresentar as violações encontradas, indicar o impacto de cada problema e fornecer orientações para correção.

Mais do que identificar erros, a proposta é transformar o resultado da auditoria em uma experiência de **análise, aprendizado e tomada de decisão técnica**.

---

## ✨ Funcionalidades

### 🔍 Auditoria automatizada

Informe a URL de uma página para executar uma análise automatizada utilizando:

* Playwright
* Chromium
* Axe-core

A aplicação coleta as violações encontradas e apresenta as evidências técnicas retornadas pelo motor de acessibilidade.

### 📊 Score de acessibilidade

O projeto possui uma métrica própria de **0 a 100** para facilitar a interpretação dos resultados.

O cálculo considera:

* impacto da violação;
* quantidade de elementos afetados;
* penalização progressiva conforme o número de ocorrências.

> **Importante:** esse score é uma métrica criada para o projeto e não representa um percentual oficial de conformidade com WCAG.

### 🏷️ Classificação das violações

As violações são organizadas por categorias utilizadas pelo projeto:

* **Perceptível**
* **Operável**
* **Compreensível**
* **Robusto**
* **Boas práticas**

O projeto também identifica critérios WCAG relacionados às regras conhecidas.

### 🔴 Classificação por impacto

As violações podem apresentar diferentes níveis de impacto:

* **Critical**
* **Serious**
* **Moderate**
* **Minor**

A interface permite filtrar os resultados por nível de impacto.

### 🔎 Busca de violações

É possível pesquisar resultados utilizando informações como:

* ID da regra;
* descrição;
* tags;
* elementos afetados;
* seletores.

### 🛠️ Orientação para correção

Cada violação apresenta informações técnicas e uma orientação prática sobre como resolver o problema.

O relatório pode apresentar:

* descrição da regra;
* impacto;
* categoria;
* critérios WCAG relacionados;
* elementos afetados;
* seletor;
* evidência da falha;
* orientação de correção;
* documentação técnica da regra.

### 📋 Exportação dos resultados

Os resultados da auditoria podem ser utilizados em diferentes contextos de desenvolvimento.

A aplicação permite:

* copiar o relatório em Markdown;
* baixar os dados da auditoria em JSON.

O Markdown pode ser utilizado como base para documentação técnica, issues e registros de correção.

### 🧪 Páginas de demonstração

O projeto possui páginas internas para validar o funcionamento da auditoria:

* `/test-page` — página criada propositalmente com problemas de acessibilidade;
* `/test-page-ok` — página criada para representar uma implementação sem violações automatizadas detectadas pelo Axe.

Essas páginas também são utilizadas pelos testes automatizados.

---

## 🧠 Como funciona

O fluxo principal da aplicação é:

```text
Usuário informa uma URL
        ↓
API recebe e valida a URL
        ↓
Verificação de protocolo e endereço
        ↓
Playwright abre a página
        ↓
Axe-core executa a auditoria
        ↓
Resultados são normalizados
        ↓
Regras são classificadas
        ↓
Score é calculado
        ↓
Interface apresenta os resultados
        ↓
Usuário pode analisar e exportar o relatório
```

A API também impede a análise de determinados endereços locais ou privados, reduzindo riscos relacionados à tentativa de auditoria de recursos internos.

---

## 🏗️ Arquitetura

O projeto utiliza uma organização baseada no **Next.js App Router**.

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
│   │   ├── audit-detection.spec.ts
│   │   ├── axe-local.spec.ts
│   │   └── test-page-ok.spec.ts
│   │
│   ├── api/
│   │   └── audit-api.spec.ts
│   │
│   ├── ui/
│   │   └── home.spec.ts
│   │
│   └── utils/
│       └── score.spec.ts
│
├── playwright.config.ts
├── package.json
└── README.md
```

### Principais responsabilidades

| Arquivo                | Responsabilidade                                            |
| ---------------------- | ----------------------------------------------------------- |
| `page.tsx`             | Interface principal e execução da auditoria                 |
| `api/audit/route.ts`   | Validação da URL e execução do Playwright + Axe             |
| `audit-utils.ts`       | Regras de classificação, WCAG, score e geração de relatório |
| `audit.ts`             | Tipos utilizados pelos resultados da auditoria              |
| `ViolationCard.tsx`    | Apresentação detalhada de cada violação                     |
| `ViolationSection.tsx` | Organização das violações por categoria                     |
| `ImpactFilters.tsx`    | Filtros e pesquisa                                          |
| `ImpactSummary.tsx`    | Resumo dos níveis de impacto                                |
| `AuditStatus.tsx`      | Status geral da auditoria                                   |
| `test-page/`           | Página com problemas intencionais                           |
| `test-page-ok/`        | Página de referência sem violações automatizadas            |

---

## 📊 Como o score é calculado

O score foi criado especificamente para o Accessibility Lab.

Cada nível de impacto possui uma penalização diferente:

| Impacto  | Penalização base |
| -------- | ---------------: |
| Critical |               25 |
| Serious  |               15 |
| Moderate |                8 |
| Minor    |                3 |

Quando uma mesma regra afeta vários elementos, a penalização aumenta progressivamente.

Exemplo simplificado:

```text
100
 ↓
Violações encontradas
 ↓
Aplicação das penalizações
 ↓
Ajuste pela quantidade de elementos afetados
 ↓
Score final
```

O objetivo dessa métrica é facilitar a leitura dos resultados e ajudar a priorizar correções.

Ela **não substitui uma avaliação de conformidade WCAG**.

---

## 🧪 Testes automatizados

O projeto possui uma suíte de testes utilizando **Playwright**.

Os testes estão separados por responsabilidade:

```text
tests/
├── accessibility/
├── api/
├── ui/
└── utils/
```

### Executar todos os testes

```bash
npx playwright test --workers=1
```

### Executar os testes com interface gráfica

```bash
npx playwright test --ui
```

### Verificar os tipos TypeScript

```bash
npx tsc --noEmit
```

### Cobertura funcional dos testes

A suíte verifica, entre outros pontos:

* funcionamento da API de auditoria;
* validação de URLs;
* rejeição de URLs inválidas;
* bloqueio de endereços locais/privados;
* detecção de violações;
* execução direta do Axe-core;
* página sem violações automatizadas;
* acessibilidade da interface principal;
* navegação por teclado;
* Skip Link;
* labels acessíveis;
* estados de carregamento;
* mensagens de erro;
* filtros;
* apresentação do score;
* cálculo da métrica de acessibilidade.

---

## ♿ Acessibilidade da própria aplicação

A interface do Accessibility Lab também foi construída considerando práticas de acessibilidade.

Entre os recursos utilizados estão:

* HTML semântico;
* Skip Link;
* foco visual;
* navegação por teclado;
* labels associados aos campos;
* regiões e mensagens `aria-live`;
* estados de carregamento acessíveis;
* hierarquia de títulos;
* contraste visual;
* componentes interativos com nomes acessíveis.

Além dos testes automatizados, o projeto reconhece que uma avaliação completa também exige testes manuais.

---

## ⚠️ Limitações

Uma auditoria automatizada não consegue identificar todos os problemas de acessibilidade de uma página.

O Axe-core é capaz de detectar diversas barreiras conhecidas, mas alguns aspectos dependem de avaliação humana.

Por isso, os resultados do Accessibility Lab devem ser complementados por testes como:

* navegação completa utilizando apenas teclado;
* avaliação com leitores de tela;
* testes de foco;
* ampliação da interface;
* análise de textos e instruções;
* avaliação da ordem de leitura;
* verificação de fluxos e componentes interativos;
* testes com usuários.

Além disso, algumas regras retornadas pelo Axe são classificadas como **boas práticas**, não necessariamente como violações diretas de um critério de sucesso WCAG.

---

## 🚀 Tecnologias utilizadas

### Front-end

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS 4

### Auditoria

* Axe-core
* `@axe-core/playwright`
* Playwright
* Chromium

### Qualidade

* TypeScript
* Playwright Test
* testes de acessibilidade
* testes de API
* testes de interface
* testes de utilitários

---

## 📦 Instalação

### Pré-requisitos

* Node.js
* npm

### Instalar dependências

```bash
npm install
```

### Instalar o navegador utilizado pelo Playwright

```bash
npx playwright install chromium
```

### Iniciar o projeto

```bash
npm run dev
```

Depois, acesse:

```text
http://localhost:3000
```

---

## 🔬 Executando uma auditoria

Na página inicial, informe uma URL válida.

Também é possível utilizar as páginas de demonstração disponíveis no próprio projeto:

```text
/test-page
```

ou:

```text
/test-page-ok
```

A primeira permite observar como o sistema identifica problemas propositalmente introduzidos.

A segunda permite validar o comportamento esperado quando nenhuma violação automatizada é encontrada.

---

## 🎯 Objetivo do projeto

O Accessibility Lab foi criado como um projeto prático para aprofundar conhecimentos em:

* desenvolvimento Front-End;
* Next.js;
* TypeScript;
* APIs;
* Playwright;
* testes automatizados;
* acessibilidade web;
* WCAG;
* Axe-core;
* análise técnica de problemas;
* qualidade de software.

A proposta é demonstrar não apenas a construção de uma interface, mas também a capacidade de **identificar problemas, interpretar resultados, estruturar testes e transformar evidências técnicas em ações de correção**.

---

## 🛣️ Próximos passos

Possíveis evoluções do projeto:

* ampliar o mapeamento entre regras Axe e critérios WCAG;
* adicionar checklist de testes manuais;
* registrar histórico de auditorias;
* comparar resultados entre auditorias;
* adicionar testes em diferentes tamanhos de viewport;
* integrar execução de auditorias em pipelines CI/CD;
* melhorar a documentação técnica das regras;
* disponibilizar uma versão publicada do projeto.

---

## 📌 Status

**Projeto em desenvolvimento contínuo.**

O Accessibility Lab funciona atualmente como uma aplicação de demonstração e aprendizado, com foco em auditoria automatizada, testes e práticas de acessibilidade web.

---

## 👩‍💻 Autora

**Manoela Harrison**

Frontend-Focused Full-Stack Developer
Foco em React, Next.js, TypeScript e Acessibilidade Web.

---

## ⚖️ Licença

Este projeto está disponível sob a licença MIT, caso o arquivo `LICENSE` esteja presente no repositório.
