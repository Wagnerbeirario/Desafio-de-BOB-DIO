---
name: trilha
description: Recebe o nome de uma tecnologia e retorna um plano de estudos formatado com os módulos da trilha correspondente, consultando o arquivo data/trilhas_dio.json.
arguments:
  - name: tecnologia
    description: Nome da tecnologia ou trilha desejada (ex: Python, React, DevOps)
    required: true
---

# Slash Command: /trilha

## Descrição
Consulta o arquivo `data/trilhas_dio.json` e retorna um **plano de estudos detalhado e formatado** para a trilha que corresponde à tecnologia informada pelo usuário.

---

## Como usar
```
/trilha <tecnologia>
```

**Exemplos:**
```
/trilha Python
/trilha React
/trilha DevOps
```

---

## Comportamento

Ao receber o argumento `<tecnologia>`, o comando deve:

1. **Buscar** no arquivo `data/trilhas_dio.json` a trilha cuja chave `tecnologia` contém o valor informado (busca case-insensitive e parcial).
2. **Se encontrar**, exibir o plano de estudos formatado conforme o template abaixo.
3. **Se não encontrar**, retornar uma mensagem de erro amigável sugerindo tecnologias disponíveis.

---

## Template de saída (quando encontrado)

```
╔══════════════════════════════════════════════════════════╗
║           🎓 PLANO DE ESTUDOS — DIO EXPLORER             ║
╚══════════════════════════════════════════════════════════╝

📚 Trilha: {nome}
🛠️  Tecnologia: {tecnologia}
📊 Nível: {nivel}
🧩 Total de Módulos: {numero_de_modulos}
⭐ XP Total ao Concluir: {xp_total} XP
♾️  Acesso Vitalício: {vitalicio}

──────────────────────────────────────────────────────────
🗺️  MÓDULOS DO PLANO DE ESTUDOS
──────────────────────────────────────────────────────────

  Módulo 01 — Introdução e Fundamentos de {tecnologia}
  Módulo 02 — Configuração do Ambiente e Ferramentas
  Módulo 03 — Conceitos Core: Sintaxe e Estruturas
  Módulo 04 — Trabalhando com Funções e Módulos
  Módulo 05 — Orientação a Objetos / Paradigmas
  Módulo 06 — Manipulação de Dados e Arquivos
  Módulo 07 — Integrações e APIs
  Módulo 08 — Testes e Qualidade de Código
  Módulo 09 — Boas Práticas e Design Patterns
  Módulo 10 — Projeto Prático Intermediário
  Módulo 11 — Tópicos Avançados de {tecnologia}
  Módulo 12 — Projeto Final e Deploy
  ... (até o total de {numero_de_modulos} módulos)

──────────────────────────────────────────────────────────
🏅 BADGES DISPONÍVEIS
──────────────────────────────────────────────────────────

  {badges_disponiveis[0]}  →  Conquistada ao finalizar o Módulo 04
  {badges_disponiveis[1]}  →  Conquistada ao finalizar o Módulo 08
  {badges_disponiveis[2]}  →  Conquistada ao concluir a trilha completa

──────────────────────────────────────────────────────────
💰 PROMOÇÃO ATIVA
──────────────────────────────────────────────────────────

  🔖 Desconto: {promocoes.desconto}
  📅 Válido até: {promocoes.validade}

──────────────────────────────────────────────────────────
🎙️  LIVES AO VIVO PROGRAMADAS
──────────────────────────────────────────────────────────

  {lives_ao_vivo[0].titulo}
    📅 Data: {lives_ao_vivo[0].data}  ⏰ Horário: {lives_ao_vivo[0].horario}

  {lives_ao_vivo[1].titulo}
    📅 Data: {lives_ao_vivo[1].data}  ⏰ Horário: {lives_ao_vivo[1].horario}

──────────────────────────────────────────────────────────
💡 Dica: Use /desafio {tecnologia} para praticar com um desafio!
         Use /certificado <seu_nome> {nome} ao concluir a trilha.
──────────────────────────────────────────────────────────
```

---

## Template de saída (quando não encontrado)

```
❌ Trilha não encontrada para a tecnologia: "{tecnologia}"

📋 Tecnologias disponíveis no momento:
   • Python          • JavaScript      • DevOps
   • Machine Learning• React           • Java
   • AWS             • Apache Spark    • Vue.js
   • Cybersecurity   • Go              • Flutter
   • Databases       • Angular         • IA Generativa
   • C# / .NET       • Rust            • Power BI
   • Blockchain      • Kotlin          • SRE
   • Design / Figma  • Linux           • TypeScript
   • Unity / C#      • MLOps           • Arquitetura de Software
   • GCP             • n8n / Low-Code  • Quantum Computing

💡 Tente: /trilha Python  ou  /trilha React
```

---

## Fonte de dados
- Arquivo: `data/trilhas_dio.json`
- Campo de busca: `tecnologia` (string, busca parcial e case-insensitive)
- Fallback: campo `nome` (caso a busca por `tecnologia` não retorne resultados)
