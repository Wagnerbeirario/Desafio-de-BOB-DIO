const BANCO: Record<string, { titulo: string; enunciado: string; entrada: string; saida: string; tempo: string }[]> = {
  iniciante: [
    {
      titulo: 'Calculadora Simples',
      enunciado: 'Crie uma função que receba dois números e uma operação (+, -, *, /) e retorne o resultado. Trate divisão por zero.',
      entrada: 'calcular(10, 2, "*")  →  resultado esperado: 20',
      saida: '20',
      tempo: '20 minutos',
    },
    {
      titulo: 'Verificador de Palíndromo',
      enunciado: 'Escreva uma função que verifique se uma string é um palíndromo, ignorando espaços, pontuação e diferença de maiúsculas/minúsculas.',
      entrada: 'palindromo("A man a plan a canal Panama")',
      saida: 'true',
      tempo: '20 minutos',
    },
    {
      titulo: 'FizzBuzz Clássico',
      enunciado: 'Imprima os números de 1 a 100. Para múltiplos de 3 imprima "Fizz", de 5 imprima "Buzz", de ambos imprima "FizzBuzz".',
      entrada: 'fizzBuzz(15)',
      saida: '"FizzBuzz"',
      tempo: '15 minutos',
    },
  ],
  intermediario: [
    {
      titulo: 'API de Tarefas (CRUD)',
      enunciado: 'Crie uma API REST com endpoints para criar, listar, atualizar e deletar tarefas. Cada tarefa tem id, título, status e data de criação.',
      entrada: 'POST /tarefas { "titulo": "Estudar Java", "status": "pendente" }',
      saida: '201 Created { "id": 1, "titulo": "Estudar Java", "status": "pendente", "criadoEm": "2025-01-01" }',
      tempo: '45 minutos',
    },
    {
      titulo: 'Validador de CPF',
      enunciado: 'Implemente do zero o algoritmo de validação de CPF brasileiro (dois dígitos verificadores). Aceite CPF com ou sem formatação.',
      entrada: 'validarCPF("529.982.247-25")',
      saida: 'true',
      tempo: '40 minutos',
    },
    {
      titulo: 'Cache LRU',
      enunciado: 'Implemente uma estrutura de Cache LRU com capacidade máxima configurável, suportando get e put em O(1).',
      entrada: 'cache = new LRUCache(2)\ncache.put(1, "A")\ncache.get(1)',
      saida: '"A"',
      tempo: '50 minutos',
    },
  ],
  avancado: [
    {
      titulo: 'Mini Compilador',
      enunciado: 'Implemente um parser de expressões matemáticas com precedência de operadores (+, -, *, /, parênteses) usando Shunting-Yard ou descent recursivo.',
      entrada: 'parse("3 + 4 * 2 / (1 - 5)")',
      saida: '1',
      tempo: '90 minutos',
    },
    {
      titulo: 'Banco de Dados em Memória',
      enunciado: 'Implemente um banco de dados chave-valor em memória com suporte a transações (BEGIN, COMMIT, ROLLBACK) e comandos SET, GET, DELETE.',
      entrada: 'db.begin()\ndb.set("x", 10)\ndb.rollback()\ndb.get("x")',
      saida: 'null  (rollback desfez o SET)',
      tempo: '90 minutos',
    },
    {
      titulo: 'Algoritmo de Dijkstra',
      enunciado: 'Implemente Dijkstra para encontrar o menor caminho entre dois nós em um grafo ponderado representado por lista de adjacência.',
      entrada: 'dijkstra(grafo, "A", "D")',
      saida: '{ distancia: 5, caminho: ["A", "B", "D"] }',
      tempo: '90 minutos',
    },
  ],
};

const XP_POR_NIVEL: Record<string, number> = {
  iniciante: 500,
  intermediario: 1500,
  avancado: 3000,
};

