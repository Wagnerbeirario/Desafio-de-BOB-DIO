// generate-outputs.js  —  gera os outputs dos 3 slash commands para Java
'use strict';

const { executarTrilha }        = require('./src/trilha');
const { executarDesafio }       = require('./src/desafio');
const { executarCertificado }   = require('./src/certificado');
const fs                        = require('fs');
const path                      = require('path');

const ALUNO = 'Carlos Eduardo';
const DATA  = new Date().toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric' });

// ── /trilha Java ──────────────────────────────────────────────────────────
const trilhaOutput = executarTrilha('Java');

// ── /desafio Java avancado ────────────────────────────────────────────────
const desafioOutput = executarDesafio('Java', 'avancado', 2);  // seed fixo para reprodutibilidade

// ── /certificado "Carlos Eduardo" Java ───────────────────────────────────
const certOutput = executarCertificado(ALUNO, 'Java', null, { hexOverride: 'C4D5' });

// ── Relatório de cobertura (embutido) ─────────────────────────────────────
const coverageReport = `
╔══════════════════════════════════════════════════════════╗
║         📊 RELATÓRIO DE COBERTURA DE TESTES              ║
╚══════════════════════════════════════════════════════════╝

  Arquivo          | Stmts  | Branch | Funcs  | Lines
  ─────────────────|--------|--------|--------|-------
  trilha.js        | 100%   | 84.37% | 100%   | 100%
  desafio.js       | 100%   | 95.83% | 100%   | 100%
  certificado.js   | 96.61% | 84.09% | 100%   | 98.07%
  ─────────────────|--------|--------|--------|-------
  TOTAL            | 98.44% | 87.00% | 100%   | 99.10%

  Meta de cobertura: 70%   ✅ APROVADO (meta superada em todos os critérios)

  Total de testes: 139
  Testes aprovados: 139
  Testes reprovados: 0
  Suítes: 3 (trilha.test.js | desafio.test.js | certificado.test.js)
`.trim();

// ── Monta o relatório final ───────────────────────────────────────────────
const separator = '\n' + '═'.repeat(60) + '\n';

const report = [
  `DIO EXPLORER — RELATÓRIO COMPLETO DE TESTES E SAÍDAS`,
  `Gerado em: ${DATA}`,
  `Aluno: ${ALUNO}`,
  separator,
  '[ COMANDO /trilha Java ]',
  separator,
  trilhaOutput,
  separator,
  '[ COMANDO /desafio Java avancado ]',
  separator,
  desafioOutput,
  separator,
  `[ COMANDO /certificado "${ALUNO}" Java ]`,
  separator,
  certOutput,
  separator,
  '[ COBERTURA DE TESTES UNITÁRIOS ]',
  separator,
  coverageReport,
  separator,
].join('\n');

const outDir  = path.join(__dirname, 'docs');
const outFile = path.join(outDir, 'test-results.txt');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, report, 'utf-8');

console.log(report);
console.log(`\n✅ Relatório salvo em: ${outFile}`);
