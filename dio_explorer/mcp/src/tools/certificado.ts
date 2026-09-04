import { buscarTrilha } from './trilha.js';

function gerarCodigoVerificacao(tecnologia: string): string {
  const ano = new Date().getFullYear();
  const mes = String(new Date().getMonth() + 1).padStart(2, '0');
  const sigla = tecnologia.replace(/[^a-zA-Z]/g, '').substring(0, 2).toUpperCase();
  const hex = Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, '0');
  return `${sigla}${ano}${mes}${hex}`;
}

function formatarDataEmissao(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

export function executarCertificado(nomeUsuario: string, trilhaBuscada: string): string {
  if (!nomeUsuario.trim()) {
    return '❌ Informe seu nome. Ex: /certificado "João Silva" Python';
  }
  if (!trilhaBuscada.trim()) {
    return '❌ Informe a trilha. Ex: /certificado "João Silva" Python';
  }

  const trilha = buscarTrilha(trilhaBuscada);
  if (!trilha) {
    return [
      `❌ Trilha não encontrada para: "${trilhaBuscada}"`,
      '',
      '📋 Verifique o nome da trilha em: dio_explorer/data/trilhas_dio.json',
      '💡 Exemplo: /certificado "Seu Nome" Python',
      '            /certificado "Seu Nome" React',
      '            /certificado "Seu Nome" "Machine Learning"',
    ].join('\n');
  }

  const dataEmissao = formatarDataEmissao();
  const cargaHoraria = trilha.numero_de_modulos * 8;
  const codigo = gerarCodigoVerificacao(trilha.tecnologia);
  const vitalicioText = trilha.vitalicio ? 'Sim' : 'Não';
  const badges = trilha.badges_disponiveis;
  const b0 = badges[0] ?? '—';
  const b1 = badges[1] ?? '—';
  const b2 = badges[2] ?? '—';

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
    '_Certificado gerado pelo DIO Explorer MCP · Documento fictício para fins educacionais_',
    '',
    '</div>',
    '',
    '---',
  ].join('\n');
}
