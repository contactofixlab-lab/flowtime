# 03 — Módulos de la Aplicación

## Navegación

La app tiene **el mismo patrón de navegación en ambos dispositivos:** un **pill/burbuja flotante glassmorphism centrado en la parte inferior** de la pantalla.

**Mobile (< 768px):** Pill ancho completo con 4 tabs + FAB central (+).

```
[ Dashboard ] [ Tareas ] [ + ] [ Calendario ] [ Config ]
```

**Desktop (≥ 768px):** Pill más compacto, centrado horizontalmente, con 5 tabs + FAB central. Caben todos los módulos por el mayor ancho disponible.

```
[ Inicio ] [ Tareas ] [ + ] [ Calendario ] [ Historial ] [ Config ]
```

El pill flota sobre el contenido con `backdrop-filter: blur`, borde sutil y glow indigo debajo. El FAB central siempre abre el modal de creación rápida de tarea.

El diseño es **completamente responsivo**: misma estética en computador y celular. El bot de Telegram es el canal exclusivo del celular (complementa la app web, no la reemplaza).

En mobile, Historial se accede desde el Dashboard (link "Ver historial"). En desktop cabe directamente en el pill.

---

## Módulo 1 — Dashboard

**Ruta:** `/dashboard`  
**Propósito:** Vista general del día. El primer lugar que ves al abrir la app.

### Contenido
- **Saludo personalizado** con nombre del usuario y fecha actual
- **Resumen del día:** tareas pendientes hoy, eventos próximos, tareas vencidas
- **Métricas rápidas (cards):**
  - Total tareas pendientes
  - Tareas completadas esta semana
  - Racha de días productivos
  - Próximo recordatorio
- **Gráfico de actividad:** tareas completadas por día (últimos 7 días)
- **Lista de tareas urgentes:** las 5 más prioritarias del día
- **Próximos eventos:** los 3 eventos más cercanos del calendario

### Estados vacíos
- Si no hay tareas: "¡Día libre! No tienes tareas pendientes."
- Si no hay eventos: "Sin eventos próximos."

---

## Módulo 2 — Tareas

**Ruta:** `/tasks`  
**Propósito:** Gestión completa del backlog de tareas.

### Vistas
- **Lista:** todas las tareas con filtros y orden
- **Nueva tarea:** formulario modal o página dedicada

### Formulario de creación/edición de tarea
| Campo | Tipo | Requerido |
|-------|------|-----------|
| Título | Texto | ✅ |
| Descripción | Textarea | ❌ |
| Prioridad | Select (Baja/Media/Alta/Urgente) | ✅ |
| Estado | Select (Pendiente/En progreso/Completada/Cancelada) | ✅ |
| Fecha límite | DatePicker | ❌ |
| Etiquetas | Multi-select (tags del usuario) | ❌ |
| Recordatorio | Toggle + DateTimePicker | ❌ |

### Filtros disponibles
- Por estado (Pendiente / En progreso / Completada / Cancelada)
- Por prioridad (Urgente / Alta / Media / Baja)
- Por etiqueta
- Por fecha (hoy / esta semana / este mes)
- Búsqueda por texto

### Acciones en cada tarea
- Marcar como completada (check directo)
- Editar
- Eliminar
- Agregar recordatorio
- Cambiar prioridad rápido

---

## Módulo 3 — Calendario

**Ruta:** `/calendar`  
**Propósito:** Vista temporal de tareas y eventos.

### Vistas del calendario
- **Mensual:** grid del mes con puntos indicadores de eventos/tareas
- **Semanal:** bloques horarios por día

### Tipos de elementos en el calendario
1. **Eventos** — reuniones, citas, cualquier evento con fecha/hora
2. **Tareas con fecha límite** — aparecen como chips en el día de vencimiento

### Formulario de evento
| Campo | Tipo | Requerido |
|-------|------|-----------|
| Título | Texto | ✅ |
| Descripción | Textarea | ❌ |
| Fecha inicio | DateTimePicker | ✅ |
| Fecha fin | DateTimePicker | ❌ |
| Todo el día | Toggle | ❌ |
| Color | ColorPicker (6 opciones) | ❌ |
| Recordatorio | DateTimePicker | ❌ |

---

## Módulo 4 — Historial

**Ruta:** `/history`  
**Propósito:** Registro de tareas completadas y estadísticas de productividad.

### Contenido
- **Tabla de tareas completadas** con fecha de completado, título, prioridad, tiempo que tomó
- **Estadísticas:**
  - Tareas completadas este mes
  - Promedio de tareas por día
  - Racha más larga
  - Distribución por prioridad (gráfico torta)
  - Evolución semanal (gráfico líneas)
- **Filtros:** por rango de fechas, por etiqueta, por prioridad

---

## Módulo 5 — Configuración

**Ruta:** `/settings`  
**Propósito:** Personalización del perfil y comportamiento de la app.

### Secciones

#### Perfil de Usuario
- Nombre, foto de perfil
- Email (solo lectura)
- Zona horaria (default: America/Santiago)

#### Notificaciones
- Activar/desactivar recordatorios por Telegram
- Horario de silencio (ej: no enviar entre 22:00 y 08:00)
- Antelación de recordatorio por defecto (ej: 30 min antes)

#### Telegram
- Estado de conexión del bot (vinculado / no vinculado)
- Botón "Vincular Telegram" → genera código de 6 dígitos
- Instrucciones: "Envía /start XXXXXX a @FlowTimeBot"
- Botón "Desvincular"

#### Etiquetas
- Lista de etiquetas creadas
- Crear nueva etiqueta (nombre + color)
- Editar / eliminar etiquetas existentes

#### Apariencia
- Tema: Dark (default) / Light / Auto (según hora del sistema)

#### Cuenta
- Cambiar contraseña (si usa credenciales)
- Cerrar sesión
- Eliminar cuenta (con confirmación)

---

## Componentes UI reutilizables

| Componente | Descripción |
|-----------|-------------|
| `GlassCard` | Contenedor glassmorphism base |
| `BottomNav` | Navegación inferior con active states |
| `TaskCard` | Card de tarea con acciones rápidas |
| `PriorityBadge` | Badge de color según prioridad |
| `StatusBadge` | Badge de estado de tarea |
| `MetricCard` | Card de métrica con número grande e ícono |
| `EmptyState` | Estado vacío con ilustración y CTA |
| `Modal` | Modal genérico con backdrop blur |
| `DatePicker` | Selector de fecha/hora |
| `TagSelector` | Multi-select de etiquetas |
| `LoadingSpinner` | Spinner de carga glassmorphism |
