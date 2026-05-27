import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const posts = await prisma.forumPost.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, name: true } },
      course: { select: { id: true, slug: true, title: true } },
      _count: { select: { replies: true } },
    },
  });
  res.json(posts);
});

router.get('/course/:slug', async (req: Request, res: Response): Promise<void> => {
  const course = await prisma.course.findUnique({ where: { slug: req.params.slug } });
  if (!course) {
    res.status(404).json({ error: 'Curso no encontrado' });
    return;
  }

  const posts = await prisma.forumPost.findMany({
    where: { courseId: course.id },
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, name: true } },
      _count: { select: { replies: true } },
    },
  });
  res.json(posts);
});

router.get('/:postId', async (req: Request, res: Response): Promise<void> => {
  const post = await prisma.forumPost.findUnique({
    where: { id: parseInt(req.params.postId) },
    include: {
      user: { select: { id: true, name: true } },
      course: { select: { id: true, slug: true, title: true } },
      replies: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!post) {
    res.status(404).json({ error: 'Post no encontrado' });
    return;
  }

  res.json(post);
});

router.post('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { courseSlug, title, body } = req.body;
  if (!courseSlug || !title || !body) {
    res.status(400).json({ error: 'Curso, título y contenido son requeridos' });
    return;
  }

  const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
  if (!course) {
    res.status(404).json({ error: 'Curso no encontrado' });
    return;
  }

  const post = await prisma.forumPost.create({
    data: { userId: req.userId!, courseId: course.id, title, body },
    include: { user: { select: { id: true, name: true } } },
  });

  res.status(201).json(post);
});

router.post('/:postId/replies', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { body } = req.body;
  if (!body) {
    res.status(400).json({ error: 'El contenido es requerido' });
    return;
  }

  const post = await prisma.forumPost.findUnique({ where: { id: parseInt(req.params.postId) } });
  if (!post) {
    res.status(404).json({ error: 'Post no encontrado' });
    return;
  }

  const reply = await prisma.forumReply.create({
    data: { postId: post.id, userId: req.userId!, body },
    include: { user: { select: { id: true, name: true } } },
  });

  res.status(201).json(reply);
});

export default router;
