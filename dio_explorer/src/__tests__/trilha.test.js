'use strict';

const {
  buscarTrilha,
  formatarPlanoEstudos,
  erroTrilhaNaoEncontrada,
  executarTrilha,
  carregarTrilhas,
} = require('../trilha');

// ─── Fixture: trilha Java (id=6 no JSON real) ─────────────────────────────
const TRILHA_JAVA = {
  id: 6,
  nome: 'Formação Java Spring Boot Profissional',
  tecnologia: 'Java',
  nivel: 'Intermediário ao Avançado',
  numero_de_modulos: 13,
  xp_total: 19000,
  badges_disponiveis: ['Java Rookie', 'Spring Developer', 'Java Architect'],
  promocoes: { desconto: '20%', validade: '2025-10-31' },
  vitalicio: true,
  lives_ao_vivo: [
    { titulo: 'API REST com Spring Boot', data: '2025-08-28', horario: '19:00' },
    { titulo: 'Segurança com Spring Security', data: '2025-09-20', horario: '18:00' },
  ],
};

const TRILHA_SEM_VITALICIO = { ...TRILHA_JAVA, vitalicio: false };
const TRILHA_SEM_PROMOCAO  = { ...TRILHA_JAVA, promocoes: { desconto: '0%', validade: null } };
const TRILHA_SEM_LIVES     = { ...TRILHA_JAVA, lives_ao_vivo: [] };

// Lista mínima para testes sem I/O
const LISTA_FIXTURE = [TRILHA_JAVA];

// ─── buscarTrilha ──────────────────────────────────────────────────────────
describe('buscarTrilha()', () => {
  test('retorna null para tecnologia vazia', () => {
    expect(buscarTrilha('', LISTA_FIXTURE)).toBeNull();
  });

  test('retorna null para tecnologia apenas espaços', () => {
    expect(buscarTrilha('   ', LISTA_FIXTURE)).toBeNull();
  });

  test('encontra trilha por tecnologia exata', () => {
    const t = buscarTrilha('Java', LISTA_FIXTURE);
    expect(t).not.toBeNull();
    expect(t.tecnologia).toBe('Java');
  });

  test('encontra trilha por tecnologia case-insensitive', () => {
    const t = buscarTrilha('java', LISTA_FIXTURE);
    expect(t).not.toBeNull();
  });

  test('encontra trilha por tecnologia parcial', () => {
    const t = buscarTrilha('Jav', LISTA_FIXTURE);
    expect(t).not.toBeNull();
  });

  test('encontra trilha pelo campo nome como fallback', () => {
    const t = buscarTrilha('Spring Boot', LISTA_FIXTURE);
    expect(t).not.toBeNull();
    expect(t.nome).toContain('Spring Boot');
  });

  test('retorna null quando tecnologia não existe', () => {
    const t = buscarTrilha('COBOL', LISTA_FIXTURE);
    expect(t).toBeNull();
  });

  test('lê do arquivo real quando nenhuma lista é passada', () => {
    const t = buscarTrilha('Java');
    expect(t).not.toBeNull();
    expect(t.tecnologia).toBe('Java');
  });
});

