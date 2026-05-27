import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const courses = await prisma.course.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { lessons: true } } },
  });
  res.json(courses);
});

router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  const course = await prisma.course.findUnique({
    where: { slug: req.params.slug },
    include: {
      lessons: { orderBy: { order: 'asc' } },
      _count: { select: { lessons: true } },
    },
  });

  if (!course) {
    res.status(404).json({ error: 'Curso no encontrado' });
    return;
  }

  res.json(course);
});

router.get('/:slug/progress', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const course = await prisma.course.findUnique({ where: { slug: req.params.slug } });
  if (!course) {
    res.status(404).json({ error: 'Curso no encontrado' });
    return;
  }

  const completedLessons = await prisma.userProgress.findMany({
    where: { userId: req.userId!, courseId: course.id },
    select: { lessonId: true },
  });

  const totalLessons = await prisma.lesson.count({ where: { courseId: course.id } });
  const completedIds = completedLessons.map((p) => p.lessonId);
  const percentage = totalLessons > 0 ? Math.round((completedIds.length / totalLessons) * 100) : 0;

  res.json({ completedLessons: completedIds, totalLessons, percentage });
});

router.post('/:slug/lessons/:lessonId/complete', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const course = await prisma.course.findUnique({ where: { slug: req.params.slug } });
  if (!course) {
    res.status(404).json({ error: 'Curso no encontrado' });
    return;
  }

  const lessonId = parseInt(req.params.lessonId);
  const lesson = await prisma.lesson.findFirst({ where: { id: lessonId, courseId: course.id } });
  if (!lesson) {
    res.status(404).json({ error: 'Lección no encontrada' });
    return;
  }

  await prisma.userProgress.upsert({
    where: { userId_lessonId: { userId: req.userId!, lessonId } },
    update: {},
    create: { userId: req.userId!, courseId: course.id, lessonId },
  });

  res.json({ success: true, message: '¡Lección completada!' });
});

export default router;
