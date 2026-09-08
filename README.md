# 🌐 Accessibility Lab

> **Automated Web Accessibility Auditing with Next.js, Playwright and Axe-core**

Uma aplicação web para **auditoria automatizada de acessibilidade**, análise de violações e apoio à tomada de decisão técnica.

O **Accessibility Lab** foi desenvolvido para explorar, na prática, como ferramentas automatizadas podem identificar barreiras de acessibilidade em páginas web e transformar os resultados da auditoria em informações úteis para **análise, priorização e correção**.

O projeto combina **Next.js, React, TypeScript, Playwright e Axe-core**, com foco em acessibilidade web, testes automatizados, qualidade de software e experiência do usuário.

---

## 🎯 Visão geral

O objetivo do projeto não é apenas encontrar erros.

A aplicação procura responder a três perguntas:

**1. O que está errado?**
Identificação das violações encontradas pelo Axe-core.

**2. Qual é o impacto?**
Classificação por nível de severidade e organização dos resultados.

**3. Como corrigir?**
Apresentação de evidências técnicas, critérios WCAG relacionados e orientações práticas de correção.

Esse fluxo transforma uma auditoria automatizada em uma experiência de **análise técnica e aprendizado**.

---

## ✨ Principais funcionalidades

### 🔍 Auditoria automatizada

O usuário informa a URL de uma página e a aplicação:

* valida o endereço informado;
* verifica protocolo e formato da URL;
* bloqueia determinados endereços locais e privados;
* abre a página utilizando Playwright + Chromium;
* executa uma auditoria com Axe-core;
* normaliza os resultados;
* apresenta as violações encontradas.

---

### 📊 Score de acessibilidade

O Accessibility Lab possui uma métrica própria de **0 a 100** para facilitar a interpretação dos resultados.

O cálculo considera:

* impacto da violação;
* quantidade de elementos afetados;
* penalização progressiva conforme o número de ocorrências.

> **Importante:** o score é uma métrica criada especificamente para este projeto. Ele **não representa um percentual oficial de conformidade com WCAG** e não substitui uma avaliação de acessibilidade.

---

### 🏷️ Classificação das violações

As violações são organizadas em categorias utilizadas pelo projeto:

* **Perceptível**
* **Operável**
* **Compreensível**
* **Robusto**
* **Boas práticas**

Quando aplicável, a aplicação também relaciona as regras identificadas aos critérios WCAG conhecidos.

---

### 🔴 Classificação por impacto

As violações são agrupadas por nível de impacto:

| Impacto     | Prioridade |
| ----------- | ---------- |
| 🔴 Critical | Muito alta |
| 🟠 Serious  | Alta       |
| 🟡 Moderate | Média      |
| ⚪ Minor     | Baixa      |

A interface permite filtrar os resultados por nível de impacto.

---

### 🔎 Busca e análise

Os resultados podem ser pesquisados utilizando informações como:

* ID da regra;
* descrição;
* tags;
* elementos afetados;
* seletores;
* evidências retornadas pelo Axe-core.

---

### 🛠️ Orientação para correção

Cada violação apresenta informações técnicas para facilitar sua investigação.

Entre os dados apresentados estão:

* descrição da regra;
* impacto;
* categoria;
* critérios WCAG relacionados;
* elementos afetados;
* seletor CSS;
* evidência da falha;
* orientação de correção;
* documentação técnica da regra.

A proposta é aproximar o resultado automatizado de uma **ação concreta de desenvolvimento**.

---

### 📋 Exportação dos resultados

Os resultados podem ser utilizados para documentação e análise posterior.

A aplicação permite:

* copiar o relatório em Markdown;
* baixar os dados da auditoria em JSON.

O relatório Markdown pode servir como base para:

* documentação técnica;
* abertura de issues;
* registro de problemas;
* acompanhamento de correções;
* comunicação entre desenvolvimento e QA.

---

## 🧠 Arquitetura e fluxo técnico

O fluxo principal da aplicação é:

```text
Usuário informa uma URL
        ↓
Interface envia requisição para a API
        ↓
API valida a URL
        ↓
Verificação de protocolo e endereço
        ↓
Playwright inicia o Chromium
        ↓
Página é carregada
        ↓
Axe-core executa a auditoria
        ↓
Resultados são normalizados
        ↓
Violações são classificadas
        ↓
Score é calculado
        ↓
Interface apresenta os resultados
        ↓
Usuário pode filtrar, analisar e exportar
```

A API também possui validações para impedir determinadas tentativas de análise de endereços locais ou privados.

---

## 🏗️ Arquitetura do projeto

