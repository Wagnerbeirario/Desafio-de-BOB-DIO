import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '..', '..', '..', 'data', 'trilhas_dio.json');

interface Trilha {
  id: number;
  nome: string;
  tecnologia: string;
  nivel: string;
  numero_de_modulos: number;
  xp_total: number;
  badges_disponiveis: string[];
  promocoes: { desconto: string; validade: string | null };
  vitalicio: boolean;
  lives_ao_vivo: { titulo: string; data: string; horario: string }[];
}

export function carregarTrilhas(): Trilha[] {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return (JSON.parse(raw) as { trilhas: Trilha[] }).trilhas;
}

export function buscarTrilha(tecnologia: string): Trilha | null {
  if (!tecnologia.trim()) return null;
  const lista = carregarTrilhas();
  const termo = tecnologia.trim().toLowerCase();

  const exata = lista.find((t) => t.tecnologia.toLowerCase() === termo);
  if (exata) return exata;

  const parcial = lista.find((t) => t.tecnologia.toLowerCase().includes(termo));
  if (parcial) return parcial;

  return lista.find((t) => t.nome.toLowerCase().includes(termo)) ?? null;
}

export function listarTecnologias(): string[] {
  return carregarTrilhas().map((t) => t.tecnologia);
}

export function executarTrilha(tecnologia: string): string {
  const trilha = buscarTrilha(tecnologia);

  if (!trilha) {
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

  const vitalicio = trilha.vitalicio ? 'Sim' : 'Não';
  const badges = trilha.badges_disponiveis;
  const b0 = badges[0] ?? '—';
  const b1 = badges[1] ?? '—';
  const b2 = badges[2] ?? '—';
  const validade = trilha.promocoes.validade ?? 'Sem prazo';

  const livesBlock = (trilha.lives_ao_vivo ?? [])
    .slice(0, 2)
    .map((l) => `  ${l.titulo}\n    📅 Data: ${l.data}  ⏰ Horário: ${l.horario}`)
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
