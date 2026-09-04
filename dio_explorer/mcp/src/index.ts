#!/usr/bin/env node
/**
 * DIO Explorer — MCP Server
 *
 * Transports supported (selectable via env var DIO_TRANSPORT):
 *   stdio  (default) — spawned by an AI client like Bob/Claude Desktop
 *   http             — Streamable HTTP on PORT (default 3000)
 *   sse              — Legacy SSE on PORT (default 3000)
 *
 * Usage examples:
 *   node build/index.js                         # stdio
 *   DIO_TRANSPORT=http PORT=3000 node build/index.js
 *   DIO_TRANSPORT=sse  PORT=3000 node build/index.js
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { z } from 'zod';
import http from 'node:http';
import { executarTrilha, listarTecnologias } from './tools/trilha.js';
import { executarDesafio } from './tools/desafio.js';
import { executarCertificado } from './tools/certificado.js';

// ─── Server instance ──────────────────────────────────────────────────────────

const server = new McpServer({
  name: 'dio-explorer',
  version: '1.0.0',
});

// ─── Tool: trilha ─────────────────────────────────────────────────────────────

server.registerTool(
  'trilha',
  {
    description:
      'Busca o plano de estudos de uma trilha DIO pela tecnologia (Python, React, Java, etc.). ' +
      'Retorna módulos, badges, promoções e lives programadas.',
    inputSchema: z.object({
      tecnologia: z
        .string()
        .describe('Nome da tecnologia ou trilha (ex: Python, React, Machine Learning)'),
    }),
  },
  async ({ tecnologia }) => {
    try {
      const resultado = executarTrilha(tecnologia);
      return { content: [{ type: 'text', text: resultado }] };
    } catch (err) {
      return {
        content: [{ type: 'text', text: `Erro ao buscar trilha: ${err instanceof Error ? err.message : String(err)}` }],
        isError: true,
      };
    }
  }
);

// ─── Tool: desafio ────────────────────────────────────────────────────────────

server.registerTool(
  'desafio',
  {
    description:
      'Sorteia um desafio de código para uma tecnologia e nível escolhidos. ' +
      'Retorna enunciado, exemplo de entrada/saída e critérios de avaliação.',
    inputSchema: z.object({
      tecnologia: z
        .string()
        .describe('Tecnologia alvo do desafio (ex: Python, JavaScript, Java)'),
      nivel: z
        .enum(['iniciante', 'intermediario', 'avancado'])
        .optional()
        .describe('Nível de dificuldade. Padrão: intermediario'),
    }),
  },
  async ({ tecnologia, nivel }) => {
    try {
      const resultado = executarDesafio(tecnologia, nivel);
      return { content: [{ type: 'text', text: resultado }] };
    } catch (err) {
      return {
        content: [{ type: 'text', text: `Erro ao sortear desafio: ${err instanceof Error ? err.message : String(err)}` }],
        isError: true,
      };
    }
  }
);

// ─── Tool: certificado ────────────────────────────────────────────────────────

server.registerTool(
  'certificado',
  {
    description:
      'Gera um certificado de conclusão fictício (educacional) para uma trilha DIO. ' +
      'Retorna o certificado formatado em Markdown com código de verificação.',
    inputSchema: z.object({
      nome_usuario: z
        .string()
        .describe('Nome completo do aluno que receberá o certificado'),
      trilha: z
        .string()
        .describe('Nome ou tecnologia da trilha concluída (ex: Python, "Machine Learning")'),
    }),
  },
  async ({ nome_usuario, trilha }) => {
    try {
      const resultado = executarCertificado(nome_usuario, trilha);
      return { content: [{ type: 'text', text: resultado }] };
    } catch (err) {
      return {
        content: [{ type: 'text', text: `Erro ao gerar certificado: ${err instanceof Error ? err.message : String(err)}` }],
        isError: true,
      };
    }
  }
);

// ─── Tool: listar_trilhas ─────────────────────────────────────────────────────

server.registerTool(
  'listar_trilhas',
  {
    description: 'Lista todas as tecnologias de trilhas disponíveis no DIO Explorer.',
    inputSchema: z.object({}),
  },
  async () => {
    try {
      const tecnologias = listarTecnologias();
      const lista = tecnologias.map((t, i) => `${i + 1}. ${t}`).join('\n');
      return {
        content: [
          {
            type: 'text',
            text: `📋 Trilhas disponíveis no DIO Explorer (${tecnologias.length} total):\n\n${lista}`,
          },
        ],
      };
    } catch (err) {
      return {
        content: [{ type: 'text', text: `Erro ao listar trilhas: ${err instanceof Error ? err.message : String(err)}` }],
        isError: true,
      };
    }
  }
);

// ─── Transport selection ──────────────────────────────────────────────────────

const TRANSPORT = (process.env['DIO_TRANSPORT'] ?? 'stdio').toLowerCase();
const PORT = parseInt(process.env['PORT'] ?? '3000', 10);

async function startStdio(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[dio-explorer-mcp] Running on stdio');
}

async function startHttp(): Promise<void> {
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  await server.connect(transport);

  const httpServer = http.createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/mcp') {
      await transport.handleRequest(req, res);
    } else if (req.method === 'GET' && req.url === '/mcp') {
      await transport.handleRequest(req, res);
    } else if (req.method === 'DELETE' && req.url === '/mcp') {
      await transport.handleRequest(req, res);
    } else if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', server: 'dio-explorer-mcp', transport: 'http' }));
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  httpServer.listen(PORT, () => {
    console.error(`[dio-explorer-mcp] Streamable HTTP running on http://0.0.0.0:${PORT}/mcp`);
    console.error(`[dio-explorer-mcp] Health check: http://0.0.0.0:${PORT}/health`);
  });
}

async function startSse(): Promise<void> {
  // SSE transport: one persistent connection per client
  const transports = new Map<string, SSEServerTransport>();

  const httpServer = http.createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);

    if (req.method === 'GET' && url.pathname === '/sse') {
      const transport = new SSEServerTransport('/messages', res);
      transports.set(transport.sessionId, transport);
      res.on('close', () => transports.delete(transport.sessionId));
      await server.connect(transport);
      console.error(`[dio-explorer-mcp] SSE client connected: ${transport.sessionId}`);
    } else if (req.method === 'POST' && url.pathname === '/messages') {
      const sessionId = url.searchParams.get('sessionId') ?? '';
      const transport = transports.get(sessionId);
      if (transport) {
        await transport.handlePostMessage(req, res);
      } else {
        res.writeHead(404);
        res.end('Session not found');
      }
    } else if (url.pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', server: 'dio-explorer-mcp', transport: 'sse' }));
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  httpServer.listen(PORT, () => {
    console.error(`[dio-explorer-mcp] SSE server running on http://0.0.0.0:${PORT}/sse`);
    console.error(`[dio-explorer-mcp] Messages endpoint: http://0.0.0.0:${PORT}/messages`);
    console.error(`[dio-explorer-mcp] Health check: http://0.0.0.0:${PORT}/health`);
  });
}

// ─── Entry point ──────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  switch (TRANSPORT) {
    case 'http':
      await startHttp();
      break;
    case 'sse':
      await startSse();
      break;
    default:
      await startStdio();
  }
}

main().catch((err) => {
  console.error('[dio-explorer-mcp] Fatal error:', err);
  process.exit(1);
});
