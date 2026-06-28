# 05 — Bot de Telegram

**Library:** Grammy  
**Webhook URL:** `https://flowtime.vercel.app/api/telegram/webhook`  
**Nombre del bot:** @FlowTimeBot (a definir al crear con @BotFather)

---

## Comandos disponibles

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `/start` | Bienvenida e instrucciones | `/start` |
| `/start XXXXXX` | Vincula Telegram con la cuenta web | `/start 483921` |
| `/newtask` | Crear nueva tarea interactivamente | `/newtask` |
| `/list` | Ver tareas pendientes | `/list` |
| `/urgent` | Ver solo tareas urgentes | `/urgent` |
| `/today` | Tareas y eventos de hoy | `/today` |
| `/done ID` | Marcar tarea como completada | `/done abc123` |
| `/remind` | Crear un recordatorio | `/remind` |
| `/calendar` | Ver eventos de los próximos 7 días | `/calendar` |
| `/help` | Lista de comandos disponibles | `/help` |

---

## Mensajes de voz

El bot acepta **mensajes de voz** en español. El flujo es:

1. Usuario envía nota de voz
2. Grammy detecta el mensaje de tipo `voice`
3. Descarga el archivo .ogg de los servidores de Telegram
4. Envía el audio a **OpenAI Whisper** → transcripción de texto
5. El texto se parsea para identificar intención:
   - "crear tarea: ..." → crea tarea
   - "recordarme ..." → crea recordatorio
   - "qué tengo hoy" → responde con agenda
6. El bot ejecuta la acción y confirma

### Ejemplos de voz que el bot entiende
- *"Crea una tarea urgente: llamar al banco mañana a las 10"*
- *"Recuérdame revisar el contrato el viernes a las 3 de la tarde"*
- *"Qué tengo pendiente para hoy"*
- *"Marca como completada la tarea de llamar al banco"*

---

## Flujo de vinculación de cuenta

```
App web → Settings → Telegram → "Vincular Telegram"
       → Genera código de 6 dígitos (ej: 483921)
       → Muestra instrucción: "Envía /start 483921 a @FlowTimeBot"

Telegram → Usuario envía /start 483921
         → Bot verifica código en DB
         → Si válido: guarda telegram_id en User
         → Responde "¡Cuenta vinculada! Bienvenido, Vicente 🎉"
         → Código se invalida (uso único, expira en 10 min)
```

---

## Flujo de recordatorios automáticos

```
Vercel Cron → cada minuto → GET /api/cron/reminders
           → Prisma consulta recordatorios donde:
             scheduled_at <= now() AND sent = false
           → Por cada recordatorio:
             → Bot envía mensaje a user.telegram_id
             → Actualiza reminder: sent=true, sentAt=now()
```

### Formato del mensaje de recordatorio
```
⏰ Recordatorio

📋 Tarea: Llamar al banco
🔴 Prioridad: Urgente
📅 Vence: hoy a las 10:00

¿Ya la completaste? Responde /done abc123
```

---

## Formato de respuestas del bot

### Lista de tareas (`/list`)
```
📋 Tus tareas pendientes (5)

🔴 Urgente
  • Llamar al banco — vence hoy
  
🟠 Alta  
  • Revisar contrato Empresas X — vence mañana

🔵 Media
  • Preparar presentación — vence el viernes
  • Enviar informe mensual — sin fecha
  
⚪ Baja
  • Ordenar escritorio — sin fecha

Para completar una: /done [ID]
```

### Confirmación de tarea creada
```
✅ Tarea creada exitosamente

📋 Llamar al banco
🔴 Prioridad: Urgente  
📅 Vence: mañana a las 10:00
⏰ Te recordaré: mañana a las 9:30

Ver en la app → flowtime.vercel.app/tasks
```

---

## Configuración técnica (Grammy)

```typescript
// src/lib/bot.ts
import { Bot } from "grammy";

export const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

// src/app/api/telegram/webhook/route.ts
import { webhookCallback } from "grammy";
import { bot } from "@/lib/bot";

const handleUpdate = webhookCallback(bot, "std/http");

export async function POST(req: Request) {
  // Verificar secret de Telegram
  const secret = req.headers.get("X-Telegram-Bot-Api-Secret-Token");
  if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }
  return handleUpdate(req);
}
```

---

## Pasos para poner el bot en producción

1. Hablar con `@BotFather` en Telegram
2. Crear bot: `/newbot` → asignar nombre y username
3. Guardar el token en `.env` → `TELEGRAM_BOT_TOKEN`
4. Después del deploy a Vercel, registrar el webhook:
```bash
curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://flowtime.vercel.app/api/telegram/webhook&secret_token=<WEBHOOK_SECRET>"
```
5. Verificar: `https://api.telegram.org/bot<TOKEN>/getWebhookInfo`