O projeto utiliza o **Next.js App Router**, separando responsabilidades entre interface, API, tipos, utilitários e testes.

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
| `api/audit/route.ts`   | Validação da URL e execução do Playwright + Axe-core        |
| `audit-utils.ts`       | Classificação, critérios WCAG, score e geração de relatório |
| `audit.ts`             | Tipagem dos resultados da auditoria                         |
| `ViolationCard.tsx`    | Apresentação detalhada de uma violação                      |
| `ViolationSection.tsx` | Organização das violações por categoria                     |
| `ImpactFilters.tsx`    | Filtros e pesquisa                                          |
| `ImpactSummary.tsx`    | Resumo dos níveis de impacto                                |
| `AuditStatus.tsx`      | Status geral da auditoria                                   |
| `test-page/`           | Página com problemas intencionais                           |
| `test-page-ok/`        | Página de referência sem violações automatizadas            |

---

## 🧩 Principais decisões técnicas

### Next.js App Router

O projeto utiliza o App Router para separar a camada de interface da API responsável pela execução da auditoria.

Isso permite manter a aplicação organizada e concentrar a execução do Playwright no ambiente do servidor.

---

### Playwright + Chromium

O Playwright é utilizado para abrir e analisar a página real antes da execução do Axe-core.

Essa abordagem permite que a auditoria aconteça em um navegador automatizado, aproximando o processo das condições de execução de uma aplicação web real.

---

### Axe-core

O Axe-core é responsável pela identificação automatizada das violações de acessibilidade.

Os resultados retornados pelo motor são posteriormente transformados pelo projeto em uma estrutura própria para apresentação e análise.

---

### TypeScript

O projeto utiliza tipagem explícita para representar:

* violações;
* impactos;
* resultados;
* filtros;
* nós afetados;
* informações da auditoria.

Isso ajuda a reduzir inconsistências entre a API, os utilitários e os componentes da interface.

---

### Camada de utilitários

A lógica relacionada à classificação, score, critérios WCAG e geração de relatórios foi concentrada em:

```text
src/lib/audit-utils.ts
```

Essa separação evita colocar regras de negócio diretamente nos componentes visuais.

---

## 📊 Como o score é calculado

O score foi criado especificamente para o Accessibility Lab.

Cada nível de impacto possui uma penalização base:

| Impacto  | Penalização base |
| -------- | ---------------: |
| Critical |               25 |
| Serious  |               15 |
| Moderate |                8 |
| Minor    |                3 |

Quando uma mesma regra afeta vários elementos, a penalização aumenta progressivamente.

De forma simplificada:

```text
Score inicial: 100
        ↓
Identificação das violações
        ↓
Aplicação da penalização por impacto
        ↓
Ajuste pela quantidade de elementos afetados
        ↓
Score final
```

Exemplos:

```text
0 violações
→ 100

1 violação Minor
→ 97

1 violação Moderate
→ 92

1 violação Serious
→ 85

1 violação Critical
→ 75
```

A métrica tem como objetivo **facilitar a interpretação e priorização dos problemas**.

Ela não representa conformidade oficial com WCAG.

---

## 🧪 Testes automatizados

O projeto possui uma suíte de testes utilizando **Playwright Test**.

Os testes estão organizados por responsabilidade:

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

### Gerar o build de produção

```bash
npm run build
```

---

## 🔬 O que é validado pelos testes

A suíte cobre diferentes camadas da aplicação.

### API

* URL obrigatória;
* protocolo HTTP/HTTPS;
* URL inválida;
* bloqueio de endereços locais/privados;
* execução da auditoria;
* identificação de violações;
* página sem violações;
* score retornado pela auditoria.

### Acessibilidade

* execução direta do Axe-core;
* detecção de problemas conhecidos;
* página de demonstração com violações;
* página de demonstração sem violações.

### Interface

* ausência de violações automatizadas na interface principal;
* Skip Link;
* labels acessíveis;
* navegação por teclado;
* nomes acessíveis dos controles;
* estado de carregamento;
* mensagens de erro;
* filtros;
* apresentação do score;
* apresentação dos resultados.

### Utilitários

* cálculo do score;
* diferentes níveis de impacto;
* múltiplos elementos afetados;
* limite de penalização;
* cenário sem violações.

---

## ♿ Acessibilidade da própria aplicação

O Accessibility Lab também foi desenvolvido considerando práticas de acessibilidade.

Entre os recursos utilizados estão:

* HTML semântico;
* Skip Link;
* foco visual;
* navegação por teclado;
* labels associados aos campos;
* regiões `aria-live`;
* mensagens de status acessíveis;
* estados de carregamento;
* hierarquia de títulos;
* contraste visual;
* nomes acessíveis para elementos interativos.

A própria interface também é submetida a testes automatizados de acessibilidade.

> **Importante:** a aplicação não considera que uma interface está totalmente acessível apenas porque os testes automatizados passaram.

---

## ⚠️ Limitações da auditoria automatizada

Ferramentas automatizadas são importantes, mas não conseguem identificar todos os problemas de acessibilidade.

O Axe-core consegue detectar diversas barreiras conhecidas, porém alguns aspectos dependem de avaliação humana.

Uma avaliação mais completa deve combinar automação com testes como:

* navegação utilizando apenas teclado;
* avaliação com leitores de tela;
* testes de foco;
* ampliação da interface;
* análise da ordem de leitura;
* avaliação de textos e instruções;
* análise de fluxos interativos;
* testes com diferentes contextos de uso;
* testes com usuários.

