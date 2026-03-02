# Smart Finance Manager - TODO

## Fase 1: Configuración Inicial
- [x] Generar logo personalizado para la app
- [x] Actualizar app.config.ts con branding (appName, logoUrl)
- [x] Configurar colores en theme.config.js
- [x] Actualizar iconos de tab en icon-symbol.tsx

## Fase 2: Arquitectura de Datos
- [x] Definir esquema de base de datos (Ingresos, Deudas, Gastos)
- [x] Crear tipos TypeScript para entidades financieras
- [x] Implementar contexto de estado global (FinanceContext)
- [x] Configurar AsyncStorage para persistencia local

## Fase 3: Interfaz Principal
- [x] Crear layout de navegación con 5 pestañas
- [x] Implementar ScreenContainer personalizado
- [x] Diseñar y crear componentes reutilizables (Card, Button, Input)
- [x] Implementar tema claro/oscuro

## Fase 4: Dashboard (Home)
- [x] Mostrar saldo neto (Ingresos - Deudas - Gastos)
- [x] Crear tarjeta de resumen con 3 métricas principales
- [x] Mostrar indicador de salud financiera
- [x] Agregar botones para nuevo gasto rápido
- [ ] Implementar gráfico circular de distribución de gastos (opcional)

## Fase 5: Módulo de Ingresos
- [x] Crear pantalla de lista de ingresos
- [x] Implementar formulario para agregar ingreso
- [x] Agregar opciones de editar/eliminar ingreso
- [x] Mostrar total de ingresos mensuales
- [x] Implementar frecuencia de ingresos (mensual, semanal, único)

## Fase 6: Módulo de Deudas
- [x] Crear pantalla de lista de deudas
- [x] Implementar formulario para agregar deuda
- [x] Agregar opciones de editar/eliminar deuda
- [x] Mostrar deuda total y porcentaje vs ingresos
- [x] Implementar campo de tasa de interés y fecha de vencimiento
- [x] Opción para marcar deuda como pagada

## Fase 7: Módulo de Gastos con Memoria
- [x] Crear pantalla de lista de gastos
- [x] Implementar formulario para agregar gasto
- [x] Crear sistema de categorías de gastos
- [x] Implementar memoria inteligente (sugerir categorías basadas en historial)
- [ ] Agregar filtros por categoría y rango de fechas
- [x] Mostrar resumen de gastos por categoría
- [x] Opción para editar/eliminar gastos

## Fase 8: Análisis Inteligente
- [x] Crear pantalla de análisis
- [x] Implementar gráfico de tendencia de gastos (últimos 3 meses)
- [x] Mostrar categorías con mayor gasto
- [x] Generar recomendaciones automáticas
- [x] Implementar sistema de alertas
- [ ] Mostrar comparación mes anterior vs mes actual
- [ ] Calcular proyección de deuda

## Fase 9: Pulido y Pruebas
- [ ] Pruebas de flujos principales end-to-end
- [ ] Validación de datos en formularios
- [ ] Optimización de rendimiento
- [ ] Pruebas en dispositivos reales (iOS/Android)
- [ ] Ajustes de UI/UX basados en pruebas

## Fase 10: Entrega
- [ ] Crear checkpoint final
- [ ] Documentar instrucciones de uso
- [ ] Preparar para publicación


## Correcciones Solicitadas

- [x] Agregar períodos a Gastos: Diario, semanal, quincenal, mensual
- [x] Agregar opción quincenal a Ingresos
- [x] Agregar opción quincenal a Deudas (nota: deudas no tienen frecuencia, pero se agregó a ingresos)
- [x] Crear estrategia administrativa robusta para eliminar deudas
- [x] Implementar lógica de plan de pago estratégico (Método Avalanche)
- [x] Crear pantalla de Estrategia con recomendaciones de pago
