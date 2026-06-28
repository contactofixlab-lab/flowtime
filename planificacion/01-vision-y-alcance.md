# 01 — Visión y Alcance

## ¿Qué es FlowTime?

FlowTime es una aplicación organizativa personal de uso gerencial. Permite gestionar tareas, eventos de calendario y recordatorios desde el computador vía web, y desde el celular vía bot de Telegram. No es una app de gamificación ni de productividad con mecánicas de juego — es una herramienta seria, limpia y eficiente para organizar el trabajo del día a día.

---

## Usuario objetivo

**v1 (actual):** Un solo usuario — Vicente (administrador).  
**v2 (futuro):** Múltiples usuarios con roles (Admin / User), invitados por el administrador.

---

## Problema que resuelve

| Sin FlowTime | Con FlowTime |
|---|---|
| Tareas dispersas en notas, WhatsApp, email | Todas en un solo lugar con prioridad y fecha |
| Sin recordatorios automáticos | Bot Telegram te avisa antes de que venza una tarea |
| Crear tareas requiere abrir el computador | Dictarle al bot por voz desde el celular |
| Sin visión del mes completo | Calendario integrado con eventos y tareas |
| Sin métricas de productividad | Dashboard con racha, completadas, pendientes |

---

## Alcance v1 (MVP)

### Incluido ✅
- Autenticación segura (Google OAuth + credenciales)
- Gestión de tareas: crear, editar, completar, cancelar, priorizar, etiquetar
- Calendario: vista mensual y semanal, crear eventos
- Dashboard: resumen del día, métricas, tareas urgentes
- Historial: tareas completadas con estadísticas
- Recordatorios automáticos vía Telegram (cron job)
- Bot Telegram: comandos de texto + mensajes de voz (Whisper)
- Configuración: perfil, zona horaria, etiquetas, vinculación Telegram
- Diseño glassmorphism 3D, dark mode, responsive
- PWA — instalable en celular como app nativa

### No incluido en v1 ❌
- Múltiples usuarios (se agrega en v2)
- Integraciones con Google Calendar / Outlook
- App móvil nativa (iOS/Android)
- Subtareas o tareas anidadas
- Colaboración en tiempo real
- Proyectos o tableros Kanban

---

## Canales de acceso

```
┌──────────────────────┐     ┌─────────────────────┐
│   COMPUTADOR (Web)   │     │  CELULAR (Telegram)  │
│                      │     │                      │
│  • Dashboard         │     │  • Crear tarea       │
│  • Tareas (CRUD)     │     │  • Ver pendientes    │
│  • Calendario        │     │  • Marcar completada │
│  • Historial         │     │  • Crear recordatorio│
│  • Configuración     │     │  • Mensaje de voz    │
└──────────────────────┘     └─────────────────────┘
           │                           │
           └───────────┬───────────────┘
                       │
              ┌────────▼────────┐
              │  Neon Postgres  │
              │   (base datos)  │
              └─────────────────┘
```

---

## Flujo general de uso

1. El usuario accede a la web desde su computador
2. Inicia sesión con su cuenta de Google o credenciales
3. Desde el Dashboard ve el resumen del día
4. Crea, edita y gestiona tareas desde el módulo Tareas
5. Agrega eventos en el Calendario
6. Configura recordatorios para tareas importantes
7. El cron job revisa cada minuto si hay recordatorios pendientes
8. Si hay uno, el bot de Telegram envía el mensaje al celular
9. Desde el celular, puede responder al bot con texto o voz para crear nuevas tareas

---

## Métricas de éxito del MVP

- Tiempo de carga inicial < 2 segundos
- Bot responde en < 3 segundos
- Transcripción de voz correcta > 90% del tiempo
- Lighthouse Performance Score ≥ 90
- 0 errores 500 en producción al momento del lanzamiento
