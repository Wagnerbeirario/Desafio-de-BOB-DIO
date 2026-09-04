'use strict';

const {
  BANCO,
  XP_POR_NIVEL,
  normalizarNivel,
  sortearDesafio,
  formatarDesafio,
  erroTecnologiaNaoReconhecida,
  tecnologiaValida,
  executarDesafio,
} = require('../desafio');

// ─── normalizarNivel ───────────────────────────────────────────────────────
describe('normalizarNivel()', () => {
  test('retorna intermediario como padrão quando undefined', () => {
    expect(normalizarNivel(undefined)).toBe('intermediario');
  });

  test('retorna intermediario como padrão quando string vazia', () => {
    expect(normalizarNivel('')).toBe('intermediario');
  });

  test('reconhece iniciante', () => {
    expect(normalizarNivel('iniciante')).toBe('iniciante');
  });

  test('reconhece avancado sem acento', () => {
    expect(normalizarNivel('avancado')).toBe('avancado');
  });

  test('reconhece avançado com acento', () => {
    expect(normalizarNivel('avançado')).toBe('avancado');
  });

  test('case-insensitive para INICIANTE', () => {
    expect(normalizarNivel('INICIANTE')).toBe('iniciante');
  });

  test('fallback para intermediario em valor desconhecido', () => {
    expect(normalizarNivel('expert')).toBe('intermediario');
  });
});

// ─── sortearDesafio ────────────────────────────────────────────────────────
describe('sortearDesafio()', () => {
  test('retorna um objeto com titulo e enunciado — iniciante', () => {
    const d = sortearDesafio('iniciante', 0);
    expect(d).toHaveProperty('titulo');
    expect(d).toHaveProperty('enunciado');
  });

  test('seedIndex 0 → primeiro desafio do nível', () => {
    const d = sortearDesafio('iniciante', 0);
    expect(d.titulo).toBe(BANCO.iniciante[0].titulo);
  });

  test('seedIndex 1 → segundo desafio', () => {
    const d = sortearDesafio('iniciante', 1);
    expect(d.titulo).toBe(BANCO.iniciante[1].titulo);
  });

  test('seedIndex com wrap-around (módulo do tamanho do banco)', () => {
    const tamanho = BANCO.iniciante.length;
    const d       = sortearDesafio('iniciante', tamanho);   // deve voltar ao índice 0
    expect(d.titulo).toBe(BANCO.iniciante[0].titulo);
  });

  test('funciona para nível intermediario', () => {
    const d = sortearDesafio('intermediario', 0);
    expect(d.titulo).toBe(BANCO.intermediario[0].titulo);
  });

  test('funciona para nível avancado', () => {
    const d = sortearDesafio('avancado', 0);
    expect(d.titulo).toBe(BANCO.avancado[0].titulo);
  });

  test('fallback para intermediario em nível inválido', () => {
    const d = sortearDesafio('inexistente', 0);
    expect(d.titulo).toBe(BANCO.intermediario[0].titulo);
  });

  test('sorteia sem seed sem lançar erro', () => {
    expect(() => sortearDesafio('iniciante')).not.toThrow();
  });
});

// ─── tecnologiaValida ──────────────────────────────────────────────────────
describe('tecnologiaValida()', () => {
  test('aceita Java', ()      => expect(tecnologiaValida('Java')).toBe(true));
  test('aceita java lowercase', () => expect(tecnologiaValida('java')).toBe(true));
  test('aceita Python', ()    => expect(tecnologiaValida('Python')).toBe(true));
  test('aceita JavaScript', ()=> expect(tecnologiaValida('JavaScript')).toBe(true));
  test('aceita DevOps', ()    => expect(tecnologiaValida('DevOps')).toBe(true));
  test('aceita AWS', ()       => expect(tecnologiaValida('AWS')).toBe(true));
  test('rejeita string vazia',() => expect(tecnologiaValida('')).toBe(false));
  test('rejeita null/undefined', () => expect(tecnologiaValida(null)).toBe(false));
  test('rejeita COBOL',       () => expect(tecnologiaValida('COBOL')).toBe(false));
  test('rejeita Fortran',     () => expect(tecnologiaValida('Fortran')).toBe(false));
});