Além disso, algumas regras retornadas pelo Axe podem representar **boas práticas**, e não necessariamente uma violação direta de um critério de sucesso WCAG.

---

## 🧪 Páginas de demonstração

O projeto possui duas páginas internas para demonstrar diferentes cenários.

### Página com problemas

```text
/test-page
```

Página criada propositalmente com problemas de acessibilidade.

Ela permite verificar se o sistema consegue:

* executar a auditoria;
* identificar violações;
* apresentar impacto;
* mostrar elementos afetados;
* fornecer orientação de correção.

### Página sem violações automatizadas

```text
/test-page-ok
```

Página criada para representar uma implementação na qual o Axe-core não encontra violações automatizadas.

Ela é utilizada para validar o comportamento esperado da aplicação quando o resultado da auditoria é:

```text
0 violações
Score: 100
```

---

## 🔐 Validação de URLs

Como o sistema recebe URLs externas para análise, a API realiza validações antes de executar o navegador automatizado.

Entre elas:

* URL obrigatória;
* protocolo HTTP ou HTTPS;
* validação do formato;
* rejeição de determinados endereços locais;
* rejeição de determinados endereços privados.

Essa camada reduz riscos relacionados à tentativa de utilizar o serviço para acessar recursos internos ou endereços que não deveriam ser analisados.

---

## 🚀 Tecnologias

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

### 1. Clone o repositório

```bash
git clone https://github.com/Manoelah20/accessibility-lab.git
```

### 2. Acesse o projeto

```bash
cd accessibility-lab
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Instale o Chromium do Playwright

```bash
npx playwright install chromium
```

### 5. Inicie o ambiente de desenvolvimento

```bash
npm run dev
```

Depois, acesse:

```text
http://localhost:3000
```

---

## 🔎 Executando uma auditoria

Na página inicial, informe uma URL válida.

Também é possível utilizar as páginas de demonstração:

```text
/test-page
```

ou:

```text
/test-page-ok
```

A primeira permite observar a identificação de problemas introduzidos propositalmente.

A segunda permite validar o comportamento esperado quando nenhuma violação automatizada é encontrada.

---

## 📈 Qualidade do projeto

Antes de uma alteração ser considerada concluída, o projeto pode ser validado com:

```bash
npx tsc --noEmit
```

```bash
npm run build
```

```bash
npx playwright test --workers=1
```

Essas verificações ajudam a validar:

* tipagem;
* build de produção;
* funcionamento da aplicação;
* API;
* interface;
* acessibilidade;
* regras de negócio;
* cálculo do score.

---

## 🎯 Objetivos de aprendizado

O Accessibility Lab foi desenvolvido como um projeto prático para aprofundar conhecimentos em:

* desenvolvimento Front-End;
* Next.js;
* React;
* TypeScript;
* APIs;
* Playwright;
* testes automatizados;
* acessibilidade web;
* WCAG;
* Axe-core;
* arquitetura de componentes;
* análise técnica de problemas;
* qualidade de software.

O projeto também busca demonstrar uma abordagem de desenvolvimento baseada em **evidências, testes e tomada de decisão técnica**.

---

## 💡 O que este projeto demonstra

Além da implementação visual, o projeto demonstra conhecimentos em:

* integração entre Front-end e API;
* automação de navegador;
* auditoria automatizada;
* tratamento e normalização de resultados;
* modelagem de dados com TypeScript;
* criação de métricas próprias;
* testes automatizados;
* testes de acessibilidade;
* organização de componentes;
* separação de responsabilidades;
* validação de entradas;
* tratamento de estados de carregamento e erro;
* documentação técnica;
* análise e priorização de problemas de acessibilidade.

---

## 🛣️ Roadmap

Possíveis evoluções do projeto:

* [ ] ampliar o mapeamento entre regras Axe e critérios WCAG;
* [ ] adicionar checklist de testes manuais;
* [ ] registrar histórico de auditorias;
* [ ] comparar resultados entre auditorias;
* [ ] adicionar diferentes tamanhos de viewport;
* [ ] integrar auditorias a pipelines CI/CD;
* [ ] melhorar a documentação individual das regras;
* [ ] adicionar autenticação;
* [ ] criar histórico por projeto;
* [ ] disponibilizar uma versão pública da aplicação.

---

## 📌 Status

**Projeto em desenvolvimento contínuo.**

O Accessibility Lab atualmente funciona como uma aplicação de demonstração e aprendizado, com foco em:

**Acessibilidade Web · Automação · Testes · Next.js · TypeScript · Qualidade de Software**

---

## 👩‍💻 Autora

### Manoela Harrison

**Frontend-Focused Full-Stack Developer**

Foco em:

* React
* Next.js
* TypeScript
* Acessibilidade Web
* Desenvolvimento de interfaces
* Testes automatizados

---

## 📄 Licença

Este projeto está disponível sob a licença MIT, caso o arquivo `LICENSE` esteja presente no repositório.
