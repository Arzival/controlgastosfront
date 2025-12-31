# Control de Gastos - Frontend

## 📋 Descripción

Aplicación web frontend desarrollada en React con TypeScript para el control y gestión de finanzas personales. Permite a los usuarios registrar ingresos y egresos, gestionar fondos de ahorro, categorizar transacciones y visualizar estadísticas financieras mediante gráficos interactivos.

## 🚀 Tecnologías Utilizadas

- **React 19.2.0** - Biblioteca de JavaScript para construir interfaces de usuario
- **TypeScript** - Superset de JavaScript con tipado estático
- **Vite 7.2.4** - Herramienta de construcción y desarrollo
- **React Router DOM 7.10.1** - Enrutamiento para aplicaciones React
- **Axios 1.13.2** - Cliente HTTP para realizar peticiones a la API
- **Recharts 3.5.1** - Biblioteca de gráficos para React
- **Tailwind CSS 3.4.18** - Framework de CSS utility-first

## 📦 Instalación

1. **Clonar el repositorio** (si aplica) o navegar al directorio del proyecto:
```bash
cd controlgastos
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:
   - Crear un archivo `.env` en la raíz del proyecto
   - Agregar la siguiente variable:
```env
VITE_API_URL=http://localhost:8000/api
```

4. **Iniciar el servidor de desarrollo**:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` (o el puerto que Vite asigne).

## 🏗️ Estructura del Proyecto

```
src/
├── assets/              # Recursos estáticos (imágenes, iconos)
├── components/          # Componentes reutilizables
│   ├── dashboard/       # Componentes del dashboard
│   │   ├── BalanceCards.tsx          # Tarjetas de balance (ingresos, egresos, disponible)
│   │   ├── ChartsSection.tsx          # Sección de gráficos (barras, líneas, pastel)
│   │   ├── ManageFundModal.tsx        # Modal para gestionar fondos (depositar/retirar)
│   │   ├── SavingsFundCard.tsx        # Tarjeta individual de fondo de ahorro
│   │   ├── SavingsFundModal.tsx      # Modal para crear/editar fondos
│   │   ├── SavingsSection.tsx        # Sección de fondos de ahorro
│   │   ├── TransactionForm.tsx       # Formulario para crear/editar transacciones
│   │   └── TransactionList.tsx       # Lista de transacciones
│   └── LanguageSwitch.tsx             # Selector de idioma
├── contexts/            # Contextos de React para estado global
│   ├── LanguageContext.tsx           # Contexto de idioma (i18n)
│   └── TransactionContext.tsx        # Contexto de transacciones, fondos y categorías
├── i18n/                # Internacionalización
│   └── translations.ts                # Traducciones (español/inglés)
├── pages/               # Páginas principales
│   ├── Dashboard.tsx                 # Página principal del dashboard
│   ├── Home.tsx                      # Página de inicio
│   ├── Login.tsx                     # Página de inicio de sesión
│   └── Register.tsx                  # Página de registro
├── request/             # Funciones para peticiones HTTP
│   ├── auth/
│   │   └── auth.request.tsx          # Peticiones de autenticación
│   ├── categories/
│   │   └── categories.request.tsx    # Peticiones de categorías
│   ├── savings/
│   │   └── savings.request.tsx       # Peticiones de fondos de ahorro
│   └── transactions/
│       └── transactions.request.tsx   # Peticiones de transacciones
├── types/               # Definiciones de tipos TypeScript
│   ├── savings.ts                     # Tipos para fondos de ahorro
│   └── transaction.ts                 # Tipos para transacciones y categorías
└── utils/               # Utilidades
    ├── availableBalance.ts            # Cálculo de balance disponible
    └── dateUtils.ts                   # Utilidades de fechas
```

## 🔐 Autenticación

La aplicación utiliza **Laravel Sanctum** para la autenticación basada en tokens. El flujo es el siguiente:

1. **Registro/Login**: El usuario se registra o inicia sesión
2. **Token**: El backend devuelve un token de autenticación
3. **Almacenamiento**: El token se guarda en `localStorage` como `auth_token`
4. **Interceptor**: Axios intercepta todas las peticiones y agrega automáticamente el header `Authorization: Bearer {token}`
5. **Logout**: Al cerrar sesión, se elimina el token del `localStorage`

## 📡 Peticiones HTTP

Todas las peticiones se realizan a través de Axios con un interceptor configurado en `src/request/auth/auth.request.tsx`:

### Configuración Base
- **Base URL**: Configurada desde `VITE_API_URL`
- **Headers**: Se agrega automáticamente `Authorization: Bearer {token}` en todas las peticiones autenticadas

### Endpoints Utilizados

#### Autenticación
- `POST /api/register` - Registro de usuario
- `POST /api/login` - Inicio de sesión

