import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/profile — perfil del usuario actual
router.get('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId! },
    select: { id: true, dni: true, name: true, language: true, community: true, phone: true, role: true, tutorialDone: true, createdAt: true },
  });
  if (!user) { res.status(404).json({ error: 'Usuario no encontrado' }); return; }

  const progressCount = await prisma.userProgress.count({ where: { userId: req.userId! } });
  const postsCount = await prisma.forumPost.count({ where: { userId: req.userId! } });

  res.json({ ...user, stats: { lessonsCompleted: progressCount, posts: postsCount } });
});

// PUT /api/profile — actualizar datos básicos
router.put('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, language, community, phone } = req.body;

  const updated = await prisma.user.update({
    where: { id: req.userId! },
    data: {
      ...(name && { name }),
      ...(language && { language }),
      ...(community !== undefined && { community }),
      ...(phone !== undefined && { phone }),
    },
    select: { id: true, dni: true, name: true, language: true, community: true, phone: true, role: true, tutorialDone: true },
  });

  res.json({ user: updated });
});

// PUT /api/profile/password — cambiar contraseña
router.put('/password', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) { res.status(400).json({ error: 'Contraseña actual y nueva son requeridas' }); return; }

  const user = await prisma.user.findUnique({ where: { id: req.userId! } });
  if (!user) { res.status(404).json({ error: 'Usuario no encontrado' }); return; }

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) { res.status(400).json({ error: 'Contraseña actual incorrecta' }); return; }

  if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword)) {
    res.status(400).json({ error: 'La nueva contraseña no cumple los requisitos mínimos' }); return;
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: req.userId! }, data: { password: hashed } });
  res.json({ message: 'Contraseña actualizada correctamente' });
});

// POST /api/profile/tutorial-done — marcar tutorial como completado
router.post('/tutorial-done', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  await prisma.user.update({ where: { id: req.userId! }, data: { tutorialDone: true } });
  res.json({ success: true });
});

export default router;
