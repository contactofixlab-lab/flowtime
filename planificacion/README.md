# FlowTime — Documentación del Proyecto

Índice completo de la documentación de planificación.

## Archivos de documentación

| Archivo | Descripción |
|---------|-------------|
| [01-vision-y-alcance.md](./01-vision-y-alcance.md) | Qué es FlowTime, para quién, qué hace |
| [02-arquitectura-sistema.md](./02-arquitectura-sistema.md) | Stack técnico, capas del sistema, decisiones |
| [03-modulos.md](./03-modulos.md) | Descripción detallada de cada módulo de la app |
| [04-schema-base-de-datos.md](./04-schema-base-de-datos.md) | Modelos, relaciones, enums de la base de datos |
| [05-bot-telegram.md](./05-bot-telegram.md) | Comandos, flujos y lógica del bot |
| [06-configuracion-entorno.md](./06-configuracion-entorno.md) | Variables de entorno y servicios externos |

## Diagramas de flujo

| Diagrama | Descripción |
|----------|-------------|
| [diagramas/arquitectura-sistema.svg](./diagramas/arquitectura-sistema.svg) | Vista general de capas del sistema |
| [diagramas/flujo-usuario-app.svg](./diagramas/flujo-usuario-app.svg) | Flujo de navegación del usuario en la app |
| [diagramas/flujo-bot-telegram.svg](./diagramas/flujo-bot-telegram.svg) | Flujo de comandos y mensajes del bot |
| [diagramas/schema-er.svg](./diagramas/schema-er.svg) | Diagrama entidad-relación de la base de datos |
| [diagramas/flujo-recordatorios.svg](./diagramas/flujo-recordatorios.svg) | Ciclo de vida de un recordatorio |

## Diagramas UML

| Diagrama | Descripción |
|----------|-------------|
| [diagramas/uml-casos-de-uso.svg](./diagramas/uml-casos-de-uso.svg) | Casos de uso: usuario web, bot Telegram, Vercel Cron |
| [diagramas/uml-secuencia-crear-tarea-web.svg](./diagramas/uml-secuencia-crear-tarea-web.svg) | Secuencia: crear tarea desde la app web |
| [diagramas/uml-secuencia-bot.svg](./diagramas/uml-secuencia-bot.svg) | Secuencia: crear tarea por voz via bot Telegram |
| [diagramas/uml-componentes.svg](./diagramas/uml-componentes.svg) | Componentes: frontend, API layer, servicios externos |
| [diagramas/uml-despliegue.svg](./diagramas/uml-despliegue.svg) | Despliegue: Vercel, Neon, Telegram API, OpenAI |

## Mockups de diseño — Mobile

| Mockup | Descripción |
|--------|-------------|
| [mockups/mockup-dashboard.svg](./mockups/mockup-dashboard.svg) | Dashboard móvil: métricas, actividad, tareas del día |
| [mockups/mockup-tareas.svg](./mockups/mockup-tareas.svg) | Lista de tareas móvil: filtros, prioridades, estados |
| [mockups/mockup-calendario.svg](./mockups/mockup-calendario.svg) | Calendario móvil: grid mensual + detalle del día |
| [mockups/mockup-nueva-tarea.svg](./mockups/mockup-nueva-tarea.svg) | Modal de creación de tarea (bottom sheet móvil) |
| [mockups/mockup-bot-telegram.svg](./mockups/mockup-bot-telegram.svg) | Conversación con el bot de Telegram (texto y voz) |
| [mockups/mockup-historial.svg](./mockups/mockup-historial.svg) | Historial móvil: stats de racha, gráficos, lista de completadas |
| [mockups/mockup-configuracion.svg](./mockups/mockup-configuracion.svg) | Configuración móvil: perfil, Telegram, notificaciones, etiquetas |

## Mockups de diseño — Desktop

| Mockup | Descripción |
|--------|-------------|
| [mockups/mockup-desktop-dashboard.svg](./mockups/mockup-desktop-dashboard.svg) | Dashboard desktop: top bar + 2 columnas, mini-calendario, pill nav |
| [mockups/mockup-desktop-tareas.svg](./mockups/mockup-desktop-tareas.svg) | Tareas desktop: 3 columnas por prioridad, pill nav |
| [mockups/mockup-desktop-calendario.svg](./mockups/mockup-desktop-calendario.svg) | Calendario desktop: grid mensual completo con eventos, pill nav |
| [mockups/mockup-desktop-historial.svg](./mockups/mockup-desktop-historial.svg) | Historial desktop: stats, gráfico evolución, barras por prioridad, tabla |
| [mockups/mockup-desktop-configuracion.svg](./mockups/mockup-desktop-configuracion.svg) | Configuración desktop: 2 columnas (menú + panel), pill nav |
| [mockups/mockup-desktop-nueva-tarea.svg](./mockups/mockup-desktop-nueva-tarea.svg) | Nueva tarea desktop: modal centrado con backdrop overlay, pill nav |

---

**Última actualización:** 2026-06-28
**Versión del plan:** 1.3
