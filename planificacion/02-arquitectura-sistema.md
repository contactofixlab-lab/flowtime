# 02 — Arquitectura del Sistema

## Stack tecnológico

| Capa | Tecnología | Versión | Razón |
|------|-----------|---------|-------|
| Framework web | Next.js | 15 (App Router) | SSR, API routes, Vercel-native |
| Estilos | Tailwind CSS | v4 | Utility-first, glassmorphism fácil |
| Animaciones | Framer Motion | latest | Animaciones 3D fluidas |
| Base de datos | Neon Postgres | serverless | Gratuito, escalable, sin cold start |
| ORM | Prisma | 6.x | Type-safe, migraciones, relaciones |
| Autenticación | NextAuth v5 | beta | Estándar App Router, JWT + sesiones |
| Bot Telegram | Grammy | latest | Serverless-first, TypeScript nativo |
| Voz → Texto | OpenAI Whisper | API | Mejor precisión en español |
| Gráficos | Recharts | latest | Composable, responsive |
| Calendario | react-big-calendar | latest | Open source, sin restricciones |
| Iconos | Lucide React | latest | Consistente, tree-shakeable |
| Fechas | date-fns | latest | Ligero, modular |
| Deploy | Vercel | - | Integración nativa Next.js |
| Cron jobs | Vercel Cron | - | Integrado, 2 crons gratis |

---

## Capas de la arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENTE                              │
│  Browser (computador) · PWA (celular) · Telegram (bot)      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼────────────────────────────────────┐
│                    VERCEL / NEXT.JS 15                       │
│                                                             │
│  ┌─────────────────┐  ┌────────────────────────────────┐   │
│  │   App Router    │  │         API Routes              │   │
│  │  (React Server  │  │  /api/auth/[...nextauth]        │   │
│  │   Components)   │  │  /api/tasks                     │   │
│  │                 │  │  /api/events                    │   │
│  │  /dashboard     │  │  /api/reminders                 │   │
│  │  /tasks         │  │  /api/telegram/webhook          │   │
│  │  /calendar      │  │  /api/cron/reminders            │   │
│  │  /history       │  └────────────────────────────────┘   │
│  │  /settings      │                                        │
│  └─────────────────┘  ┌────────────────────────────────┐   │
│                        │      Grammy Bot Handler         │   │
│                        │  (dentro del webhook route)     │   │
│                        └────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    SERVICIOS EXTERNOS                        │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Neon Postgres│  │ Telegram API │  │  OpenAI Whisper  │  │
│  │  (database)  │  │  (mensajes)  │  │  (transcripción) │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Estructura de carpetas del proyecto

```
flowtime/
├── planificacion/          ← documentación del proyecto
│   ├── diagramas/
│   └── *.md
├── prisma/
│   └── schema.prisma       ← modelos de base de datos
├── src/
│   ├── app/                ← App Router de Next.js
│   │   ├── (auth)/         ← rutas de login/register
│   │   ├── (app)/          ← rutas protegidas
│   │   │   ├── dashboard/
│   │   │   ├── tasks/
│   │   │   ├── calendar/
│   │   │   ├── history/
│   │   │   └── settings/
│   │   └── api/
│   │       ├── auth/       ← NextAuth endpoints
│   │       ├── tasks/
│   │       ├── events/
│   │       ├── reminders/
│   │       ├── telegram/
│   │       │   └── webhook/
│   │       └── cron/
│   │           └── reminders/
│   ├── components/
│   │   ├── ui/             ← componentes base (Button, Card, Input...)
│   │   ├── layout/         ← BottomNav, TopBar, Sidebar
│   │   ├── tasks/          ← TaskCard, TaskForm, TaskList
│   │   ├── calendar/       ← CalendarView, EventModal
│   │   ├── dashboard/      ← MetricCard, ActivityChart
│   │   └── settings/       ← ProfileForm, TelegramConnect
│   ├── lib/
│   │   ├── prisma.ts       ← cliente Prisma singleton
│   │   ├── auth.ts         ← configuración NextAuth
│   │   ├── bot.ts          ← instancia Grammy bot
│   │   └── whisper.ts      ← transcripción de voz
│   └── types/
│       └── index.ts        ← tipos TypeScript globales
├── .env                    ← variables de entorno (no en git)
├── .env.example
├── PLAN.md
└── package.json
```

---

## Flujo de autenticación

```
Usuario → /login → NextAuth → Google OAuth / Credenciales
       → Verificación → Sesión JWT → Cookie segura
       → Acceso a rutas protegidas (middleware)
```

## Flujo de datos (ejemplo: crear tarea desde web)

```
1. Usuario llena formulario en /tasks/new
2. Client component hace POST a /api/tasks
3. API route valida sesión (NextAuth getServerSession)
4. API route crea registro en Neon via Prisma
5. Retorna tarea creada con 201
6. UI actualiza lista de tareas (revalidatePath o SWR)
```

## Flujo de datos (ejemplo: crear tarea desde Telegram)

```
1. Usuario envía mensaje de voz al bot
2. Telegram envía webhook POST a /api/telegram/webhook
3. Grammy procesa el mensaje de voz
4. Descarga el archivo de voz de Telegram
5. Envía el audio a OpenAI Whisper → texto
6. Parsea el texto para extraer título, prioridad, fecha
7. Crea la tarea en Neon via Prisma
8. Bot responde al usuario con confirmación
```

---

## Decisiones de arquitectura relevantes

### ¿Por qué Grammy en lugar de Telegraf?
Grammy fue diseñado desde cero para entornos serverless. Al usar Vercel (funciones edge/serverless), Telegraf puede tener problemas con el modelo de polling. Grammy usa webhooks nativamente y es completamente stateless, perfecto para Next.js API routes.

### ¿Por qué Vercel Cron y no un worker externo?
Los recordatorios en v1 son simples (enviar a una hora determinada). Vercel Cron puede llamar `/api/cron/reminders` cada minuto, que revisa la DB y envía via bot. Para v2 con flujos más complejos (retry, múltiples intentos), migrar a Trigger.dev o Inngest.

### ¿Por qué no tRPC o GraphQL?
La app es relativamente simple en v1. REST con API routes de Next.js es más simple de mantener y debuggear. Si la complejidad crece en v2, se puede considerar tRPC.
