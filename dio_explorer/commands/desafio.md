---
name: desafio
description: Gera um desafio de código aleatório baseado no nível e tecnologia escolhidos pelo usuário.
arguments:
  - name: tecnologia
    description: Tecnologia alvo do desafio (ex: Python, JavaScript, Java)
    required: true
  - name: nivel
    description: "Nível do desafio: iniciante, intermediario ou avancado"
    required: false
    default: intermediario
---

# Slash Command: /desafio

## Descrição
Gera um **desafio de código aleatório** com enunciado, requisitos, exemplos de entrada/saída e critérios de avaliação, baseado na tecnologia e nível informados pelo usuário.

---

## Como usar
```
/desafio <tecnologia> [nivel]
```

**Exemplos:**
```
/desafio Python
/desafio JavaScript intermediario
/desafio Java avancado
/desafio Go iniciante
```

---

## Comportamento

1. **Receber** os argumentos `tecnologia` e `nivel` (opcional, padrão: `intermediario`).
2. **Sortear aleatoriamente** um dos desafios do banco correspondente ao nível informado.
3. **Formatar e exibir** o desafio conforme o template abaixo.
4. **Se a tecnologia não for reconhecida**, exibir mensagem de erro com sugestões.

---

## Banco de Desafios por Nível

### 🟢 INICIANTE
| # | Título | Descrição |
|---|--------|-----------|
| 1 | Calculadora Simples | Crie uma função que receba dois números e uma operação (+, -, *, /) e retorne o resultado |
| 2 | Verificador de Palíndromo | Verifique se uma string é um palíndromo (ignorando espaços e case) |
| 3 | FizzBuzz Clássico | Imprima números de 1 a 100; múltiplos de 3 → "Fizz", de 5 → "Buzz", de ambos → "FizzBuzz" |
| 4 | Contador de Vogais | Conte quantas vogais existem em uma string informada |
| 5 | Inversor de String | Retorne uma string ao contrário sem usar funções built-in de reversão |
| 6 | Par ou Ímpar em Lote | Receba uma lista de números e retorne quais são pares e quais são ímpares |
| 7 | Tabuada Dinâmica | Gere a tabuada de qualquer número informado pelo usuário |

### 🟡 INTERMEDIÁRIO
| # | Título | Descrição |
|---|--------|-----------|
| 1 | API de Tarefas (CRUD) | Crie uma API REST com endpoints para criar, listar, atualizar e deletar tarefas |
| 2 | Validador de CPF | Implemente o algoritmo de validação de CPF brasileiro |
| 3 | Anagramas | Verifique se duas strings são anagramas uma da outra |
| 4 | Cache LRU | Implemente uma estrutura de cache LRU com tamanho máximo configurável |
| 5 | Parser de CSV | Leia um arquivo CSV e converta para uma lista de objetos/dicionários |
| 6 | Árvore Binária | Implemente inserção, busca e travessia em uma árvore binária de busca |
| 7 | Rate Limiter | Implemente um rate limiter simples usando o algoritmo Token Bucket |

### 🔴 AVANÇADO
| # | Título | Descrição |
|---|--------|-----------|
| 1 | Mini Compilador | Implemente um parser de expressões matemáticas com precedência de operadores |
| 2 | Web Scraper Assíncrono | Crie um scraper assíncrono que colete dados de múltiplas páginas em paralelo |
| 3 | Banco de Dados em Memória | Implemente um banco de dados chave-valor em memória com suporte a transações |
| 4 | Sistema de Filas | Implemente um sistema de filas com prioridade e workers concorrentes |
| 5 | Gerador de Relatórios | Crie um gerador de relatórios PDF a partir de dados JSON com gráficos |
| 6 | Algoritmo de Grafos | Implemente Dijkstra para encontrar o menor caminho em um grafo ponderado |
| 7 | ORM Simplificado | Construa um micro-ORM que mapeie classes para tabelas de um banco SQLite |

---

## Template de saída

```
╔══════════════════════════════════════════════════════════╗
║            ⚡ DESAFIO DE CÓDIGO — DIO EXPLORER           ║
╚══════════════════════════════════════════════════════════╝

🎯 Desafio: {titulo_do_desafio}
🛠️  Tecnologia: {tecnologia}
📊 Nível: {nivel}
⭐ XP ao Completar: {xp_recompensa} XP
🎲 Seed do Desafio: #{seed_aleatorio}

──────────────────────────────────────────────────────────
📋 ENUNCIADO
──────────────────────────────────────────────────────────

  {descricao_completa_do_desafio}

──────────────────────────────────────────────────────────
✅ REQUISITOS OBRIGATÓRIOS
──────────────────────────────────────────────────────────

  [ ] Req 1: A solução deve tratar entradas inválidas
  [ ] Req 2: Implementar ao menos um caso de teste
  [ ] Req 3: O código deve seguir as boas práticas de {tecnologia}
  [ ] Req 4: Complexidade de tempo deve ser documentada (Big O)

──────────────────────────────────────────────────────────
📥 EXEMPLO DE ENTRADA
──────────────────────────────────────────────────────────

  {exemplo_entrada}

──────────────────────────────────────────────────────────
📤 EXEMPLO DE SAÍDA ESPERADA
──────────────────────────────────────────────────────────

  {exemplo_saida}

──────────────────────────────────────────────────────────
🏆 CRITÉRIOS DE AVALIAÇÃO
──────────────────────────────────────────────────────────

  ⭐⭐⭐⭐⭐  Solução otimizada + testes + documentação
  ⭐⭐⭐⭐    Solução funcional + testes
  ⭐⭐⭐      Solução funcional sem testes
  ⭐⭐        Solução parcialmente funcional
  ⭐          Tentativa com erros

──────────────────────────────────────────────────────────
⏱️  Tempo estimado: {tempo_estimado}
💡 Dica: Ao concluir, use /certificado <seu_nome> <trilha> para gerar seu certificado!
──────────────────────────────────────────────────────────
```

---

## Tabela de XP por Nível
| Nível | XP ao Completar |
|-------|----------------|
| 🟢 Iniciante | 500 XP |
| 🟡 Intermediário | 1.500 XP |
| 🔴 Avançado | 3.000 XP |

---

## Template de erro (tecnologia não reconhecida)

```
❌ Tecnologia "{tecnologia}" não reconhecida.

💡 Tente uma destas:
   Python, JavaScript, Java, Go, Rust, C#, TypeScript,
   React, Angular, Vue.js, Flutter, Kotlin,
   DevOps, AWS, GCP, Docker, Kubernetes,
   Machine Learning, IA Generativa, MLOps,
   Cybersecurity, Blockchain, Databases

Exemplo: /desafio Python avancado
```
