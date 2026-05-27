import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import coursesRoutes from './routes/courses';
import forumsRoutes from './routes/forums';
import yachayRoutes from './routes/yachay';
import statsRoutes from './routes/stats';
import profileRoutes from './routes/profile';

const app = express();
const PORT = process.env.PORT ?? 3001;

// CORS: permite cualquier origen en producción (usamos JWT, no cookies)
// Para restringir: definir CORS_ORIGIN="https://educandes.vercel.app" en las env vars
const allowedOrigins =
  process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
    : null;

app.use(
  cors({
    origin: allowedOrigins ?? '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
  }),
);
// Responder preflight OPTIONS en todas las rutas
app.options('*', cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/forums', forumsRoutes);
app.use('/api/yachay', yachayRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/profile', profileRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: '🏔️ EducAndes API funcionando' });
});

app.listen(PORT, () => {
  console.log(`\n🏔️  EducAndes Backend corriendo en http://localhost:${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api/health\n`);
});
