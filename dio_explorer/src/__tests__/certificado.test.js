'use strict';

const {
  buscarTrilha,
  gerarCodigoVerificacao,
  formatarDataEmissao,
  calcularCargaHoraria,
  gerarCertificado,
  erroCertificadoTrilhaNaoEncontrada,
  executarCertificado,
  carregarTrilhas,
} = require('../certificado');

// ─── Fixtures ─────────────────────────────────────────────────────────────
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
const LISTA_FIXTURE = [TRILHA_JAVA];

const OPTS_FIXOS = {
  dataOverride: '2025-07-01',
  hexOverride:  'ABCD',
};

// ─── calcularCargaHoraria ──────────────────────────────────────────────────
describe('calcularCargaHoraria()', () => {
  test('13 módulos × 8 = 104h', () => {
    expect(calcularCargaHoraria(13)).toBe(104);
  });

  test('0 módulos = 0h', () => {
    expect(calcularCargaHoraria(0)).toBe(0);
  });

  test('1 módulo = 8h', () => {
    expect(calcularCargaHoraria(1)).toBe(8);
  });

  test('resultado correto para 12 módulos', () => {
    expect(calcularCargaHoraria(12)).toBe(96);
  });
});

// ─── formatarDataEmissao ───────────────────────────────────────────────────
describe('formatarDataEmissao()', () => {
  test('retorna no formato DD/MM/AAAA', () => {
    const data = formatarDataEmissao('2025-07-15');
    expect(data).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });

  test('data override 2025-07-01 → 01/07/2025', () => {
    expect(formatarDataEmissao('2025-07-01')).toBe('01/07/2025');
  });

  test('data override 2025-12-25 → 25/12/2025', () => {
    expect(formatarDataEmissao('2025-12-25')).toBe('25/12/2025');
  });

  test('sem override não lança erro', () => {
    expect(() => formatarDataEmissao()).not.toThrow();
  });
});

// ─── gerarCodigoVerificacao ────────────────────────────────────────────────
describe('gerarCodigoVerificacao()', () => {
  test('inicia com sigla da tecnologia em uppercase', () => {
    const cod = gerarCodigoVerificacao('Java', '2025-07-01', 'ABCD');
    expect(cod.startsWith('JA')).toBe(true);
  });

  test('contém o ano quando fornecido', () => {
    const cod = gerarCodigoVerificacao('Java', '2025-07-01', 'ABCD');
    expect(cod).toContain('2025');
  });

  test('contém o mês formatado', () => {
    const cod = gerarCodigoVerificacao('Java', '2025-07-01', 'ABCD');
    expect(cod).toContain('07');
  });

  test('termina com os 4 hex override', () => {
    const cod = gerarCodigoVerificacao('Java', '2025-07-01', 'ABCD');
    expect(cod.endsWith('ABCD')).toBe(true);
  });

  test('código completo com valores fixos é determinístico', () => {
    const cod1 = gerarCodigoVerificacao('Java', '2025-07-01', 'ABCD');
    const cod2 = gerarCodigoVerificacao('Java', '2025-07-01', 'ABCD');
    expect(cod1).toBe(cod2);
  });

  test('sem override hex não lança erro', () => {
    expect(() => gerarCodigoVerificacao('Python', '2025-01-01')).not.toThrow();
  });

  test('lida com tecnologias com caracteres especiais', () => {
    expect(() => gerarCodigoVerificacao('C# / .NET', '2025-01-01', '1234')).not.toThrow();
  });
});

// ─── buscarTrilha (certificado) ────────────────────────────────────────────
describe('buscarTrilha() [certificado]', () => {
  test('encontra Java por tecnologia', () => {
    expect(buscarTrilha('Java', LISTA_FIXTURE)).not.toBeNull();
  });

  test('encontra Java case-insensitive', () => {
    expect(buscarTrilha('java', LISTA_FIXTURE)).not.toBeNull();
  });

  test('encontra por nome parcial da trilha', () => {
    expect(buscarTrilha('Spring Boot', LISTA_FIXTURE)).not.toBeNull();
  });

  test('retorna null para trilha inexistente', () => {
    expect(buscarTrilha('COBOL', LISTA_FIXTURE)).toBeNull();
  });

  test('retorna null para string vazia', () => {
    expect(buscarTrilha('', LISTA_FIXTURE)).toBeNull();
  });
});

