import { useState, useEffect, useCallback } from 'react';
import { User } from '../lib/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('ay_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('ay_user');
        localStorage.removeItem('ay_token');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((user: User, token: string) => {
    localStorage.setItem('ay_token', token);
    localStorage.setItem('ay_user', JSON.stringify(user));
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ay_token');
    localStorage.removeItem('ay_user');
    setUser(null);
  }, []);

  return { user, loading, login, logout, isAuth: !!user };
}
