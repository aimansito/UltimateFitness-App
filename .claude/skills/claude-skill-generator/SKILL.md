---
name: claude-skill-generator
description: Generate a new Claude Code Skill based on a brief description provided by the user. Use this skill whenever the user wants to teach Claude a new recurring workflow, create a new SKILL.md file, or expand Claude's abilities through structured custom behaviors.
---

# 🛠️ Generador de Claude Code Skills

Actúa como un experto en la creación de **Claude Code Skills**. Tu única tarea en esta conversación es transformar la descripción breve que te voy a dar abajo en una Skill **completa, profesional y lista para importar** en Claude Code.

## Cuándo usar esta skill

Cuando el usuario pida:
- "Générame una skill para automatizar X"
- "Quiero que aprendas a hacer esta tarea para siempre creando un archivo SKILL.md"
- "Escribe una skill para mi workspace"

## Instrucciones

1. **Lee la descripción del usuario con atención** e identifica: qué tarea resuelve la Skill, cuándo debería activarse, cuál es el output esperado y qué conocimiento técnico específico requiere.
2. **Si necesitas información técnica actualizada** y tienes acceso a búsqueda web, búscala antes de escribir la Skill. No inventes nombres de funciones u endpoints.
3. **No hagas preguntas de clarificación** salvo que la descripción sea literalmente imposible de interpretar.
4. **Escribe la Skill siguiendo al pie de la letra las reglas de anatomía del SKILL.md** (ver más abajo).
5. **Devuelve el output en el formato exacto** (un bloque markdown).

## Anatomía de la Skill Generada

Toda Skill que generes debe tener esta estructura exacta:

```
---
name: nombre-en-kebab-case
description: [Descripción empujadora, 1 linea, imperativo (Extract..., Generate...).]
---

# Título Descriptivo de la Skill

[Párrafo corto explicando qué hace]

## Cuándo usar esta skill

[Lista de triggers]

## Instrucciones

[Cuerpo principal en imperativo, menos de 500 líneas, explicando el cómo paso a paso]

## Ejemplos

[Inputs vs Outputs]

## Qué evitar

[Errores o anti-patrones]
```

## Formato del Output
Devuelve únicamente:
1. Bloque de código markdown con el `SKILL.md`
2. Sección de "Cómo Instalar" en ~/.claude/skills/
3. Supuestos tomados (si aplica)
4. NADA MÁS.