const EMOJI_NIVEL: Record<string, string> = {
  iniciante: '🟢',
  intermediario: '🟡',
  avancado: '🔴',
};

const TECNOLOGIAS_VALIDAS = new Set([
  'python', 'javascript', 'java', 'go', 'rust', 'c#', 'typescript', 'react',
  'angular', 'vue.js', 'flutter', 'kotlin', 'devops', 'aws', 'gcp', 'docker',
  'kubernetes', 'machine learning', 'ia generativa', 'mlops', 'cybersecurity',
  'blockchain', 'databases', 'apache spark', 'power bi', 'sre', 'design', 'figma',
  'linux', 'unity', 'c#/.net', 'arquitetura de software',
]);

export function normalizarNivel(nivel?: string): 'iniciante' | 'intermediario' | 'avancado' {
  if (!nivel) return 'intermediario';
  const n = nivel.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (n === 'iniciante') return 'iniciante';
  if (n === 'avancado') return 'avancado';
  return 'intermediario';
}

export function tecnologiaValida(tecnologia: string): boolean {
  if (!tecnologia.trim()) return false;
  const t = tecnologia.toLowerCase().trim();
  for (const v of TECNOLOGIAS_VALIDAS) {
    if (v.includes(t) || t.includes(v)) return true;
  }
  return false;
}

export function executarDesafio(tecnologia: string, nivel?: string): string {
  if (!tecnologiaValida(tecnologia)) {
    return [
      `❌ Tecnologia "${tecnologia}" não reconhecida para desafios.`,
      '',
      '💡 Tente uma destas:',
      '   Python, JavaScript, Java, Go, Rust, C#, TypeScript,',
      '   React, Angular, Vue.js, Flutter, Kotlin,',
      '   DevOps, AWS, GCP, Docker, Kubernetes,',
      '   Machine Learning, IA Generativa, MLOps,',
      '   Cybersecurity, Blockchain, Databases',
      '',
      'Exemplo: /desafio Java avancado',
    ].join('\n');
  }

  const nivelNorm = normalizarNivel(nivel);
  const banco = BANCO[nivelNorm];
  const desafio = banco[Math.floor(Math.random() * banco.length)];
  const seed = Math.floor(Math.random() * 9000) + 1000;
  const xp = XP_POR_NIVEL[nivelNorm];
  const emoji = EMOJI_NIVEL[nivelNorm];
  const nivelLabel = nivelNorm.charAt(0).toUpperCase() + nivelNorm.slice(1);

  return [
    '╔══════════════════════════════════════════════════════════╗',
    '║            ⚡ DESAFIO DE CÓDIGO — DIO EXPLORER           ║',
    '╚══════════════════════════════════════════════════════════╝',
    '',
    `🎯 Desafio: ${desafio.titulo}`,
    `🛠️  Tecnologia: ${tecnologia}`,
    `📊 Nível: ${emoji} ${nivelLabel}`,
    `⭐ XP ao Completar: ${xp} XP`,
    `🎲 Seed do Desafio: #${seed}`,
    '',
    '──────────────────────────────────────────────────────────',
    '📋 ENUNCIADO',
    '──────────────────────────────────────────────────────────',
    '',
    `  ${desafio.enunciado}`,
    '',
    '──────────────────────────────────────────────────────────',
    '📥 EXEMPLO DE ENTRADA',
    '──────────────────────────────────────────────────────────',
    '',
    `  ${desafio.entrada}`,
    '',
    '──────────────────────────────────────────────────────────',
    '📤 EXEMPLO DE SAÍDA ESPERADA',
    '──────────────────────────────────────────────────────────',
    '',
    `  ${desafio.saida}`,
    '',
    '──────────────────────────────────────────────────────────',
    `⏱️  Tempo estimado: ${desafio.tempo}`,
    '💡 Dica: Ao concluir, use /certificado <seu_nome> <trilha> para gerar seu certificado!',
    '──────────────────────────────────────────────────────────',
  ].join('\n');
}
