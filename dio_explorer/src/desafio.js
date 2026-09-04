'use strict';

/** Banco de desafios por nível */
const BANCO = {
  iniciante: [
    {
      titulo: 'Calculadora Simples',
      enunciado: 'Crie uma função que receba dois números e uma operação (+, -, *, /) e retorne o resultado. Trate divisão por zero.',
      entrada: 'calcular(10, 2, "*")  →  resultado esperado: 20',
      saida:   '20',
      tempo:   '20 minutos',
    },
    {
      titulo: 'Verificador de Palíndromo',
      enunciado: 'Escreva uma função que verifique se uma string é um palíndromo, ignorando espaços, pontuação e diferença de maiúsculas/minúsculas.',
      entrada: 'palindromo("A man a plan a canal Panama")',
      saida:   'true',
      tempo:   '20 minutos',
    },
    {
      titulo: 'FizzBuzz Clássico',
      enunciado: 'Imprima os números de 1 a 100. Para múltiplos de 3 imprima "Fizz", de 5 imprima "Buzz", de ambos imprima "FizzBuzz".',
      entrada: 'fizzBuzz(15)',
      saida:   '"FizzBuzz"',
      tempo:   '15 minutos',
    },
    {
      titulo: 'Contador de Vogais',
      enunciado: 'Conte quantas vogais (a, e, i, o, u — maiúsculas e minúsculas) existem em uma string informada.',
      entrada: 'contarVogais("Hello World")',
      saida:   '3',
      tempo:   '15 minutos',
    },
    {
      titulo: 'Inversor de String',
      enunciado: 'Retorne uma string invertida sem usar funções nativas de reversão.',
      entrada: 'inverter("hello")',
      saida:   '"olleh"',
      tempo:   '15 minutos',
    },
    {
      titulo: 'Par ou Ímpar em Lote',
      enunciado: 'Receba uma lista de números inteiros e retorne um objeto com dois campos: pares e impares.',
      entrada: 'classificar([1, 2, 3, 4, 5])',
      saida:   '{ pares: [2, 4], impares: [1, 3, 5] }',
      tempo:   '20 minutos',
    },
    {
      titulo: 'Tabuada Dinâmica',
      enunciado: 'Gere e exiba a tabuada completa (de 1 a 10) de qualquer número informado.',
      entrada: 'tabuada(7)',
      saida:   '7 x 1 = 7\n7 x 2 = 14\n...',
      tempo:   '15 minutos',
    },
  ],
  intermediario: [
    {
      titulo: 'API de Tarefas (CRUD)',
      enunciado: 'Crie uma API REST com endpoints para criar, listar, atualizar e deletar tarefas. Cada tarefa tem id, título, status e data de criação.',
      entrada: 'POST /tarefas { "titulo": "Estudar Java", "status": "pendente" }',
      saida:   '201 Created { "id": 1, "titulo": "Estudar Java", "status": "pendente", "criadoEm": "2025-01-01" }',
      tempo:   '45 minutos',
    },
    {
      titulo: 'Validador de CPF',
      enunciado: 'Implemente do zero o algoritmo de validação de CPF brasileiro (dois dígitos verificadores). Aceite CPF com ou sem formatação.',
      entrada: 'validarCPF("529.982.247-25")',
      saida:   'true',
      tempo:   '40 minutos',
    },
    {
      titulo: 'Anagramas',
      enunciado: 'Verifique se duas strings são anagramas uma da outra. Ignore espaços e maiúsculas/minúsculas.',
      entrada: 'anagrama("listen", "silent")',
      saida:   'true',
      tempo:   '30 minutos',
    },
    {
      titulo: 'Cache LRU',
      enunciado: 'Implemente uma estrutura de Cache LRU com capacidade máxima configurável, suportando get e put em O(1).',
      entrada: 'cache = new LRUCache(2)\ncache.put(1, "A")\ncache.put(2, "B")\ncache.get(1)',
      saida:   '"A"  (sem evicção)\ncache.put(3,"C") → evicta chave 2',
      tempo:   '50 minutos',
    },
    {
      titulo: 'Parser de CSV',
      enunciado: 'Leia um arquivo CSV sem usar bibliotecas prontas e converta cada linha em um objeto cujas chaves são os cabeçalhos.',
      entrada: '"nome,idade\\nAna,30\\nBob,25"',
      saida:   '[{ nome: "Ana", idade: "30" }, { nome: "Bob", idade: "25" }]',
      tempo:   '40 minutos',
    },
    {
      titulo: 'Árvore Binária de Busca',
      enunciado: 'Implemente inserção, busca e as três travessias (in-order, pre-order, post-order) em uma BST.',
      entrada: 'bst.insert(5); bst.insert(3); bst.insert(7)\nbst.inOrder()',
      saida:   '[3, 5, 7]',
      tempo:   '55 minutos',
    },
    {
      titulo: 'Rate Limiter',
      enunciado: 'Implemente um rate limiter usando o algoritmo Token Bucket. Configure capacidade máxima e taxa de recarga por segundo.',
      entrada: 'limiter = new TokenBucket(10, 2)  // 10 tokens, 2/s\nlimiter.consume(1)',
      saida:   'true (tokens restantes: 9)',
      tempo:   '50 minutos',
    },
  ],
  avancado: [
    {
      titulo: 'Mini Compilador',
      enunciado: 'Implemente um parser de expressões matemáticas com precedência de operadores (+, -, *, /, parênteses) usando Shunting-Yard ou descent recursivo.',
      entrada: 'parse("3 + 4 * 2 / (1 - 5)")',
      saida:   '1',
      tempo:   '90 minutos',
    },
    {
      titulo: 'Web Scraper Assíncrono',
      enunciado: 'Crie um scraper assíncrono que colete títulos e links de múltiplas páginas em paralelo, salvando os resultados em JSON.',
      entrada: 'scrape(["https://example.com/p1", "https://example.com/p2"])',
      saida:   '[{ titulo: "...", link: "..." }, ...]',
      tempo:   '90 minutos',
    },
    {
      titulo: 'Banco de Dados em Memória',
      enunciado: 'Implemente um banco de dados chave-valor em memória com suporte a transações (BEGIN, COMMIT, ROLLBACK) e comandos SET, GET, DELETE.',
      entrada: 'db.begin()\ndb.set("x", 10)\ndb.rollback()\ndb.get("x")',
      saida:   'null  (rollback desfez o SET)',
      tempo:   '90 minutos',
    },
    {
      titulo: 'Sistema de Filas com Prioridade',
      enunciado: 'Implemente um sistema de filas com prioridade e N workers concorrentes que processam tarefas em paralelo com controle de erros e retry.',
      entrada: 'fila.enqueue({ tarefa: "enviar email", prioridade: 1 })',
      saida:   'Tarefa processada pelo worker #2 (tentativa 1/3)',
      tempo:   '90 minutos',
    },
    {
      titulo: 'Gerador de Relatórios',
      enunciado: 'Crie um gerador que leia dados de um JSON e produza um relatório textual formatado com tabelas, totais e percentuais.',
      entrada: 'gerar(dadosVendas)',
      saida:   'Relatório com tabela de produtos, total e % de cada categoria',
      tempo:   '80 minutos',
    },
    {
      titulo: 'Algoritmo de Dijkstra',
      enunciado: 'Implemente Dijkstra para encontrar o menor caminho entre dois nós em um grafo ponderado representado por lista de adjacência.',
      entrada: 'dijkstra(grafo, "A", "D")',
      saida:   '{ distancia: 5, caminho: ["A", "B", "D"] }',
      tempo:   '90 minutos',
    },
    {
      titulo: 'Micro-ORM',
      enunciado: 'Construa um micro-ORM que mapeie classes para tabelas de um banco SQLite, suportando operações básicas de CRUD sem SQL explícito.',
      entrada: 'orm.save(new Usuario({ nome: "Ana", email: "ana@dio.me" }))',
      saida:   'INSERT INTO usuarios (nome, email) VALUES ("Ana", "ana@dio.me") — retorna objeto com id',
      tempo:   '90 minutos',
    },
  ],
};