#### Fondos de Ahorro
- `GET /api/savings-funds` - Obtener todos los fondos del usuario
- `POST /api/savings-funds` - Crear nuevo fondo
- `POST /api/savings-funds/update` - Actualizar fondo
- `POST /api/savings-funds/delete` - Eliminar fondo

#### Transacciones
- `GET /api/transactions` - Obtener todas las transacciones del usuario
- `POST /api/transactions` - Crear nueva transacción
- `POST /api/transactions/update` - Actualizar transacción
- `POST /api/transactions/delete` - Eliminar transacción

#### Transacciones de Ahorro
- `GET /api/savings-transactions` - Obtener todas las transacciones de ahorro
- `POST /api/savings-transactions` - Crear transacción de ahorro (depósito/retiro)
- `POST /api/savings-transactions/delete` - Eliminar transacción de ahorro

#### Categorías
- `GET /api/categories` - Obtener todas las categorías del usuario
- `POST /api/categories` - Crear nueva categoría
- `POST /api/categories/update` - Actualizar categoría
- `POST /api/categories/delete` - Eliminar categoría

## 🎯 Funcionalidades Principales

### 1. Gestión de Transacciones
- ✅ Crear transacciones (ingresos/egresos)
- ✅ Editar transacciones existentes
- ✅ Eliminar transacciones
- ✅ Visualizar historial de transacciones
- ✅ Filtrar por período (diario, semanal, mensual)

### 2. Fondos de Ahorro
- ✅ Crear fondos de ahorro personalizados
- ✅ Editar fondos (nombre, descripción, color)
- ✅ Depositar dinero en fondos
- ✅ Retirar dinero de fondos
- ✅ Eliminar fondos (solo si el balance es 0)
- ✅ Ver historial de transacciones por fondo

### 3. Categorías
- ✅ Categorías por defecto (Comida, Transporte, Entretenimiento, Salud, Quincena)
- ✅ Crear categorías personalizadas
- ✅ Editar categorías (nombre y color)
- ✅ Eliminar categorías (validación: no se puede eliminar si está en uso)

### 4. Visualización de Datos
- ✅ **Balance Cards**: Muestra ingresos totales, egresos totales y dinero disponible
- ✅ **Gráfico de Barras**: Comparación de ingresos vs egresos por período
- ✅ **Gráfico de Líneas**: Tendencias de ingresos y egresos a lo largo del tiempo
- ✅ **Gráfico de Pastel**: Distribución de gastos por categoría

### 5. Cálculos Automáticos
- ✅ **Dinero Disponible**: `Ingresos - Egresos - Depósitos + Retiros`
- ✅ **Balance de Fondos**: Se actualiza automáticamente al depositar/retirar
- ✅ **Totales por Período**: Cálculos dinámicos según filtro seleccionado

## 🔄 Flujo de Datos

1. **Carga Inicial**: Al montar la aplicación, se cargan todos los datos desde el backend:
   - Transacciones
   - Fondos de ahorro
   - Transacciones de ahorro
   - Categorías

2. **Estado Global**: `TransactionContext` maneja el estado global de:
   - Transacciones
   - Fondos de ahorro
   - Transacciones de ahorro
   - Categorías

3. **Sincronización**: Después de cada operación (crear, editar, eliminar), se recargan los datos desde el backend para mantener la sincronización.

## 🎨 Interfaz de Usuario

- **Diseño Moderno**: Interfaz oscura con gradientes y efectos de glassmorphism
- **Responsive**: Adaptable a dispositivos móviles, tablets y desktop
- **Multilenguaje**: Soporte para español e inglés
- **Feedback Visual**: Estados de carga, mensajes de error y confirmaciones

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Producción
npm run build        # Construye la aplicación para producción
npm run preview      # Previsualiza la build de producción

# Linting
npm run lint         # Ejecuta el linter para verificar código
```

## 📝 Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8000/api
```

**Nota**: Las variables de entorno en Vite deben comenzar con `VITE_` para ser accesibles en el código.

## 🔒 Seguridad

- Los tokens de autenticación se almacenan en `localStorage`
- Todas las peticiones autenticadas incluyen el token en el header `Authorization`
- El token se elimina al cerrar sesión
- Validación de formularios en el frontend y backend

## 📱 Compatibilidad

- Navegadores modernos (Chrome, Firefox, Safari, Edge)
- Responsive design para móviles y tablets
- Optimizado para diferentes tamaños de pantalla

## 🐛 Solución de Problemas

### Error de conexión con la API
- Verificar que el backend esté corriendo en `http://localhost:8000`
- Verificar la variable `VITE_API_URL` en el archivo `.env`

### Token no válido
- Cerrar sesión y volver a iniciar sesión
- Verificar que el token esté en `localStorage`

### Datos no se cargan
- Verificar la consola del navegador para errores
- Verificar que el token de autenticación sea válido

## 📄 Licencia

Este proyecto es privado y de uso personal.

## 👨‍💻 Autor

Desarrollado para control y gestión de finanzas personales.
