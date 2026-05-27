import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Validación de contraseña: mín 8 chars, 1 mayúscula, 1 número, 1 carácter especial
function validatePassword(password: string): string | null {
  if (password.length < 8) return 'La contraseña debe tener mínimo 8 caracteres';
  if (!/[A-Z]/.test(password)) return 'La contraseña debe tener al menos 1 mayúscula';
  if (!/[0-9]/.test(password)) return 'La contraseña debe tener al menos 1 número';
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return 'La contraseña debe tener al menos 1 carácter especial (!@#$%...)';
  return null;
}

// Validación de DNI: exactamente 8 dígitos numéricos
function validateDNI(dni: string): string | null {
  if (!/^\d{8}$/.test(dni)) return 'El DNI debe tener exactamente 8 números';
  return null;
}

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { dni, name, password, language, community, phone } = req.body;

  if (!dni || !name || !password) {
    res.status(400).json({ error: 'DNI, nombre y contraseña son requeridos' });
    return;
  }

  const dniError = validateDNI(dni);
  if (dniError) { res.status(400).json({ error: dniError }); return; }

  const passError = validatePassword(password);
  if (passError) { res.status(400).json({ error: passError }); return; }

  const existing = await prisma.user.findUnique({ where: { dni } });
  if (existing) {
    res.status(409).json({ error: 'Ya existe una cuenta con ese DNI' });
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { dni, name, password: hashed, language: language ?? 'es', community, phone },
  });

  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '7d' });

  res.status(201).json({
    token,
    user: { id: user.id, dni: user.dni, name: user.name, language: user.language, role: user.role, tutorialDone: user.tutorialDone },
  });
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { dni, password } = req.body;

  if (!dni || !password) {
    res.status(400).json({ error: 'DNI y contraseña son requeridos' });
    return;
  }

  const dniError = validateDNI(dni);
  if (dniError) { res.status(400).json({ error: dniError }); return; }

  const user = await prisma.user.findUnique({ where: { dni } });
  if (!user) { res.status(401).json({ error: 'DNI o contraseña incorrectos' }); return; }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) { res.status(401).json({ error: 'DNI o contraseña incorrectos' }); return; }

  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '7d' });

  res.json({
    token,
    user: { id: user.id, dni: user.dni, name: user.name, language: user.language, role: user.role, tutorialDone: user.tutorialDone },
  });
});

export default router;
