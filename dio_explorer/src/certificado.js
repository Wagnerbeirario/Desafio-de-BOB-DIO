'use strict';

const fs   = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data', 'trilhas_dio.json');

/**
 * Carrega e faz o parse do arquivo trilhas_dio.json.
 * @param {string} [filePath]
 * @returns {{ trilhas: object[] }}
 */
function carregarTrilhas(filePath) {
  const target = filePath || DATA_PATH;
  const raw    = fs.readFileSync(target, 'utf-8');
  return JSON.parse(raw);
}

/**
 * Busca trilha por tecnologia ou nome (case-insensitive, parcial).
 * @param {string} trilha
 * @param {object[]|null} [trilhas]
 * @param {string} [filePath]
 * @returns {object|null}
 */
function buscarTrilha(trilha, trilhas, filePath) {
  if (!trilha || trilha.trim() === '') return null;
  const lista = trilhas || carregarTrilhas(filePath).trilhas;
  const termo = trilha.trim().toLowerCase();

  // Prioridade 1: correspondência exata no campo tecnologia
  const exata = lista.find(t => t.tecnologia.toLowerCase() === termo);
  if (exata) return exata;

  // Prioridade 2: correspondência parcial no campo tecnologia
  const parcial = lista.find(t => t.tecnologia.toLowerCase().includes(termo));
  if (parcial) return parcial;

  // Prioridade 3: fallback pelo campo nome
  return lista.find(t => t.nome.toLowerCase().includes(termo)) || null;
}

/**
 * Gera um código de verificação fictício.
 * Formato: {SIGLA}{ANO}{MES}{4-hex}
 * @param {string} tecnologia
 * @param {string} [dataOverride] - data no formato YYYY-MM-DD para testes
 * @param {string} [hexOverride]  - 4 chars hex para testes
 * @returns {string}
 */
function gerarCodigoVerificacao(tecnologia, dataOverride, hexOverride) {
  // Parse ISO date string as local time (avoid UTC-offset issues)
  let now;
  if (dataOverride) {
    const [y, m, d] = dataOverride.split('-').map(Number);
    now = new Date(y, m - 1, d);
  } else {
    now = new Date();
  }
  const ano    = now.getFullYear();
  const mes    = String(now.getMonth() + 1).padStart(2, '0');
  const sigla  = tecnologia.replace(/[^a-zA-Z]/g, '').substring(0, 2).toUpperCase();
  const hex    = hexOverride || Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  return `${sigla}${ano}${mes}${hex}`;
}

/**
 * Formata a data para exibição: DD/MM/AAAA
 * @param {string} [dataOverride] - YYYY-MM-DD para testes
 * @returns {string}
 */
function formatarDataEmissao(dataOverride) {
  let d;
  if (dataOverride) {
    const [y, m, day] = dataOverride.split('-').map(Number);
    d = new Date(y, m - 1, day);
  } else {
    d = new Date();
  }
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}

/**
 * Calcula a carga horária estimada.
 * @param {number} numeroModulos
 * @returns {number}
 */
function calcularCargaHoraria(numeroModulos) {
  return numeroModulos * 8;
}

/**
 * Gera o certificado em Markdown.
 * @param {string} nomeUsuario
 * @param {object} trilha
 * @param {object} [opcoes]   - { dataOverride, hexOverride }
 * @returns {string}
 */
