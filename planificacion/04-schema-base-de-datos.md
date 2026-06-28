# 04 — Schema de Base de Datos

Base de datos: **Neon Postgres** (serverless)  
ORM: **Prisma 6.x**

---

## Modelos y relaciones

### User
El usuario de la aplicación. En v1 solo existe un usuario (admin).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | String (cuid) | PK |
| name | String? | Nombre display |
| email | String (unique) | Email de login |
| emailVerified | DateTime? | Verificación NextAuth |
| image | String? | URL foto de perfil |
| telegramId | String? (unique) | ID numérico de Telegram |
| timezone | String | Default: America/Santiago |
| role | Role | ADMIN o USER |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

### Task
Tarea del usuario.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | String (cuid) | PK |
| title | String | Título de la tarea |
| description | String? | Descripción opcional |
| status | TaskStatus | PENDING / IN_PROGRESS / COMPLETED / CANCELLED |
| priority | Priority | LOW / MEDIUM / HIGH / URGENT |
| dueDate | DateTime? | Fecha límite |
| completedAt | DateTime? | Cuándo se completó |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |
| userId | String | FK → User |

### Event
Evento del calendario.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | String (cuid) | PK |
| title | String | Título del evento |
| description | String? | Descripción |
| startDate | DateTime | Inicio del evento |
| endDate | DateTime? | Fin del evento |
| allDay | Boolean | Si es todo el día |
| color | String | Hex color del evento |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |
| userId | String | FK → User |

### Reminder
Recordatorio asociado a una tarea o evento.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | String (cuid) | PK |
| message | String? | Mensaje personalizado |
| scheduledAt | DateTime | Cuándo enviar |
| sent | Boolean | Si ya fue enviado |
| sentAt | DateTime? | Cuándo se envió |
| channel | ReminderChannel | TELEGRAM / EMAIL / PUSH |
| createdAt | DateTime | Auto |
| userId | String | FK → User |
| taskId | String? | FK → Task (opcional) |
| eventId | String? | FK → Event (opcional) |

### Tag
Etiquetas para clasificar tareas.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | String (cuid) | PK |
| name | String | Nombre de la etiqueta |
| color | String | Hex color |
| userId | String | FK → User |

### Account / Session / VerificationToken
Modelos requeridos por NextAuth v5. No se modifican manualmente.

---

## Enumeraciones

```prisma
enum Role {
  ADMIN   // Puede gestionar usuarios en v2
  USER    // Usuario normal
}

enum TaskStatus {
  PENDING      // Pendiente (default)
  IN_PROGRESS  // En progreso
  COMPLETED    // Completada
  CANCELLED    // Cancelada
}

enum Priority {
  LOW     // Baja — color gris
  MEDIUM  // Media — color azul (default)
  HIGH    // Alta — color naranja
  URGENT  // Urgente — color rojo
}

enum ReminderChannel {
  TELEGRAM  // Bot de Telegram (default)
  EMAIL     // Email (v2)
  PUSH      // Push notification PWA (v2)
}
```

---

## Relaciones resumidas

```
User ──< Task        (1 usuario tiene N tareas)
User ──< Event       (1 usuario tiene N eventos)
User ──< Reminder    (1 usuario tiene N recordatorios)
User ──< Tag         (1 usuario tiene N etiquetas)
User ──< Account     (NextAuth)
User ──< Session     (NextAuth)

Task >──< Tag        (N tareas tienen N etiquetas — many-to-many)
Task ──< Reminder    (1 tarea puede tener N recordatorios)
Event ──< Reminder   (1 evento puede tener N recordatorios)
```

---

## Índices importantes (performance)

Los índices se definen en el schema de Prisma con `@@index()`:

```prisma
// En el modelo Task
@@index([userId, dueDate])

// En el modelo Reminder
@@index([scheduledAt, sent])

// En el modelo User — ya cubierto por:
telegramId String? @unique  // genera índice único automáticamente
```

---

## Migraciones

Las migraciones se manejan con Prisma Migrate.

```bash
# Crear migración
npx prisma migrate dev --name nombre-de-la-migracion

# Aplicar en producción
npx prisma migrate deploy

# Visualizar la DB
npx prisma studio
```
