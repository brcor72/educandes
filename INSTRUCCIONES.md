# 🌄 Allin Yachay · Sierra del Perú — Guía de instalación

## ¿Qué es esto?
Plataforma educativa de tecnología para comunidades andinas rurales.
Cursos gratuitos en Español, Quechua, Aymara y Shipibo-Konibo.

---

## Cómo iniciar el proyecto

### Paso 1: Inicia el Backend (API + Base de datos)
Haz doble clic en: **`iniciar-backend.bat`**

Debes ver algo así:
```
🌄 Allin Yachay Backend corriendo en http://localhost:3001
```
**⚠️ Deja esta ventana abierta.**

### Paso 2: Inicia el Frontend (Página web)
Haz doble clic en: **`iniciar-frontend.bat`**

Debes ver algo así:
```
VITE v6.x.x  ready in XXX ms
➜  Local:   http://localhost:5173/
```
**⚠️ Deja esta ventana abierta también.**

### Paso 3: Abre el navegador
Ve a: **http://localhost:5173**

---

## Usuarios de prueba

| Tipo | Email | Contraseña |
|------|-------|-----------|
| Estudiante demo | demo@allin-yachay.pe | demo1234 |
| Facilitador | facilitador@allin-yachay.pe | facilitador123 |

---

## Configurar el asistente Yachay (Claude API) 🤖

1. Obtén tu API key en: https://console.anthropic.com
2. Abre el archivo `backend/.env`
3. Reemplaza la línea:
   ```
   ANTHROPIC_API_KEY="sk-ant-REEMPLAZA-CON-TU-API-KEY"
   ```
   con tu key real:
   ```
   ANTHROPIC_API_KEY="sk-ant-api03-..."
   ```
4. Reinicia el backend

---

## Estructura del proyecto

```
PFC3/
├── backend/              ← API REST (Node.js + Express + Prisma)
│   ├── prisma/
│   │   ├── dev.db        ← Base de datos SQLite (se crea automático)
│   │   ├── schema.prisma ← Definición de tablas
│   │   └── seed.ts       ← Datos iniciales
│   ├── src/
│   │   ├── routes/       ← Endpoints de la API
│   │   │   ├── auth.ts       (login, registro)
│   │   │   ├── courses.ts    (cursos y lecciones)
│   │   │   ├── forums.ts     (foros y respuestas)
│   │   │   ├── yachay.ts     (asistente IA)
│   │   │   └── stats.ts      (estadísticas)
│   │   ├── middleware/auth.ts ← Verificación JWT
│   │   └── index.ts      ← Servidor principal
│   └── .env              ← Variables de entorno (API key aquí)
│
└── frontend/             ← Interfaz web (React + Vite + Tailwind)
    └── src/
        ├── pages/        ← Páginas de la app
        │   ├── Home.tsx       (página principal)
        │   ├── Cursos.tsx     (catálogo de cursos)
        │   ├── CursoDetalle.tsx (curso con lecciones)
        │   ├── Auth.tsx       (login / registro)
        │   ├── Foros.tsx      (lista de foros)
        │   ├── ForoDetalle.tsx (post con respuestas)
        │   └── Metas.tsx      (objetivos y estadísticas)
        ├── components/
        │   ├── Navbar.tsx     (barra de navegación)
        │   ├── CourseCard.tsx (tarjeta de curso)
        │   └── YachayChat.tsx (chat con IA flotante)
        └── lib/api.ts     ← Cliente para la API
```

---

## Tecnologías usadas

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Estilos | Tailwind CSS (paleta andina) |
| Backend | Node.js + Express |
| ORM | Prisma |
| Base de datos | SQLite (archivo local) |
| Autenticación | JWT (JSON Web Tokens) |
| IA (Yachay) | Claude API (Anthropic) |

---

## Cursos disponibles

| # | Curso | Categoría | Nivel |
|---|-------|-----------|-------|
| 1 | Ganadería inteligente | Vida en el campo | Inicial |
| 2 | Cultivo y riego automático | Vida en el campo | Intermedio |
| 3 | Lectura del clima andino | Vida en el campo | Inicial |
| 4 | Alquiler de tierras digital | Negocio y dinero | Inicial |
| 5 | Venta de textiles por internet | Negocio y dinero | Inicial |
| 6 | Cuentas claras de la chacra | Negocio y dinero | Inicial |
| 7 | Primeros pasos con la computadora | Primeros pasos | Inicial |
| 8 | Energía solar para la casa | Energía y recursos | Intermedio |