const XP_POR_NIVEL = {
  iniciante:     500,
  intermediario: 1500,
  avancado:      3000,
};

const EMOJI_NIVEL = {
  iniciante:     '🟢',
  intermediario: '🟡',
  avancado:      '🔴',
};

/**
 * Normaliza o nível informado pelo usuário.
 * @param {string} [nivel]
 * @returns {'iniciante'|'intermediario'|'avancado'}
 */
function normalizarNivel(nivel) {
  if (!nivel) return 'intermediario';
  const n = nivel.toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // remove acentos
  if (n === 'iniciante')     return 'iniciante';
  if (n === 'avancado')      return 'avancado';
  return 'intermediario';
}

/**
 * Seleciona um desafio aleatório do banco para o nível dado.
 * Aceita um seed numérico para tornar o resultado determinístico nos testes.
 * @param {'iniciante'|'intermediario'|'avancado'} nivel
 * @param {number} [seedIndex] - índice fixo (0-based) para testes
 * @returns {object}
 */
function sortearDesafio(nivel, seedIndex) {
  const banco = BANCO[nivel] || BANCO.intermediario;
  const idx   = seedIndex !== undefined
    ? seedIndex % banco.length
    : Math.floor(Math.random() * banco.length);
  return banco[idx];
}

/**
 * Formata a saída do desafio.
 * @param {string} tecnologia
 * @param {string} nivel - nível normalizado
 * @param {object} desafio
 * @param {number} seed
 * @returns {string}
 */