// ─── formatarDesafio ───────────────────────────────────────────────────────
describe('formatarDesafio()', () => {
  const desafioJava = BANCO.intermediario[0]; // API de Tarefas (CRUD)

  test('contém o título do desafio', () => {
    const out = formatarDesafio('Java', 'intermediario', desafioJava, 1234);
    expect(out).toContain('API de Tarefas (CRUD)');
  });

  test('contém a tecnologia', () => {
    const out = formatarDesafio('Java', 'intermediario', desafioJava, 1234);
    expect(out).toContain('Java');
  });

  test('contém o XP correto para intermediario', () => {
    const out = formatarDesafio('Java', 'intermediario', desafioJava, 1234);
    expect(out).toContain('1500');
  });

  test('contém o XP correto para iniciante', () => {
    const d = BANCO.iniciante[0];
    const out = formatarDesafio('Java', 'iniciante', d, 1111);
    expect(out).toContain('500');
  });

  test('contém o XP correto para avancado', () => {
    const d = BANCO.avancado[0];
    const out = formatarDesafio('Java', 'avancado', d, 9999);
    expect(out).toContain('3000');
  });

  test('contém o seed do desafio', () => {
    const out = formatarDesafio('Java', 'intermediario', desafioJava, 1234);
    expect(out).toContain('#1234');
  });

  test('contém o enunciado', () => {
    const out = formatarDesafio('Java', 'intermediario', desafioJava, 1234);
    expect(out).toContain('API REST');
  });

  test('contém o exemplo de entrada', () => {
    const out = formatarDesafio('Java', 'intermediario', desafioJava, 1234);
    expect(out).toContain('/tarefas');
  });

  test('contém os critérios de avaliação', () => {
    const out = formatarDesafio('Java', 'intermediario', desafioJava, 1234);
    expect(out).toContain('CRITÉRIOS DE AVALIAÇÃO');
  });

  test('contém dica para /certificado', () => {
    const out = formatarDesafio('Java', 'intermediario', desafioJava, 1234);
    expect(out).toContain('/certificado');
  });

  test('contém emoji do nível intermediario', () => {
    const out = formatarDesafio('Java', 'intermediario', desafioJava, 1234);
    expect(out).toContain('🟡');
  });

  test('contém emoji do nível avancado', () => {
    const d = BANCO.avancado[0];
    const out = formatarDesafio('Java', 'avancado', d, 1);
    expect(out).toContain('🔴');
  });

  test('contém emoji do nível iniciante', () => {
    const d = BANCO.iniciante[0];
    const out = formatarDesafio('Java', 'iniciante', d, 1);
    expect(out).toContain('🟢');
  });
});

// ─── erroTecnologiaNaoReconhecida ──────────────────────────────────────────
describe('erroTecnologiaNaoReconhecida()', () => {
  test('contém o nome da tecnologia inválida', () => {
    expect(erroTecnologiaNaoReconhecida('COBOL')).toContain('COBOL');
  });

  test('contém ícone de erro', () => {
    expect(erroTecnologiaNaoReconhecida('COBOL')).toContain('❌');
  });

  test('lista Java como sugestão', () => {
    expect(erroTecnologiaNaoReconhecida('x')).toContain('Java');
  });

  test('contém exemplo de uso', () => {
    expect(erroTecnologiaNaoReconhecida('x')).toContain('/desafio Java avancado');
  });
});

// ─── executarDesafio ───────────────────────────────────────────────────────
describe('executarDesafio()', () => {
  test('retorna desafio formatado para Java intermediario', () => {
    const out = executarDesafio('Java', 'intermediario', 0);
    expect(out).toContain('DESAFIO DE CÓDIGO');
    expect(out).toContain('Java');
  });

  test('retorna desafio para Java avancado', () => {
    const out = executarDesafio('Java', 'avancado', 0);
    expect(out).toContain('🔴');
    expect(out).toContain('3000');
  });

  test('retorna desafio para Java iniciante', () => {
    const out = executarDesafio('Java', 'iniciante', 0);
    expect(out).toContain('🟢');
    expect(out).toContain('500');
  });

  test('usa intermediario quando nivel não é passado', () => {
    const out = executarDesafio('Java', undefined, 0);
    expect(out).toContain('🟡');
  });

  test('retorna erro para tecnologia vazia', () => {
    const out = executarDesafio('');
    expect(out).toContain('❌');
  });

  test('retorna erro para tecnologia inexistente', () => {
    const out = executarDesafio('COBOL');
    expect(out).toContain('❌');
    expect(out).toContain('COBOL');
  });

  test('banco iniciante possui 7 desafios', () => {
    expect(BANCO.iniciante).toHaveLength(7);
  });

  test('banco intermediario possui 7 desafios', () => {
    expect(BANCO.intermediario).toHaveLength(7);
  });

  test('banco avancado possui 7 desafios', () => {
    expect(BANCO.avancado).toHaveLength(7);
  });

  test('XP por nível estão corretos', () => {
    expect(XP_POR_NIVEL.iniciante).toBe(500);
    expect(XP_POR_NIVEL.intermediario).toBe(1500);
    expect(XP_POR_NIVEL.avancado).toBe(3000);
  });
});
