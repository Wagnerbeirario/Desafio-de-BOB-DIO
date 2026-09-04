---
name: certificado
description: Gera um certificado fictício em Markdown com o nome do usuário e a trilha concluída.
arguments:
  - name: nome_usuario
    description: Nome completo do usuário que concluiu a trilha
    required: true
  - name: trilha
    description: Nome da trilha concluída (deve corresponder a uma trilha em data/trilhas_dio.json)
    required: true
---

# Slash Command: /certificado

## Descrição
Gera um **certificado fictício formatado em Markdown** com dados personalizados do usuário e da trilha concluída, incluindo data de emissão, carga horária estimada, badges conquistadas e código de verificação.

---

## Como usar
```
/certificado <nome_usuario> <trilha>
```

**Exemplos:**
```
/certificado "João Silva" Python
/certificado "Maria Oliveira" "React"
/certificado "Carlos Santos" "Machine Learning"
```

---

## Comportamento

1. **Receber** o nome do usuário e o nome/tecnologia da trilha.
2. **Buscar** a trilha correspondente em `data/trilhas_dio.json` (busca parcial, case-insensitive).
3. **Gerar** a data de emissão automaticamente (data atual).
4. **Calcular** a carga horária estimada (número de módulos × 8 horas).
5. **Gerar** um código de verificação fictício único (hash baseado em nome + trilha + data).
6. **Renderizar** o certificado no template abaixo.
7. **Salvar** (opcionalmente) em `docs/certificados-emitidos/{nome_usuario}-{tecnologia}.md`.

---

## Template do Certificado (saída em Markdown)

```markdown
---

<div align="center">

# 🏛️ DIGITAL INNOVATION ONE

## CERTIFICADO DE CONCLUSÃO

---

Este certificado é conferido a

# {NOME_USUARIO}

que concluiu com êxito a trilha de formação

## "{nome_trilha}"

ofertada pela plataforma **DIO — Digital Innovation One**
em parceria com os melhores especialistas do mercado.

---

| 🛠️ Tecnologia | 📊 Nível | 🧩 Módulos | ⭐ XP Obtido | ⏱️ Carga Horária |
|:---:|:---:|:---:|:---:|:---:|
| {tecnologia} | {nivel} | {numero_de_modulos} | {xp_total} XP | {carga_horaria}h |

---

### 🏅 Badges Conquistadas

| Badge | Status |
|:---:|:---:|
| {badge_1} | ✅ Conquistada |
| {badge_2} | ✅ Conquistada |
| {badge_3} | ✅ Conquistada |

---

### 📋 Informações do Certificado

| Campo | Valor |
|---|---|
| 📅 Data de Emissão | {data_emissao} |
| 🔑 Código de Verificação | `DIO-{codigo_verificacao}` |
| 🌐 Verificar em | https://www.dio.me/certificate/{codigo_verificacao} |
| ♾️ Acesso Vitalício | {vitalicio} |

---

> _"A educação é a arma mais poderosa que você pode usar para mudar o mundo."_
> — Nelson Mandela

---

**Roberto Melo**
_CEO & Founder — Digital Innovation One_

🌐 [dio.me](https://www.dio.me) | 📧 contato@dio.me

---

_Certificado gerado pelo DIO Explorer · Documento fictício para fins educacionais_

</div>

---
```

---

## Exemplo de saída gerada

```markdown
---

<div align="center">

# 🏛️ DIGITAL INNOVATION ONE

## CERTIFICADO DE CONCLUSÃO

---

Este certificado é conferido a

# João Silva

que concluiu com êxito a trilha de formação

## "Dominando Python do Zero ao Avançado"

ofertada pela plataforma **DIO — Digital Innovation One**
em parceria com os melhores especialistas do mercado.

---

| 🛠️ Tecnologia | 📊 Nível | 🧩 Módulos | ⭐ XP Obtido | ⏱️ Carga Horária |
|:---:|:---:|:---:|:---:|:---:|
| Python | Iniciante ao Avançado | 12 | 15.000 XP | 96h |

---

### 🏅 Badges Conquistadas

| Badge | Status |
|:---:|:---:|
| Python Starter | ✅ Conquistada |
| Python Developer | ✅ Conquistada |
| Python Master | ✅ Conquistada |

---

### 📋 Informações do Certificado

| Campo | Valor |
|---|---|
| 📅 Data de Emissão | 03/09/2026 |
| 🔑 Código de Verificação | `DIO-PY2026JS09AB4F` |
| 🌐 Verificar em | https://www.dio.me/certificate/PY2026JS09AB4F |
| ♾️ Acesso Vitalício | Sim |

---

> _"A educação é a arma mais poderosa que você pode usar para mudar o mundo."_
> — Nelson Mandela

---

**Roberto Melo**
_CEO & Founder — Digital Innovation One_

🌐 [dio.me](https://www.dio.me) | 📧 contato@dio.me

---

_Certificado gerado pelo DIO Explorer · Documento fictício para fins educacionais_

</div>

---
```

---

## Template de erro (trilha não encontrada)

```
❌ Trilha não encontrada para: "{trilha}"

📋 Verifique o nome da trilha em: data/trilhas_dio.json
💡 Exemplo: /certificado "Seu Nome" Python
            /certificado "Seu Nome" React
            /certificado "Seu Nome" "Machine Learning"
```

---

## Regras de Cálculo

| Campo | Cálculo |
|---|---|
| Carga Horária | `numero_de_modulos × 8 horas` |
| Código de Verificação | `{sigla_tecnologia}{ano}{mes}{hash_4chars}` |
| Data de Emissão | Data atual no formato `DD/MM/AAAA` |

---

## Arquivo Gerado (opcional)
O certificado pode ser salvo automaticamente em:
```
docs/certificados-emitidos/{nome_usuario}-{tecnologia}-{data}.md
```
> ⚠️ Esta pasta está listada no `.bobignore` e não será rastreada por padrão.