// ─── formatarPlanoEstudos ──────────────────────────────────────────────────
describe('formatarPlanoEstudos()', () => {
  test('contém o nome da trilha', () => {
    const output = formatarPlanoEstudos(TRILHA_JAVA);
    expect(output).toContain('Formação Java Spring Boot Profissional');
  });

  test('contém a tecnologia no output', () => {
    const output = formatarPlanoEstudos(TRILHA_JAVA);
    expect(output).toContain('Java');
  });

  test('contém o nível', () => {
    const output = formatarPlanoEstudos(TRILHA_JAVA);
    expect(output).toContain('Intermediário ao Avançado');
  });

  test('contém o XP total', () => {
    const output = formatarPlanoEstudos(TRILHA_JAVA);
    expect(output).toContain('19000');
  });

  test('exibe "Sim" quando vitalicio=true', () => {
    expect(formatarPlanoEstudos(TRILHA_JAVA)).toContain('Vitalício: Sim');
  });

  test('exibe "Não" quando vitalicio=false', () => {
    expect(formatarPlanoEstudos(TRILHA_SEM_VITALICIO)).toContain('Vitalício: Não');
  });

  test('contém as 3 badges', () => {
    const output = formatarPlanoEstudos(TRILHA_JAVA);
    expect(output).toContain('Java Rookie');
    expect(output).toContain('Spring Developer');
    expect(output).toContain('Java Architect');
  });

  test('contém o desconto da promoção', () => {
    expect(formatarPlanoEstudos(TRILHA_JAVA)).toContain('20%');
  });

  test('exibe "Sem prazo" quando validade é null', () => {
    expect(formatarPlanoEstudos(TRILHA_SEM_PROMOCAO)).toContain('Sem prazo');
  });

  test('contém o número total de módulos', () => {
    expect(formatarPlanoEstudos(TRILHA_JAVA)).toContain('13');
  });

  test('contém live 1', () => {
    expect(formatarPlanoEstudos(TRILHA_JAVA)).toContain('API REST com Spring Boot');
  });

  test('contém live 2', () => {
    expect(formatarPlanoEstudos(TRILHA_JAVA)).toContain('Segurança com Spring Security');
  });

  test('não quebra quando lives_ao_vivo está vazio', () => {
    expect(() => formatarPlanoEstudos(TRILHA_SEM_LIVES)).not.toThrow();
  });

  test('contém dica para /desafio', () => {
    expect(formatarPlanoEstudos(TRILHA_JAVA)).toContain('/desafio Java');
  });

  test('contém dica para /certificado', () => {
    expect(formatarPlanoEstudos(TRILHA_JAVA)).toContain('/certificado');
  });
});

// ─── erroTrilhaNaoEncontrada ───────────────────────────────────────────────
describe('erroTrilhaNaoEncontrada()', () => {
  test('contém o nome da tecnologia na mensagem', () => {
    expect(erroTrilhaNaoEncontrada('COBOL')).toContain('COBOL');
  });

  test('contém o ícone de erro', () => {
    expect(erroTrilhaNaoEncontrada('COBOL')).toContain('❌');
  });

  test('lista Python como sugestão', () => {
    expect(erroTrilhaNaoEncontrada('x')).toContain('Python');
  });

  test('lista Java como sugestão', () => {
    expect(erroTrilhaNaoEncontrada('x')).toContain('Java');
  });
});

// ─── executarTrilha ────────────────────────────────────────────────────────
describe('executarTrilha()', () => {
  test('retorna plano formatado para Java', () => {
    const output = executarTrilha('Java', LISTA_FIXTURE);
    expect(output).toContain('PLANO DE ESTUDOS');
    expect(output).toContain('Java');
  });

  test('retorna erro para tecnologia desconhecida', () => {
    const output = executarTrilha('COBOL', LISTA_FIXTURE);
    expect(output).toContain('❌');
    expect(output).toContain('COBOL');
  });

  test('retorna erro para string vazia', () => {
    const output = executarTrilha('', LISTA_FIXTURE);
    expect(output).toContain('❌');
  });

  test('busca funciona com tecnologia em minúsculas', () => {
    const output = executarTrilha('java', LISTA_FIXTURE);
    expect(output).toContain('PLANO DE ESTUDOS');
  });

  test('fluxo completo com arquivo JSON real — Java', () => {
    const output = executarTrilha('Java');
    expect(output).toContain('Formação Java Spring Boot Profissional');
    expect(output).toContain('19000');
    expect(output).toContain('Java Rookie');
  });
});

// ─── carregarTrilhas ───────────────────────────────────────────────────────
describe('carregarTrilhas()', () => {
  test('retorna objeto com propriedade trilhas', () => {
    const data = carregarTrilhas();
    expect(data).toHaveProperty('trilhas');
    expect(Array.isArray(data.trilhas)).toBe(true);
  });

  test('contém ao menos 10 trilhas', () => {
    const data = carregarTrilhas();
    expect(data.trilhas.length).toBeGreaterThanOrEqual(10);
  });

  test('trilha Java está presente no JSON', () => {
    const data = carregarTrilhas();
    const java = data.trilhas.find(t => t.tecnologia === 'Java');
    expect(java).toBeDefined();
    expect(java.nome).toContain('Java');
  });

  test('lança erro para arquivo inexistente', () => {
    expect(() => carregarTrilhas('/nao/existe.json')).toThrow();
  });
});
