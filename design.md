# Smart Finance Manager - Diseño de Interfaz Móvil

## Visión General

Una aplicación inteligente de administración financiera personal que organiza ingresos contra deudas, proporciona análisis automático de flujo de efectivo, y permite registrar gastos con memoria de categorías.

## Pantallas Principales

### 1. **Dashboard (Home)**
- **Propósito**: Vista general del estado financiero actual
- **Contenido Principal**:
  - Saldo neto (Ingresos - Deudas - Gastos)
  - Tarjeta de resumen: Ingresos totales, Deudas totales, Gastos del mes
  - Gráfico circular: Distribución de gastos por categoría
  - Indicador de salud financiera (porcentaje de deuda vs ingresos)
  - Botón flotante para agregar nuevo gasto rápidamente

### 2. **Ingresos**
- **Propósito**: Gestionar fuentes de ingresos
- **Contenido Principal**:
  - Lista de ingresos activos (salario, freelance, etc.)
  - Monto total de ingresos mensuales
  - Botón para agregar nuevo ingreso
  - Cada ingreso muestra: nombre, monto, frecuencia, fecha de próximo pago
  - Opción para editar o eliminar ingresos

### 3. **Deudas**
- **Propósito**: Rastrear y gestionar deudas
- **Contenido Principal**:
  - Lista de deudas activas (tarjeta de crédito, préstamo, etc.)
  - Deuda total pendiente
  - Porcentaje de deuda vs ingresos
  - Botón para agregar nueva deuda
  - Cada deuda muestra: nombre, monto, tasa de interés, fecha de vencimiento, estado
  - Opción para marcar como pagada o editar

### 4. **Gastos**
- **Propósito**: Registrar y categorizar gastos con memoria
- **Contenido Principal**:
  - Lista de gastos recientes (últimos 30 días)
  - Filtros por categoría y rango de fechas
  - Botón para agregar nuevo gasto
  - Cada gasto muestra: descripción, monto, categoría, fecha
  - Categorías sugeridas basadas en historial (memoria inteligente)
  - Resumen de gastos por categoría
  - Opción para editar o eliminar gastos

### 5. **Análisis Inteligente**
- **Propósito**: Proporcionar insights y recomendaciones
- **Contenido Principal**:
  - Tendencia de gastos (últimos 3 meses)
  - Categorías con mayor gasto
  - Proyección de deuda si continúa el gasto actual
  - Recomendación: "Necesitas reducir gastos en [categoría] para mantener equilibrio"
  - Comparación mes anterior vs mes actual
  - Alertas: "Deuda superior al 50% de ingresos"

## Flujos de Usuario Principales

### Flujo 1: Agregar Ingreso
1. Usuario toca botón "+" en pantalla Ingresos
2. Formulario: nombre, monto, frecuencia (mensual, semanal, único)
3. Guardar → Se actualiza Dashboard automáticamente

### Flujo 2: Agregar Deuda
1. Usuario toca botón "+" en pantalla Deudas
2. Formulario: nombre, monto, tasa de interés (opcional), fecha de vencimiento
3. Guardar → Se actualiza Dashboard y análisis

### Flujo 3: Registrar Gasto (con Memoria)
1. Usuario toca botón "+" para nuevo gasto
2. Ingresa monto
3. Sistema sugiere categorías basadas en gastos anteriores
4. Usuario selecciona categoría (o crea nueva)
5. Ingresa descripción (opcional)
6. Guardar → Se actualiza Dashboard y análisis

### Flujo 4: Ver Análisis
1. Usuario navega a pestaña Análisis
2. Ve tendencias, alertas y recomendaciones
3. Puede tocar alertas para ver detalles y acciones sugeridas

## Decisiones de Diseño

### Colores
- **Primario**: `#0a7ea4` (azul profesional)
- **Fondo**: Blanco claro (light) / Gris oscuro (dark)
- **Éxito**: `#22C55E` (verde para ingresos y saldo positivo)
- **Alerta**: `#F59E0B` (naranja para deudas moderadas)
- **Error**: `#EF4444` (rojo para deudas altas o gastos excesivos)

### Tipografía
- **Títulos**: Fuerte, legible, 24-28px
- **Subtítulos**: 16-18px
- **Cuerpo**: 14px
- **Pequeño**: 12px

### Componentes Clave
- **Tarjetas de Resumen**: Mostrar información crítica de un vistazo
- **Gráficos**: Visualización de distribución de gastos
- **Botones Flotantes**: Acceso rápido a acciones principales
- **Listas**: Scroll vertical para historial de transacciones
- **Modales**: Formularios para agregar/editar datos

### Navegación
- **Barra de Pestañas** (Bottom Tab Navigation):
  - Dashboard (casa)
  - Ingresos (dinero entrante)
  - Deudas (tarjeta de crédito)
  - Gastos (carrito de compras)
  - Análisis (gráfico)

## Principios de Interacción

1. **Retroalimentación Inmediata**: Cada acción muestra confirmación visual
2. **Memoria Inteligente**: El sistema aprende de patrones de gastos
3. **Claridad**: Números grandes y claros, sin jerga financiera compleja
4. **Accesibilidad**: Una mano, pantalla vertical, botones grandes
5. **Seguridad**: Datos almacenados localmente (sin sincronización en la nube por defecto)
