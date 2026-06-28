# FlowTime — Plan de Desarrollo

App organizativa personal: Tareas + Calendario + Recordatorios + Bot Telegram  
**Stack:** Next.js 15 · Tailwind v4 · Neon Postgres · Prisma · Grammy · NextAuth v5 · Vercel

---

## Fase 1 — Planificación ✅
- [x] Definición de alcance y stack
- [x] Schema Prisma completo (User, Task, Event, Reminder, Tag)
- [x] Setup inicial Next.js 15 + dependencias
- [x] Repositorio GitHub creado
- [x] Variables de entorno definidas (.env.example)

## Fase 2 — Desarrollo Core (en curso)
- [ ] Layout base con glassmorphism 3D + bottom nav
- [ ] NextAuth v5 — autenticación (Google OAuth + credenciales)
- [ ] Conexión Neon Postgres + migraciones Prisma
- [ ] Módulo Tareas — CRUD completo (prioridades, etiquetas, filtros)
- [ ] Módulo Calendario — vista mensual/semanal con react-big-calendar
- [ ] Dashboard — métricas del día, resumen, gráficos Recharts
- [ ] Historial — tareas completadas, estadísticas, racha
- [ ] Módulo Configuración — perfil, notificaciones, Telegram, tema
- [ ] Sistema de recordatorios — Vercel Cron jobs

## Fase 3 — Integración Telegram
- [ ] Crear bot con Grammy + webhook en /api/telegram/webhook
- [ ] Comandos: /start, /newtask, /list, /done, /remind, /calendar
- [ ] Mensajes de voz → texto con OpenAI Whisper
- [ ] Vincular Telegram ID al usuario de la app
- [ ] Recordatorios automáticos via Telegram

## Fase 4 — QA & Deploy
- [ ] Testing end-to-end flujos críticos
- [ ] Testing responsive (desktop + mobile)
- [ ] QA bot Telegram completo
- [ ] Performance Lighthouse 90+
- [ ] Revisión de seguridad
- [ ] Deploy a Vercel producción

---

## Decisiones de arquitectura

| Decisión | Elección | Razón |
|----------|----------|-------|
| Bot Telegram | Grammy | Soporte nativo serverless/webhook, TypeScript |
| DB | Neon Postgres | Serverless, gratuito, ya conocido |
| ORM | Prisma | Type-safe, migraciones sencillas |
| Auth | NextAuth v5 | Estándar para Next.js App Router |
| Voz→Texto | OpenAI Whisper | Más preciso para español |
| Cron jobs | Vercel Cron | Integrado, gratuito para 2 crons |
| Calendar | react-big-calendar | Open source, sin límites |
| Deploy | Vercel | Siempre Vercel |
