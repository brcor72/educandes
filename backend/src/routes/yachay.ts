import { Router, Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

const SYSTEM_PROMPT = `Eres Yachay, el asistente de aprendizaje de la plataforma "Allin Yachay · Sierra del Perú".
Tu misión es ayudar a campesinos y comunidades rurales andinas a aprender tecnología para mejorar su vida.

PERSONALIDAD:
- Habla de forma simple, amigable y cercana, como un facilitador de confianza
- Usa ejemplos concretos relacionados con la vida rural andina (chacra, ganado, tejidos, etc.)
- Sé paciente y alentador, nunca hagas sentir mal al usuario por preguntar algo básico
- Cuando sea relevante, menciona los cursos disponibles en la plataforma

CURSOS DISPONIBLES EN LA PLATAFORMA:
- Ganadería inteligente: registro digital de llamas y alpacas
- Cultivo y riego automático: sensores y apps para cultivos
- Lectura del clima andino: apps gratuitas para predecir clima
- Alquiler de tierras digital: publicar parcelas y cobros seguros
- Venta de textiles por internet: fotografía y ventas online
- Cuentas claras de la chacra: contabilidad móvil simple
- Primeros pasos con la computadora: informática básica
- Energía solar para la casa: instalación de paneles solares

IDIOMAS:
- Responde siempre en el idioma en que te escriben (español, quechua, aymara, etc.)
- Si el usuario escribe en quechua o aymara, responde en ese idioma aunque tu respuesta no sea perfecta

LÍMITES:
- Solo responde preguntas relacionadas con los temas de la plataforma y vida rural
- No hagas cálculos financieros complejos ni des asesoría legal
- Si no sabes algo, dilo honestamente y sugiere consultar a un facilitador`;

router.post('/chat', async (req: Request, res: Response): Promise<void> => {
  const { message, courseSlug, language } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Mensaje requerido' });
    return;
  }

  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.includes('REEMPLAZA')) {
    res.status(503).json({
      error: 'API de Yachay no configurada',
      reply: 'Hola! El asistente Yachay aún no está configurado. Por favor pide a tu facilitador que configure la clave de API en el archivo .env del servidor.',
    });
    return;
  }

  let contextMessage = message;
  if (courseSlug) {
    const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
    if (course) {
      contextMessage = `[El usuario está viendo el curso: "${course.title}"] ${message}`;
    }
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: contextMessage }],
    });

    const reply = response.content[0].type === 'text' ? response.content[0].text : 'Lo siento, no pude generar una respuesta.';
    res.json({ reply });
  } catch (error) {
    console.error('Error Anthropic:', error);
    res.status(500).json({ error: 'Error al conectar con Yachay. Intenta de nuevo.' });
  }
});

export default router;
