# 06 — Configuración del Entorno

## Variables de entorno

Todas las variables deben estar en `.env` (local) y en Vercel (producción).

| Variable | Dónde obtenerla | Requerida |
|----------|----------------|-----------|
| `DATABASE_URL` | Neon → proyecto → connection string | ✅ |
| `NEXTAUTH_URL` | URL de la app (localhost en dev, Vercel en prod) | ✅ |
| `NEXTAUTH_SECRET` | Generar con `openssl rand -base64 32` | ✅ |
| `GOOGLE_CLIENT_ID` | Google Cloud Console → OAuth 2.0 | ⚠️ opcional |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console → OAuth 2.0 | ⚠️ opcional |
| `TELEGRAM_BOT_TOKEN` | @BotFather en Telegram | ✅ |
| `TELEGRAM_WEBHOOK_SECRET` | Cadena random segura (cualquiera) | ✅ |
| `OPENAI_API_KEY` | platform.openai.com → API Keys | ✅ |

---

## Setup paso a paso

### 1. Neon Postgres

1. Ir a [neon.tech](https://neon.tech) → crear cuenta gratis
2. New Project → nombre: `flowtime`
3. Copiar el **connection string** (format: `postgresql://...`)
4. Pegarlo en `.env` como `DATABASE_URL`
5. Ejecutar migraciones:
```bash
npx prisma migrate dev --name init
```

### 2. Google OAuth (opcional)

1. Ir a [console.cloud.google.com](https://console.cloud.google.com)
2. Crear proyecto → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID → Web Application
4. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://flowtime.vercel.app/api/auth/callback/google` (prod)
5. Copiar Client ID y Client Secret a `.env`

### 3. Telegram Bot

1. Abrir Telegram → buscar `@BotFather`
2. Enviar `/newbot`
3. Nombre: `FlowTime` (o el que prefieras)
4. Username: `@FlowTimeBot` (debe terminar en "bot")
5. Copiar el token al `.env`
6. Después del deploy, registrar el webhook (ver doc bot)

### 4. OpenAI Whisper

1. Ir a [platform.openai.com](https://platform.openai.com)
2. API Keys → Create new secret key
3. Copiar a `.env` como `OPENAI_API_KEY`
4. El costo de Whisper es **$0.006/minuto** de audio — extremadamente barato

---

## Configuración de Vercel Cron

En `vercel.json` se configura el cron de recordatorios:

```json
{
  "crons": [
    {
      "path": "/api/cron/reminders",
      "schedule": "* * * * *"
    }
  ]
}
```

`* * * * *` = cada minuto. En el plan Hobby de Vercel, los cron jobs se ejecutan según el schedule sin importar el tráfico. El límite es 2 crons activos.

> **Pendiente:** El archivo `vercel.json` debe crearse en la raíz del proyecto antes del primer deploy. Ver Fase 4 del PLAN.md.

---

## Deploy a Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

O conectar el repositorio GitHub directamente en [vercel.com/new](https://vercel.com/new).

**Variables de entorno en Vercel:**
Settings → Environment Variables → agregar todas las del `.env`

---

## Comandos de desarrollo frecuentes

```bash
# Iniciar servidor de desarrollo
npm run dev

# Generar cliente Prisma (tras cambiar schema)
npx prisma generate

# Crear migración nueva
npx prisma migrate dev --name nombre

# Ver base de datos visualmente
npx prisma studio

# Build de producción local
npm run build && npm start

# Type-check sin compilar
npx tsc --noEmit
```