function gerarCertificado(nomeUsuario, trilha, opcoes) {
  const opts          = opcoes || {};
  const dataEmissao   = formatarDataEmissao(opts.dataOverride);
  const cargaHoraria  = calcularCargaHoraria(trilha.numero_de_modulos);
  const codigo        = gerarCodigoVerificacao(trilha.tecnologia, opts.dataOverride, opts.hexOverride);
  const vitalicioText = trilha.vitalicio ? 'Sim' : 'Não';
  const badges        = trilha.badges_disponiveis || [];
  const b0            = badges[0] || '—';
  const b1            = badges[1] || '—';
  const b2            = badges[2] || '—';

  return [
    '---',
    '',
    '<div align="center">',
    '',
    '# 🏛️ DIGITAL INNOVATION ONE',
    '',
    '## CERTIFICADO DE CONCLUSÃO',
    '',
    '---',
    '',
    'Este certificado é conferido a',
    '',
    `# ${nomeUsuario.toUpperCase()}`,
    '',
    'que concluiu com êxito a trilha de formação',
    '',
    `## "${trilha.nome}"`,
    '',
    'ofertada pela plataforma **DIO — Digital Innovation One**',
    'em parceria com os melhores especialistas do mercado.',
    '',
    '---',
    '',
    '| 🛠️ Tecnologia | 📊 Nível | 🧩 Módulos | ⭐ XP Obtido | ⏱️ Carga Horária |',
    '|:---:|:---:|:---:|:---:|:---:|',
    `| ${trilha.tecnologia} | ${trilha.nivel} | ${trilha.numero_de_modulos} | ${trilha.xp_total} XP | ${cargaHoraria}h |`,
    '',
    '---',
    '',
    '### 🏅 Badges Conquistadas',
    '',
    '| Badge | Status |',
    '|:---:|:---:|',
    `| ${b0} | ✅ Conquistada |`,
    `| ${b1} | ✅ Conquistada |`,
    `| ${b2} | ✅ Conquistada |`,
    '',
    '---',
    '',
    '### 📋 Informações do Certificado',
    '',
    '| Campo | Valor |',
    '|---|---|',
    `| 📅 Data de Emissão | ${dataEmissao} |`,
    `| 🔑 Código de Verificação | \`DIO-${codigo}\` |`,
    `| 🌐 Verificar em | https://www.dio.me/certificate/${codigo} |`,
    `| ♾️ Acesso Vitalício | ${vitalicioText} |`,
    '',
    '---',
    '',
    '> _"A educação é a arma mais poderosa que você pode usar para mudar o mundo."_',
    '> — Nelson Mandela',
    '',
    '---',
    '',
    '**Roberto Melo**',
    '_CEO & Founder — Digital Innovation One_',
    '',
    '🌐 [dio.me](https://www.dio.me) | 📧 contato@dio.me',
    '',
    '---',
    '',
    '_Certificado gerado pelo DIO Explorer · Documento fictício para fins educacionais_',
    '',
    '</div>',
    '',
    '---',
  ].join('\n');
}

/**
 * Mensagem de erro quando a trilha não é encontrada.
 * @param {string} trilha
 * @returns {string}
 */
function erroCertificadoTrilhaNaoEncontrada(trilha) {
  return [
    `❌ Trilha não encontrada para: "${trilha}"`,
    '',
    '📋 Verifique o nome da trilha em: dio_explorer/data/trilhas_dio.json',
    '💡 Exemplo: /certificado "Seu Nome" Python',
    '            /certificado "Seu Nome" React',
    '            /certificado "Seu Nome" "Machine Learning"',
  ].join('\n');
}

/**
 * Ponto de entrada principal do comando /certificado.
 * @param {string} nomeUsuario
 * @param {string} trilhaBuscada
 * @param {object[]|null} [trilhas]
 * @param {object} [opcoes] - { dataOverride, hexOverride, filePath }
 * @returns {string}
 */
function executarCertificado(nomeUsuario, trilhaBuscada, trilhas, opcoes) {
  if (!nomeUsuario || nomeUsuario.trim() === '') {
    return '❌ Informe seu nome. Ex: /certificado "João Silva" Python';
  }
  if (!trilhaBuscada || trilhaBuscada.trim() === '') {
    return '❌ Informe a trilha. Ex: /certificado "João Silva" Python';
  }
  const opts      = opcoes || {};
  const encontrada = buscarTrilha(trilhaBuscada, trilhas, opts.filePath);
  if (!encontrada) return erroCertificadoTrilhaNaoEncontrada(trilhaBuscada);
  return gerarCertificado(nomeUsuario, encontrada, opts);
}

module.exports = {
  carregarTrilhas,
  buscarTrilha,
  gerarCodigoVerificacao,
  formatarDataEmissao,
  calcularCargaHoraria,
  gerarCertificado,
  erroCertificadoTrilhaNaoEncontrada,
  executarCertificado,
};
