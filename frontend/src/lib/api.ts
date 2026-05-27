// En desarrollo usa el proxy de Vite (/api → localhost:3001).
// En producción (Vercel) define VITE_API_BASE_URL=https://tu-backend.onrender.com/api
const BASE: string = import.meta.env.VITE_API_BASE_URL ?? '/api';

function getToken() {
  return localStorage.getItem('ay_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error de red' }));
    throw new Error(err.error ?? 'Error desconocido');
  }
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
};

// Types
export interface Course {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  durationWeeks: number;
  imageUrl: string | null;
  order: number;
  _count?: { lessons: number };
  lessons?: Lesson[];
}

export interface Lesson {
  id: number;
  courseId: number;
  order: number;
  title: string;
  description: string | null;
  content: string | null;
  isPractical: boolean;
}

export interface ForumPost {
  id: number;
  title: string;
  body: string;
  createdAt: string;
  user: { id: number; name: string };
  course: { id: number; slug: string; title: string };
  _count?: { replies: number };
  replies?: ForumReply[];
}

export interface ForumReply {
  id: number;
  body: string;
  createdAt: string;
  user: { id: number; name: string };
}

export interface User {
  id: number;
  dni: string;
  name: string;
  language: string;
  role: string;
  tutorialDone: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Stats {
  totalUsers: number;
  totalCourses: number;
  totalLessonsCompleted: number;
  totalPosts: number;
  communities: number;
  languages: string[];
}

export interface Progress {
  completedLessons: number[];
  totalLessons: number;
  percentage: number;
}
