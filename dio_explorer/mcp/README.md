# DIO Explorer — MCP Server

Servidor MCP (Model Context Protocol) para o projeto **DIO Explorer**.
Expõe as três funcionalidades do projeto como *tools* consumíveis por qualquer cliente MCP
(Bob, Claude Desktop, Cursor, etc.) via **stdio**, **HTTP streamable** ou **SSE**.

---

## Tools disponíveis

| Tool | Descrição |
|------|-----------|
| `trilha` | Retorna o plano de estudos completo de uma trilha DIO |
| `desafio` | Sorteia um desafio de código por tecnologia e nível |
| `certificado` | Gera um certificado de conclusão fictício (educacional) |
| `listar_trilhas` | Lista todas as tecnologias de trilhas cadastradas |

---

## Requisitos

- Node.js ≥ 18

---

## Instalação

```bash
cd dio_explorer/mcp
npm install
npm run build
```

---

## Uso

### Modo stdio (padrão — para uso com Bob / Claude Desktop)

```bash
node build/index.js
```

Configure em `.bob/mcp.json` (já criado automaticamente):

```json
{
  "mcpServers": {
    "dio-explorer": {
      "command": "node",
      "args": ["<caminho-absoluto>/dio_explorer/mcp/build/index.js"]
    }
  }
}
```

---

### Modo HTTP Streamable (para APIs REST / acesso remoto)

```bash
DIO_TRANSPORT=http PORT=3000 node build/index.js
# Windows PowerShell:
$env:DIO_TRANSPORT="http"; $env:PORT="3000"; node build/index.js
```

Endpoint: `POST/GET/DELETE http://localhost:3000/mcp`  
Health:   `GET  http://localhost:3000/health`

Configure em cliente MCP com transporte HTTP:

```json
{
  "mcpServers": {
    "dio-explorer-remote": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

---

### Modo SSE (Server-Sent Events — legado)

```bash
DIO_TRANSPORT=sse PORT=3000 node build/index.js
# Windows PowerShell:
$env:DIO_TRANSPORT="sse"; $env:PORT="3000"; node build/index.js
```

- SSE stream: `GET  http://localhost:3000/sse`
- Mensagens:  `POST http://localhost:3000/messages?sessionId=<id>`
- Health:     `GET  http://localhost:3000/health`

---

## Exemplos de uso (após conectado ao Bob)

```
Use a tool trilha com tecnologia "Python"
Use a tool desafio com tecnologia "JavaScript" e nivel "avancado"
Use a tool certificado com nome_usuario "Ana Silva" e trilha "React"
Use a tool listar_trilhas
```

---

## Estrutura

```
mcp/
├── src/
│   ├── index.ts          # Entry point — seleção de transport
│   └── tools/
│       ├── trilha.ts     # Lógica do comando /trilha
│       ├── desafio.ts    # Lógica do comando /desafio
│       └── certificado.ts# Lógica do comando /certificado
├── build/                # JS compilado (gerado por npm run build)
├── package.json
├── tsconfig.json
└── README.md
```

---

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `DIO_TRANSPORT` | `stdio` | Transport a usar: `stdio`, `http` ou `sse` |
| `PORT` | `3000` | Porta HTTP/SSE |