// ─── gerarCertificado ──────────────────────────────────────────────────────
describe('gerarCertificado()', () => {
  test('contém o nome do usuário em uppercase', () => {
    const out = gerarCertificado('João Silva', TRILHA_JAVA, OPTS_FIXOS);
    expect(out).toContain('JOÃO SILVA');
  });

  test('contém o nome da trilha', () => {
    const out = gerarCertificado('Ana', TRILHA_JAVA, OPTS_FIXOS);
    expect(out).toContain('Formação Java Spring Boot Profissional');
  });

  test('contém a tecnologia', () => {
    const out = gerarCertificado('Ana', TRILHA_JAVA, OPTS_FIXOS);
    expect(out).toContain('Java');
  });

  test('contém o nível', () => {
    const out = gerarCertificado('Ana', TRILHA_JAVA, OPTS_FIXOS);
    expect(out).toContain('Intermediário ao Avançado');
  });

  test('contém carga horária correta (13*8=104h)', () => {
    const out = gerarCertificado('Ana', TRILHA_JAVA, OPTS_FIXOS);
    expect(out).toContain('104h');
  });

  test('contém o XP total', () => {
    const out = gerarCertificado('Ana', TRILHA_JAVA, OPTS_FIXOS);
    expect(out).toContain('19000');
  });

  test('contém badge 1', () => {
    const out = gerarCertificado('Ana', TRILHA_JAVA, OPTS_FIXOS);
    expect(out).toContain('Java Rookie');
  });

  test('contém badge 2', () => {
    const out = gerarCertificado('Ana', TRILHA_JAVA, OPTS_FIXOS);
    expect(out).toContain('Spring Developer');
  });

  test('contém badge 3', () => {
    const out = gerarCertificado('Ana', TRILHA_JAVA, OPTS_FIXOS);
    expect(out).toContain('Java Architect');
  });

  test('contém a data de emissão formatada', () => {
    const out = gerarCertificado('Ana', TRILHA_JAVA, OPTS_FIXOS);
    expect(out).toContain('01/07/2025');
  });

  test('contém o código de verificação DIO-', () => {
    const out = gerarCertificado('Ana', TRILHA_JAVA, OPTS_FIXOS);
    expect(out).toContain('DIO-');
  });

  test('código de verificação é determinístico com opções fixas', () => {
    const out1 = gerarCertificado('Ana', TRILHA_JAVA, OPTS_FIXOS);
    const out2 = gerarCertificado('Ana', TRILHA_JAVA, OPTS_FIXOS);
    expect(out1).toBe(out2);
  });

  test('exibe Sim quando vitalicio=true', () => {
    const out = gerarCertificado('Ana', TRILHA_JAVA, OPTS_FIXOS);
    expect(out).toContain('| Sim |');
  });

  test('exibe Não quando vitalicio=false', () => {
    const out = gerarCertificado('Ana', TRILHA_SEM_VITALICIO, OPTS_FIXOS);
    expect(out).toContain('| Não |');
  });

  test('contém link de verificação', () => {
    const out = gerarCertificado('Ana', TRILHA_JAVA, OPTS_FIXOS);
    expect(out).toContain('https://www.dio.me/certificate/');
  });

  test('contém citação de Nelson Mandela', () => {
    const out = gerarCertificado('Ana', TRILHA_JAVA, OPTS_FIXOS);
    expect(out).toContain('Nelson Mandela');
  });

  test('contém assinatura de Roberto Melo', () => {
    const out = gerarCertificado('Ana', TRILHA_JAVA, OPTS_FIXOS);
    expect(out).toContain('Roberto Melo');
  });

  test('contém div align center', () => {
    const out = gerarCertificado('Ana', TRILHA_JAVA, OPTS_FIXOS);
    expect(out).toContain('<div align="center">');
  });
});

// ─── erroCertificadoTrilhaNaoEncontrada ────────────────────────────────────
describe('erroCertificadoTrilhaNaoEncontrada()', () => {
  test('contém o nome da trilha inválida', () => {
    expect(erroCertificadoTrilhaNaoEncontrada('COBOL')).toContain('COBOL');
  });

  test('contém ícone de erro', () => {
    expect(erroCertificadoTrilhaNaoEncontrada('COBOL')).toContain('❌');
  });

  test('fornece exemplo de uso', () => {
    expect(erroCertificadoTrilhaNaoEncontrada('X')).toContain('/certificado');
  });
});

// ─── executarCertificado ───────────────────────────────────────────────────
describe('executarCertificado()', () => {
  test('gera certificado para João com Java', () => {
    const out = executarCertificado('João Silva', 'Java', LISTA_FIXTURE, OPTS_FIXOS);
    expect(out).toContain('JOÃO SILVA');
    expect(out).toContain('Java');
    expect(out).toContain('DIO-');
  });

  test('retorna erro quando nome está vazio', () => {
    const out = executarCertificado('', 'Java', LISTA_FIXTURE);
    expect(out).toContain('❌');
  });

  test('retorna erro quando nome é só espaços', () => {
    const out = executarCertificado('   ', 'Java', LISTA_FIXTURE);
    expect(out).toContain('❌');
  });

  test('retorna erro quando trilha está vazia', () => {
    const out = executarCertificado('Ana', '', LISTA_FIXTURE);
    expect(out).toContain('❌');
  });

  test('retorna erro quando trilha não é encontrada', () => {
    const out = executarCertificado('Ana', 'COBOL', LISTA_FIXTURE);
    expect(out).toContain('❌');
    expect(out).toContain('COBOL');
  });

  test('fluxo completo com arquivo JSON real — Java', () => {
    const out = executarCertificado('Carlos Santos', 'Java', null, OPTS_FIXOS);
    expect(out).toContain('CARLOS SANTOS');
    expect(out).toContain('Formação Java Spring Boot Profissional');
    expect(out).toContain('104h');
  });

  test('carga horária Java (13 módulos) é 104h no certificado real', () => {
    const out = executarCertificado('Maria', 'Java', null, OPTS_FIXOS);
    expect(out).toContain('104h');
  });
});

// ─── carregarTrilhas (certificado) ────────────────────────────────────────
describe('carregarTrilhas() [certificado]', () => {
  test('retorna objeto com campo trilhas', () => {
    const data = carregarTrilhas();
    expect(data).toHaveProperty('trilhas');
  });

  test('Java está na lista', () => {
    const { trilhas } = carregarTrilhas();
    const java = trilhas.find(t => t.tecnologia === 'Java');
    expect(java).toBeDefined();
  });

  test('lança erro para arquivo inexistente', () => {
    expect(() => carregarTrilhas('/nao/existe.json')).toThrow();
  });
});
