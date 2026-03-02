# Smart Finance Manager

Una aplicación móvil inteligente para administración financiera personal que organiza ingresos contra deudas, proporciona análisis automático y permite registrar gastos con memoria de categorías.

## 🎯 Características Principales

### Dashboard Inteligente
- Visualización clara del balance neto (Ingresos - Deudas - Gastos)
- Indicador de salud financiera (0-100%)
- Resumen de métricas principales: ingresos, deudas, gastos del mes
- Ratio deuda/ingresos para evaluar riesgo financiero
- Alertas automáticas cuando la deuda supera el 50% de ingresos
- Transacciones recientes para seguimiento rápido

### Gestión de Ingresos
- Registra múltiples fuentes de ingresos
- Configura frecuencia: único, semanal, mensual, anual
- Cálculo automático de próximo pago
- Edita o elimina ingresos según sea necesario
- Total de ingresos actualizado en tiempo real

### Gestión de Deudas
- Crea deudas con tasa de interés configurable
- Establece fecha de vencimiento
- Estados: activa, vencida, pagada
- Marca deudas como pagadas cuando las liquides
- Visualización del porcentaje deuda/ingresos
- Edita o elimina deudas

### Registro de Gastos con Memoria Inteligente
- Agrega gastos con descripción y monto
- **Sistema de categorías predefinidas**: Comida, Transporte, Entretenimiento, Servicios, Salud, Educación, Otros
- **Memoria inteligente**: Sugiere categorías basadas en tu historial reciente
- Visualización de gastos por categoría
- Resumen de gastos del mes
- Edita o elimina gastos

### Análisis Inteligente
- **Tendencias de gastos**: Visualiza gastos por mes en gráficos
- **Categorías principales**: Identifica dónde gastas más
- **Recomendaciones automáticas**: Sugerencias personalizadas basadas en tu situación financiera
- **Sistema de alertas**: Notificaciones de riesgo financiero
- Comparación de patrones de gasto

## 🛠️ Stack Tecnológico

- **Framework**: React Native con Expo SDK 54
- **Lenguaje**: TypeScript 5.9
- **Estilos**: NativeWind (Tailwind CSS para React Native)
- **Gestión de Estado**: React Context + useReducer
- **Persistencia**: AsyncStorage (almacenamiento local)
- **Navegación**: Expo Router 6
- **Componentes UI**: React Native + Material Icons

## 📱 Requisitos

- Node.js 18+ y pnpm
- Expo CLI: `npm install -g expo-cli`
- iOS 13+ o Android 8+ (para dispositivos)
- Expo Go app (para testing en dispositivos)

## 🚀 Instalación y Uso

### 1. Clonar el repositorio
```bash
git clone https://github.com/Sergio9131/Financial.git
cd Financial
```

### 2. Instalar dependencias
```bash
pnpm install
```

### 3. Iniciar el servidor de desarrollo
```bash
pnpm dev
```

### 4. Ejecutar en diferentes plataformas

**Web**:
```bash
pnpm dev:metro
```

**iOS** (macOS):
```bash
pnpm ios
```

**Android**:
```bash
pnpm android
```

**Expo Go** (cualquier dispositivo):
1. Instala la app Expo Go desde tu app store
2. Escanea el código QR que aparece en la terminal
3. La app se abrirá en Expo Go

## 📁 Estructura del Proyecto

```
smart-finance-manager/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Configuración de pestañas
│   │   ├── index.tsx            # Dashboard
│   │   ├── incomes.tsx          # Gestión de ingresos
│   │   ├── debts.tsx            # Gestión de deudas
│   │   ├── expenses.tsx         # Registro de gastos
│   │   └── analytics.tsx        # Análisis inteligente
│   └── _layout.tsx              # Layout raíz con providers
├── lib/
│   ├── types.ts                 # Tipos TypeScript
│   ├── finance-context.tsx      # Contexto global de finanzas
│   └── utils.ts                 # Utilidades
├── components/
│   ├── screen-container.tsx     # Contenedor de pantalla
│   └── ui/
│       └── icon-symbol.tsx      # Mapeo de iconos
├── assets/
│   └── images/
│       ├── icon.png             # Logo de la app
│       ├── splash-icon.png      # Splash screen
│       └── favicon.png          # Favicon web
├── design.md                    # Documentación de diseño
├── todo.md                      # Lista de tareas
├── app.config.ts                # Configuración de Expo
├── theme.config.js              # Configuración de colores
└── package.json                 # Dependencias del proyecto
```

## 🎨 Personalización

### Cambiar Colores
Edita `theme.config.js` para personalizar la paleta de colores:

```javascript
const themeColors = {
  primary: { light: '#0a7ea4', dark: '#0a7ea4' },
  success: { light: '#22c55e', dark: '#4ade80' },
  error: { light: '#ef4444', dark: '#f87171' },
  // ... más colores
};
```

### Cambiar Nombre de la App
Edita `app.config.ts`:

```typescript
const env = {
  appName: "Tu Nombre de App",
  appSlug: "tu-slug",
  // ...
};
```

### Agregar Categorías de Gastos
En `lib/finance-context.tsx`, modifica `defaultCategories`:

```typescript
const defaultCategories: ExpenseCategory[] = [
  { id: '1', name: 'Nueva Categoría', color: '#FF6B6B', icon: 'icon-name', createdAt: new Date() },
  // ...
];
```

## 💾 Almacenamiento de Datos

Todos los datos se almacenan localmente en el dispositivo usando AsyncStorage:

- **Ingresos**: Fuentes de ingresos y frecuencias
- **Deudas**: Deudas activas, vencidas o pagadas
- **Gastos**: Historial completo de gastos
- **Categorías**: Categorías personalizadas

Los datos se sincronizan automáticamente y persisten entre sesiones.

## 📊 Cálculos Automáticos

La app calcula automáticamente:

- **Balance Neto**: Ingresos - Deudas - Gastos
- **Ratio Deuda/Ingresos**: (Deuda Total / Ingresos) × 100
- **Salud Financiera**: Puntuación de 0-100 basada en el ratio de deuda
- **Alertas**: Notificaciones cuando la deuda supera el 50% de ingresos
- **Recomendaciones**: Sugerencias personalizadas basadas en patrones

## 🔒 Privacidad y Seguridad

- Todos los datos se almacenan **localmente en tu dispositivo**
- **No se envía información a servidores externos** (por defecto)
- Los datos no se sincronizan entre dispositivos
- Puedes eliminar todos los datos en cualquier momento

## 🐛 Troubleshooting

### La app no inicia
```bash
# Limpia caché y reinstala dependencias
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

### Problemas en iOS
```bash
# Limpia caché de Expo
expo start --clear
```

### Problemas en Android
```bash
# Reinicia el servidor Metro
pnpm dev
```

## 📝 Licencia

Este proyecto está bajo licencia MIT. Siéntete libre de usarlo, modificarlo y distribuirlo.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📧 Soporte

Si encuentras problemas o tienes sugerencias, por favor abre un issue en GitHub.

## 🎯 Roadmap Futuro

- [ ] Sincronización en la nube (opcional)
- [ ] Autenticación de usuarios
- [ ] Exportar reportes (PDF, CSV)
- [ ] Gráficos más avanzados
- [ ] Presupuestos y metas de ahorro
- [ ] Notificaciones push para recordatorios
- [ ] Integración con bancos (API)
- [ ] Modo oscuro mejorado
- [ ] Soporte para múltiples monedas

---

**Desarrollado con ❤️ usando Expo y React Native**
