import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const [totalUsers, totalCourses, totalLessonsCompleted, totalPosts] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.userProgress.count(),
    prisma.forumPost.count(),
  ]);

  res.json({
    totalUsers,
    totalCourses,
    totalLessonsCompleted,
    totalPosts,
    communities: 12,
    languages: ['Español', 'Quechua', 'Aymara', 'Shipibo-Konibo'],
  });
});

export default router;
