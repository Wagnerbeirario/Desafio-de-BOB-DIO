'use strict';

const fs   = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data', 'trilhas_dio.json');

/**
 * Carrega e faz o parse do arquivo trilhas_dio.json.
 * @param {string} [filePath] - caminho opcional para injeção em testes
 * @returns {{ trilhas: object[] }}
 */
function carregarTrilhas(filePath) {
  const target = filePath || DATA_PATH;
  const raw    = fs.readFileSync(target, 'utf-8');
  return JSON.parse(raw);
}

/**
 * Busca uma trilha pelo nome da tecnologia (case-insensitive, parcial).
 * Tenta primeiro no campo `tecnologia`; fallback no campo `nome`.
 * @param {string} tecnologia
 * @param {object[]|null} [trilhas] - lista opcional (para testes sem I/O)
 * @param {string} [filePath]
 * @returns {object|null}
 */
function buscarTrilha(tecnologia, trilhas, filePath) {
  if (!tecnologia || tecnologia.trim() === '') return null;

  const lista = trilhas || carregarTrilhas(filePath).trilhas;
  const termo = tecnologia.trim().toLowerCase();

  // Prioridade 1: correspondência exata no campo tecnologia
  const exata = lista.find(t => t.tecnologia.toLowerCase() === termo);
  if (exata) return exata;

  // Prioridade 2: correspondência parcial no campo tecnologia
  const porTecnologia = lista.find(t =>
    t.tecnologia.toLowerCase().includes(termo)
  );
  if (porTecnologia) return porTecnologia;

  // Prioridade 3: fallback pelo campo nome
  const porNome = lista.find(t =>
    t.nome.toLowerCase().includes(termo)
  );
  return porNome || null;
}

/**
 * Formata o plano de estudos de uma trilha no template ASCII padrão.
 * @param {object} trilha
 * @returns {string}
 */
function formatarPlanoEstudos(trilha) {
  const vitalicio  = trilha.vitalicio ? 'Sim' : 'Não';
  const badges     = trilha.badges_disponiveis || [];
  const b0         = badges[0] || '—';
  const b1         = badges[1] || '—';
  const b2         = badges[2] || '—';
  const validade   = trilha.promocoes.validade || 'Sem prazo';

  const livesBlock = (trilha.lives_ao_vivo || [])
    .slice(0, 2)
    .map((l, i) =>
      `  ${l.titulo}\n    📅 Data: ${l.data}  ⏰ Horário: ${l.horario}`
    )
    .join('\n\n');

  return [
    '╔══════════════════════════════════════════════════════════╗',
    '║           🎓 PLANO DE ESTUDOS — DIO EXPLORER             ║',
    '╚══════════════════════════════════════════════════════════╝',
    '',
    `📚 Trilha: ${trilha.nome}`,
    `🛠️  Tecnologia: ${trilha.tecnologia}`,
    `📊 Nível: ${trilha.nivel}`,
    `🧩 Total de Módulos: ${trilha.numero_de_modulos}`,
    `⭐ XP Total ao Concluir: ${trilha.xp_total} XP`,
    `♾️  Acesso Vitalício: ${vitalicio}`,
    '',
    '──────────────────────────────────────────────────────────',
    '🗺️  MÓDULOS DO PLANO DE ESTUDOS',
    '──────────────────────────────────────────────────────────',
    '',
    `  Módulo 01 — Introdução e Fundamentos de ${trilha.tecnologia}`,
    '  Módulo 02 — Configuração do Ambiente e Ferramentas',
    '  Módulo 03 — Conceitos Core: Sintaxe e Estruturas',
    '  Módulo 04 — Trabalhando com Funções e Módulos',
    '  Módulo 05 — Orientação a Objetos / Paradigmas',
    '  Módulo 06 — Manipulação de Dados e Arquivos',
    '  Módulo 07 — Integrações e APIs',
    '  Módulo 08 — Testes e Qualidade de Código',
    '  Módulo 09 — Boas Práticas e Design Patterns',
    '  Módulo 10 — Projeto Prático Intermediário',
    `  Módulo 11 — Tópicos Avançados de ${trilha.tecnologia}`,
    '  Módulo 12 — Projeto Final e Deploy',
    `  ... (total: ${trilha.numero_de_modulos} módulos)`,
    '',
    '──────────────────────────────────────────────────────────',
    '🏅 BADGES DISPONÍVEIS',
    '──────────────────────────────────────────────────────────',
    '',
    `  ${b0}  →  Conquistada ao finalizar o Módulo 04`,
    `  ${b1}  →  Conquistada ao finalizar o Módulo 08`,
    `  ${b2}  →  Conquistada ao concluir a trilha completa`,
    '',
    '──────────────────────────────────────────────────────────',
    '💰 PROMOÇÃO ATIVA',
    '──────────────────────────────────────────────────────────',
    '',
    `  🔖 Desconto: ${trilha.promocoes.desconto}`,
    `  📅 Válido até: ${validade}`,
    '',
    '──────────────────────────────────────────────────────────',
    '🎙️  LIVES AO VIVO PROGRAMADAS',
    '──────────────────────────────────────────────────────────',
    '',
    livesBlock,
    '',
    '──────────────────────────────────────────────────────────',
    `💡 Dica: Use /desafio ${trilha.tecnologia} para praticar com um desafio!`,
    `         Use /certificado <seu_nome> "${trilha.nome}" ao concluir a trilha.`,
    '──────────────────────────────────────────────────────────',
  ].join('\n');
}

/**
 * Mensagem de erro quando a trilha não é encontrada.
 * @param {string} tecnologia
 * @returns {string}
 */
function erroTrilhaNaoEncontrada(tecnologia) {
  return [
    `❌ Trilha não encontrada para a tecnologia: "${tecnologia}"`,
    '',
    '📋 Tecnologias disponíveis no momento:',
    '   • Python          • JavaScript      • DevOps',
    '   • Machine Learning• React           • Java',
    '   • AWS             • Apache Spark    • Vue.js',
    '   • Cybersecurity   • Go              • Flutter',
    '',
    '💡 Tente: /trilha Python  ou  /trilha React',
  ].join('\n');
}

/**
 * Ponto de entrada principal do comando /trilha.
 * @param {string} tecnologia
 * @param {object[]|null} [trilhas]
 * @param {string} [filePath]
 * @returns {string}
 */
function executarTrilha(tecnologia, trilhas, filePath) {
  const encontrada = buscarTrilha(tecnologia, trilhas, filePath);
  if (!encontrada) return erroTrilhaNaoEncontrada(tecnologia || '');
  return formatarPlanoEstudos(encontrada);
}

module.exports = {
  carregarTrilhas,
  buscarTrilha,
  formatarPlanoEstudos,
  erroTrilhaNaoEncontrada,
  executarTrilha,
};
