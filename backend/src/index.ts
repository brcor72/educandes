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

// En producción, CORS_ORIGIN puede ser una lista separada por comas
// p.ej. "https://educandes.vercel.app,https://educandes-staging.vercel.app"
const corsOrigins: string | string[] | boolean =
  process.env.NODE_ENV === 'production'
    ? process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
      : true          // true = refleja el origin, acepta cualquiera (útil al desplegar)
    : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({ origin: corsOrigins }));
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