function formatarDesafio(tecnologia, nivel, desafio, seed) {
  const xp    = XP_POR_NIVEL[nivel];
  const emoji = EMOJI_NIVEL[nivel];
  const nivelLabel = nivel.charAt(0).toUpperCase() + nivel.slice(1);

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
    '✅ REQUISITOS OBRIGATÓRIOS',
    '──────────────────────────────────────────────────────────',
    '',
    '  [ ] Req 1: A solução deve tratar entradas inválidas',
    '  [ ] Req 2: Implementar ao menos um caso de teste',
    `  [ ] Req 3: O código deve seguir as boas práticas de ${tecnologia}`,
    '  [ ] Req 4: Complexidade de tempo deve ser documentada (Big O)',
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
    '🏆 CRITÉRIOS DE AVALIAÇÃO',
    '──────────────────────────────────────────────────────────',
    '',
    '  ⭐⭐⭐⭐⭐  Solução otimizada + testes + documentação',
    '  ⭐⭐⭐⭐    Solução funcional + testes',
    '  ⭐⭐⭐      Solução funcional sem testes',
    '  ⭐⭐        Solução parcialmente funcional',
    '  ⭐          Tentativa com erros',
    '',
    '──────────────────────────────────────────────────────────',
    `⏱️  Tempo estimado: ${desafio.tempo}`,
    '💡 Dica: Ao concluir, use /certificado <seu_nome> <trilha> para gerar seu certificado!',
    '──────────────────────────────────────────────────────────',
  ].join('\n');
}

/**
 * Mensagem de erro quando a tecnologia não é reconhecida.
 * @param {string} tecnologia
 * @returns {string}
 */
function erroTecnologiaNaoReconhecida(tecnologia) {
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

const TECNOLOGIAS_VALIDAS = new Set([
  'python','javascript','java','go','rust','c#','typescript','react',
  'angular','vue.js','flutter','kotlin','devops','aws','gcp','docker',
  'kubernetes','machine learning','ia generativa','mlops','cybersecurity',
  'blockchain','databases','apache spark','power bi','sre','design','figma',
  'linux','unity','c#/.net','c# / .net','sre / observabilidade',
  'n8n / low-code','quantum computing','arquitetura de software',
]);

/**
 * Verifica se a tecnologia é válida (busca parcial).
 * @param {string} tecnologia
 * @returns {boolean}
 */
function tecnologiaValida(tecnologia) {
  if (!tecnologia || tecnologia.trim() === '') return false;
  const t = tecnologia.toLowerCase().trim();
  for (const v of TECNOLOGIAS_VALIDAS) {
    if (v.includes(t) || t.includes(v)) return true;
  }
  return false;
}

/**
 * Ponto de entrada principal do comando /desafio.
 * @param {string} tecnologia
 * @param {string} [nivel]
 * @param {number} [seedIndex] - índice fixo para testes
 * @returns {string}
 */
function executarDesafio(tecnologia, nivel, seedIndex) {
  if (!tecnologiaValida(tecnologia)) {
    return erroTecnologiaNaoReconhecida(tecnologia || '');
  }
  const nivelNorm = normalizarNivel(nivel);
  const desafio   = sortearDesafio(nivelNorm, seedIndex);
  const seed      = seedIndex !== undefined ? seedIndex + 1001 : Math.floor(Math.random() * 9000) + 1000;
  return formatarDesafio(tecnologia, nivelNorm, desafio, seed);
}

module.exports = {
  BANCO,
  XP_POR_NIVEL,
  normalizarNivel,
  sortearDesafio,
  formatarDesafio,
  erroTecnologiaNaoReconhecida,
  tecnologiaValida,
  executarDesafio,
};
