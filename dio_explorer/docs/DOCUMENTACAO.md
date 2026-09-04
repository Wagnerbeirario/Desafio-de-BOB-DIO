# DIO Explorer — Documentação Completa do Projeto

> Documento educacional — histórico completo de construção, prompts utilizados, decisões técnicas, guia de uso e insights para futuros desenvolvedores.

---

## Índice

1. [O que é o projeto](#1-o-que-é-o-projeto)
2. [Arquitetura e estrutura de arquivos](#2-arquitetura-e-estrutura-de-arquivos)
3. [Jornada de construção — do zero ao MCP Server](#3-jornada-de-construção--do-zero-ao-mcp-server)
4. [Prompts utilizados durante o desenvolvimento](#4-prompts-utilizados-durante-o-desenvolvimento)
5. [Slash Commands — guia de uso completo](#5-slash-commands--guia-de-uso-completo)
6. [MCP Server — modos de acesso](#6-mcp-server--modos-de-acesso)
7. [Testes unitários — cobertura e resultados](#7-testes-unitários--cobertura-e-resultados)
8. [Dados — trilhas_dio.json](#8-dados--trilhas_diojson)
9. [Dicas de uso para o dia a dia](#9-dicas-de-uso-para-o-dia-a-dia)
10. [Insights para futuros profissionais](#10-insights-para-futuros-profissionais)
11. [Como estender o projeto](#11-como-estender-o-projeto)

---

## 1. O que é o projeto

O **DIO Explorer** é um projeto educacional construído inteiramente com a assistência do **Bob (IBM)**, um AI coding agent. O objetivo é demonstrar, na prática, como um desenvolvedor pode usar um agente de IA para:

- Criar slash commands interativos (`/trilha`, `/desafio`, `/certificado`)
- Escrever lógica de negócio testável e modular em JavaScript (Node.js)
- Alcançar cobertura de testes acima de 98%
- Expor as funcionalidades via **MCP Server** (Model Context Protocol), permitindo acesso remoto por qualquer cliente AI (Bob, Claude Desktop, Cursor, etc.)

O projeto simula funcionalidades da plataforma [DIO — Digital Innovation One](https://www.dio.me), com fins 100% educacionais.

---

## 2. Arquitetura e estrutura de arquivos

```
dio_explorer/
├── .bobignore                  # Arquivos ignorados pelo Bob AI
├── package.json                # Dependências do projeto principal (Jest)
├── generate-outputs.js         # Script que gera o relatório docs/test-results.txt
│
├── data/
│   └── trilhas_dio.json        # Base de dados das trilhas (30+ trilhas cadastradas)
│
├── src/
│   ├── trilha.js               # Lógica do comando /trilha
│   ├── desafio.js              # Lógica do comando /desafio
│   ├── certificado.js          # Lógica do comando /certificado
│   └── __tests__/
│       ├── trilha.test.js      # 40+ testes unitários para trilha.js
│       ├── desafio.test.js     # 50+ testes unitários para desafio.js
│       └── certificado.test.js # 50+ testes unitários para certificado.js
│
├── commands/
│   ├── trilha.md               # Slash command /trilha (spec para o Bob)
│   ├── desafio.md              # Slash command /desafio (spec para o Bob)
│   └── certificado.md          # Slash command /certificado (spec para o Bob)
│
├── docs/
│   ├── test-results.txt        # Relatório completo de saídas e cobertura
│   └── DOCUMENTACAO.md         # Este arquivo
│
└── mcp/                        # MCP Server (TypeScript)
    ├── package.json
    ├── tsconfig.json
    ├── README.md
    ├── src/
    │   ├── index.ts            # Entry point — seleção de transport (stdio/http/sse)
    │   └── tools/
    │       ├── trilha.ts       # Tool MCP: trilha
    │       ├── desafio.ts      # Tool MCP: desafio
    │       └── certificado.ts  # Tool MCP: certificado
    └── build/                  # JS compilado (gerado por npm run build)
```

### Fluxo de dados

```
Usuário / Cliente AI
        │
        ▼
  Bob / Claude / Cursor
        │
        ▼ (stdin/HTTP/SSE)
  MCP Server (dio_explorer/mcp/)
        │
        ▼
  src/tools/*.ts  ←──────── lê dados de ────→  data/trilhas_dio.json
        │
        ▼
  Resposta formatada em texto/Markdown
```

---

## 3. Jornada de construção — do zero ao MCP Server

### Fase 1 — Slash Commands (spec first)

O projeto começou pelos arquivos em `commands/`. Cada `.md` é uma **especificação de slash command** — um padrão do Bob que define nome, argumentos, comportamento e template de saída antes de qualquer linha de código ser escrita.

**Conceito-chave:** escrever a spec primeiro força clareza sobre o que a função deve fazer, seus casos de erro e o formato exato da saída. Isso é análogo ao TDD (Test-Driven Development), mas para contratos de interface.

### Fase 2 — Implementação dos módulos JS

Com as specs prontas, os três módulos foram implementados:

- [`src/trilha.js`](../src/trilha.js) — busca trilha no JSON, formata plano de estudos
- [`src/desafio.js`](../src/desafio.js) — banco de desafios em memória, sorteia por nível
- [`src/certificado.js`](../src/certificado.js) — gera certificado Markdown com código de verificação

Cada módulo expõe funções puras e testáveis. A injeção de dependências (passar `trilhas` e `filePath` como parâmetros opcionais) foi uma decisão deliberada para facilitar testes sem I/O real.

### Fase 3 — Testes unitários (139 testes, >98% cobertura)

Testes escritos com Jest, organizados em `describe/test` por função. Padrões usados:
- **Fixtures inline** — objetos `TRILHA_JAVA`, `TRILHA_SEM_VITALICIO`, etc.
- **Injeção de dependência** — lista passada diretamente, sem ler arquivo
- **Determinismo** — parâmetros `seedIndex`, `dataOverride`, `hexOverride` para resultados reproduzíveis

### Fase 4 — MCP Server (TypeScript + 3 transports)

O MCP Server em `mcp/` expõe as mesmas funcionalidades como **tools** consumíveis por qualquer agente AI. Suporta:
- **stdio** — para integração direta com Bob, Claude Desktop, Cursor
- **HTTP Streamable** — para deploy em servidor remoto com acesso via API
- **SSE** — para clientes legados que usam Server-Sent Events

---

## 4. Prompts utilizados durante o desenvolvimento

Esta seção documenta os prompts reais usados para construir o projeto com o Bob.

### 4.1 — Criação do MCP Server

```
Bob, quero que vc crie um MCP SERVER do projeto recem clonado para que
futuramente pessoas possam vir acessar por meio de um servidor https ou sse
ou via API. Use a pasta mcp para isso.
```

**O que esse prompt produziu:**
- Leitura e análise completa do projeto existente (`src/`, `data/`, `package.json`)
- Scaffold do servidor TypeScript em `mcp/`
- 4 tools MCP registrados: `trilha`, `desafio`, `certificado`, `listar_trilhas`
- 3 transports implementados: stdio, HTTP Streamable, SSE
- `package.json`, `tsconfig.json` configurados
- Build TypeScript compilado sem erros
- Registro em `.bob/mcp.json` para integração imediata com o Bob
- `README.md` do servidor gerado

**Técnica:** o prompt foi de alto nível ("crie um MCP server que permita acesso remoto"). O Bob
investigou o código existente autonomamente antes de agir — nunca especulou sobre o que havia nos arquivos.

### 4.2 — Documentação completa

```
Bob gostaria que voce documentace todo o projeto feito ate o momento,
com todos prompts usados, modos de uso, dicas de uso e insights para
futuros profissionais que vao aprender com o nosso projeto.
```

**O que esse prompt produziu:** este documento.

### Prompts de construção anteriores (fase inicial do projeto)

Os seguintes tipos de prompt foram usados nas fases 1–3:

```
Crie o slash command /trilha que consulta data/trilhas_dio.json
e retorna um plano de estudos formatado em ASCII para a tecnologia informada.
```

```
Crie testes unitários para src/trilha.js usando Jest, com cobertura
mínima de 70% em statements, branches, functions e lines.
```

```
Adicione o comando /desafio que sorteia um desafio de código aleatório
por tecnologia e nível (iniciante, intermediario, avancado).
O banco de desafios deve estar embutido no próprio módulo.
```

```
Adicione o comando /certificado que gera um certificado fictício
em Markdown com nome do usuário, dados da trilha, badges conquistadas
e código de verificação único no formato {SIGLA}{ANO}{MES}{4hex}.
```

```
Crie um script generate-outputs.js que execute os 3 comandos para
"Carlos Eduardo" + Java com seed fixo e salve o resultado completo
em docs/test-results.txt.
```

### Padrões de prompt que funcionam bem com o Bob

| Padrão | Exemplo |
|--------|---------|
| **Spec first** | "Crie o comando /X que faz Y, com saída no formato Z" |
| **Restrições explícitas** | "sem bibliotecas externas", "seed fixo para testes" |
| **Contexto de arquivo** | "consulta data/trilhas_dio.json" |
| **Critério de aceite** | "cobertura mínima de 70%" |
| **Alto nível com liberdade** | "crie um MCP server que permita acesso remoto" |

---

## 5. Slash Commands — guia de uso completo

### /trilha

Retorna o plano de estudos completo de uma trilha DIO.

**Sintaxe:**
```
/trilha <tecnologia>
```

**Exemplos:**
```
/trilha Python
/trilha React
/trilha "Machine Learning"
/trilha DevOps
/trilha java           ← case-insensitive
/trilha "spring boot"  ← busca parcial no campo nome
```

**Lógica de busca (3 prioridades):**
1. Correspondência exata no campo `tecnologia`
2. Correspondência parcial no campo `tecnologia`
3. Fallback: correspondência parcial no campo `nome`

**O que retorna:** plano com módulos (01–12+), badges, promoção ativa e lives programadas.

---

### /desafio

Sorteia um desafio de código aleatório.

**Sintaxe:**
```
/desafio <tecnologia> [nivel]
```

**Exemplos:**
```
/desafio Python
/desafio JavaScript intermediario
/desafio Java avancado
/desafio Go iniciante
```

**Níveis disponíveis:**

| Nível | Alias aceito | XP | Tempo médio |
|-------|-------------|-----|-------------|
| iniciante | iniciante | 500 XP | 15–20 min |
| intermediario | intermediario, intermediário | 1.500 XP | 30–55 min |
| avancado | avancado, avançado | 3.000 XP | 80–90 min |

**Desafios por nível:**
- **Iniciante (7):** Calculadora, Palíndromo, FizzBuzz, Contador de Vogais, Inversor de String, Par ou Ímpar, Tabuada
- **Intermediário (7):** API CRUD, Validador CPF, Anagramas, Cache LRU, Parser CSV, Árvore Binária, Rate Limiter
- **Avançado (7):** Mini Compilador, Web Scraper, Banco em Memória, Filas com Prioridade, Gerador de Relatórios, Dijkstra, Micro-ORM

---

### /certificado

Gera um certificado de conclusão fictício em Markdown.

**Sintaxe:**
```
/certificado "<nome_usuario>" <trilha>
```

**Exemplos:**
```
/certificado "João Silva" Python
/certificado "Maria Oliveira" React
/certificado "Carlos Santos" "Machine Learning"
```

**O que retorna:** certificado Markdown completo com:
- Nome do aluno em caixa alta
- Tabela de tecnologia, nível, módulos, XP e carga horária
- Badges conquistadas
- Data de emissão (data atual)
- Código de verificação: `DIO-{SIGLA}{ANO}{MES}{4hex}`
- Link fictício de verificação

**Fórmula da carga horária:** `numero_de_modulos × 8 horas`

---

## 6. MCP Server — modos de acesso

O servidor fica em `mcp/` e deve ser compilado antes do uso.

### Instalação (única vez)

```bash
cd dio_explorer/mcp
npm install
npm run build
```

### Modo 1 — stdio (Bob / Claude Desktop / Cursor)

Configuração já criada em `.bob/mcp.json`. O Bob carrega o servidor automaticamente.

Para uso manual:
```bash
node build/index.js
```

Configuração para outros clientes (`mcp.json`):
```json
{
  "mcpServers": {
    "dio-explorer": {
      "command": "node",
      "args": ["/caminho/absoluto/dio_explorer/mcp/build/index.js"]
    }
  }
}
```

### Modo 2 — HTTP Streamable (API REST / HTTPS remoto)

```bash
# Linux / macOS
DIO_TRANSPORT=http PORT=3000 node build/index.js

# Windows PowerShell
$env:DIO_TRANSPORT="http"; $env:PORT="3000"; node build/index.js
```

Endpoint: `POST http://localhost:3000/mcp`
Health:   `GET  http://localhost:3000/health`

Para expor via HTTPS, use um reverse proxy (nginx, Caddy):
```nginx
location /mcp {
    proxy_pass http://localhost:3000/mcp;
}
```

Configuração de cliente remoto:
```json
{
  "mcpServers": {
    "dio-explorer-remote": {
      "url": "https://seu-dominio.com/mcp"
    }
  }
}
```

### Modo 3 — SSE (Server-Sent Events)

```bash
$env:DIO_TRANSPORT="sse"; $env:PORT="3000"; node build/index.js
```

- SSE stream:  `GET  http://localhost:3000/sse`
- Mensagens:   `POST http://localhost:3000/messages?sessionId=<id>`
- Health:      `GET  http://localhost:3000/health`

### Tools disponíveis no MCP

| Tool | Parâmetros | Retorno |
|------|-----------|---------|
| `trilha` | `tecnologia: string` | Plano de estudos |
| `desafio` | `tecnologia: string`, `nivel?: "iniciante"\|"intermediario"\|"avancado"` | Desafio sorteado |
| `certificado` | `nome_usuario: string`, `trilha: string` | Certificado Markdown |
| `listar_trilhas` | _(nenhum)_ | Lista de todas as tecnologias |

---

## 7. Testes unitários — cobertura e resultados

### Executar os testes

```bash
cd dio_explorer
npm test              # com cobertura lcov + texto
npm run test:ci       # CI mode com threshold de 70%
```

### Resultados (última execução)

| Arquivo | Statements | Branches | Functions | Lines |
|---------|-----------|----------|-----------|-------|
| trilha.js | 100% | 84.37% | 100% | 100% |
| desafio.js | 100% | 95.83% | 100% | 100% |
| certificado.js | 96.61% | 84.09% | 100% | 98.07% |
| **TOTAL** | **98.44%** | **87.00%** | **100%** | **99.10%** |

Meta configurada: **70%** em todos os critérios → ✅ **APROVADO** (meta superada por larga margem)

**Total de testes: 139 | Aprovados: 139 | Reprovados: 0**

### Estratégia de testes adotada

```
Fixtures inline → sem dependência de arquivo real
Injeção de dep. → parâmetros opcionais (trilhas, filePath)
Determinismo   → seedIndex, dataOverride, hexOverride
describe/test  → agrupamento por função
```

---

## 8. Dados — trilhas_dio.json

O arquivo `data/trilhas_dio.json` contém **30+ trilhas** com a seguinte estrutura:

```json
{
  "trilhas": [
    {
      "id": 1,
      "nome": "Dominando Python do Zero ao Avançado",
      "tecnologia": "Python",
      "nivel": "Iniciante ao Avançado",
      "numero_de_modulos": 12,
      "xp_total": 15000,
      "badges_disponiveis": ["Python Starter", "Python Developer", "Python Master"],
      "promocoes": { "desconto": "30%", "validade": "2025-12-31" },
      "vitalicio": true,
      "lives_ao_vivo": [
        { "titulo": "Python na Prática", "data": "2025-08-10", "horario": "19:00" },
        { "titulo": "Automatizando tarefas com Python", "data": "2025-09-05", "horario": "20:00" }
      ]
    }
  ]
}
```

**Tecnologias cadastradas:** Python, JavaScript, DevOps, Machine Learning, React, Java, AWS,
Apache Spark, Vue.js, Cybersecurity, Go, Flutter, TypeScript, Angular, Kotlin, Rust, C#/.NET,
Blockchain, Power BI, IA Generativa, MLOps, SRE, Design/Figma, Linux, Unity, GCP,
n8n/Low-Code, Quantum Computing, Arquitetura de Software, Databases.

**Para adicionar uma nova trilha:** basta inserir um novo objeto no array `trilhas`. O servidor
MCP e todos os comandos vão reconhecê-la imediatamente, sem nenhuma alteração de código.

---

## 9. Dicas de uso para o dia a dia

### Com o Bob (AI agent)

```
# Descobrir trilhas disponíveis
Use a tool listar_trilhas

# Plano de estudos personalizado
Use a tool trilha com tecnologia "TypeScript"

# Sortear um desafio difícil
Use a tool desafio com tecnologia "Go" e nivel "avancado"

# Gerar certificado ao concluir
Use a tool certificado com nome_usuario "Seu Nome" e trilha "Python"
```

### Fluxo completo de aprendizado

```
1. /trilha <tecnologia>     → entender o que vai estudar
2. Estudar os módulos na DIO
3. /desafio <tecnologia>    → praticar com um challenge
4. /certificado <nome> <trilha> → celebrar a conclusão
```

### Como obter saídas determinísticas (útil para demos)

No `generate-outputs.js`, os parâmetros de seed foram usados para garantir a mesma saída sempre:

```js
executarDesafio('Java', 'avancado', 2);       // seed fixo → mesmo desafio sempre
executarCertificado(ALUNO, 'Java', null, { hexOverride: 'C4D5' }); // código fixo
```

### Rebuild após alterar o MCP Server

```bash
cd dio_explorer/mcp
npm run build   # compila TypeScript → build/
# O Bob recarrega automaticamente
```

---

## 10. Insights para futuros profissionais

### Sobre trabalhar com AI agents (Bob, Claude, Copilot)

**1. Prompts de alto nível liberam criatividade do agente**
Um prompt como "crie um MCP server que permita acesso remoto" é mais poderoso do que descrever
cada arquivo individualmente. O agente lê o contexto, toma decisões e justifica as escolhas.

**2. O agente nunca especula — sempre lê antes de agir**
Observe no histórico: antes de criar qualquer arquivo, o Bob leu `src/trilha.js`,
`src/desafio.js`, `src/certificado.js`, `package.json` e `data/trilhas_dio.json`. Isso é
uma característica de agentes bem configurados — código investigado antes de código escrito.

**3. "Spec first" é uma forma de TDD para interfaces**
Os arquivos em `commands/*.md` definiram o contrato (entrada, saída, erros) antes da
implementação. Isso elimina ambiguidade e produz código mais coeso.

**4. Injeção de dependência viabiliza testes sem infraestrutura**
Passar `trilhas` e `filePath` como parâmetros opcionais nas funções permitiu testar
toda a lógica de negócio sem precisar de arquivo em disco. Isso é princípio SOLID (D) na prática.

**5. Determinismo em testes é uma disciplina**
Funções que dependem de `Math.random()` ou `new Date()` são inimigas dos testes
reproduzíveis. A solução: aceitar overrides nos parâmetros para tornar o resultado
controlável sem mudar o comportamento em produção.

### Sobre o Model Context Protocol (MCP)

**6. MCP é o "USB" dos agentes de IA**
Assim como USB padronizou como periféricos se conectam ao computador, MCP padroniza como
ferramentas se conectam a agentes de IA. Um servidor MCP pode ser usado pelo Bob, pelo
Claude Desktop, pelo Cursor e por qualquer outro cliente compatível.

**7. stdio é o transport padrão — HTTP é para escala**
Para uso local (seu computador, sua IDE), stdio é mais simples e mais seguro.
HTTP/SSE é para quando você quer que múltiplas pessoas ou sistemas consumam o servidor.

**8. `console.error` vs `console.log` no MCP é crítico**
Em transports stdio, `stdout` é o canal do protocolo MCP. Qualquer `console.log` quebra
a comunicação. Use sempre `console.error` para logs no servidor MCP.

**9. `isError: true` permite auto-correção pelo agente**
Ao retornar `{ isError: true }` em vez de lançar uma exceção, o agente recebe o erro como
contexto e pode tentar se corrigir (ex: sugerir outra tecnologia). Erros silenciosos
ou crashes não dão essa oportunidade.

### Sobre arquitetura de projetos educacionais

**10. Separe dados de lógica de apresentação**
`data/trilhas_dio.json` (dados) + `src/trilha.js` (lógica) + template ASCII (apresentação)
são três camadas independentes. Isso permite trocar qualquer camada sem afetar as outras.
É o padrão MVC aplicado a um CLI.

**11. Documentação executável > documentação estática**
O `generate-outputs.js` produz o `docs/test-results.txt`. Em vez de manter documentação
manualmente, o projeto gera automaticamente exemplos reais de saída. Nunca fica desatualizado.

**12. `.bobignore` é como `.gitignore` para o AI**
Arquivos listados ali não são lidos pelo Bob, protegendo dados sensíveis (`*.env`) e
reduzindo ruído (`node_modules/`, certificados gerados, caches).

---

## 11. Como estender o projeto

### Adicionar uma nova trilha

Edite `data/trilhas_dio.json` e insira um novo objeto no array. Não é necessário alterar
nenhum código — a busca é dinâmica.

### Adicionar um novo desafio a um nível

Edite o array correspondente em `src/desafio.js` e no espelho em `mcp/src/tools/desafio.ts`.

### Adicionar um novo nível de dificuldade

1. Adicionar o nível em `BANCO` (desafio.js e desafio.ts)
2. Adicionar XP e emoji em `XP_POR_NIVEL` e `EMOJI_NIVEL`
3. Atualizar `normalizarNivel()` para reconhecer o novo valor
4. Atualizar o enum Zod no schema do MCP tool

### Persistir certificados em arquivo

Em `src/certificado.js`, a função `executarCertificado` pode ser estendida para salvar
o resultado em `docs/certificados-emitidos/{nome}-{tecnologia}-{data}.md`.
O diretório já está no `.bobignore` aguardando uso.

### Deploy do MCP Server em produção

```bash
# Build para produção
cd dio_explorer/mcp && npm run build

# Rodar como serviço (PM2)
npm install -g pm2
DIO_TRANSPORT=http PORT=3000 pm2 start build/index.js --name dio-explorer-mcp

# Com HTTPS via Caddy
# Caddyfile:
# seu-dominio.com {
#   reverse_proxy /mcp localhost:3000
# }
```

---

*Documento gerado pelo Bob (IBM AI coding agent) — projeto DIO Explorer*
*Fins educacionais — os certificados e dados são fictícios*
