import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Mountain, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLang } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLang();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  function handleLogout() {
    logout();
    navigate('/');
    setOpen(false);
  }

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className={`font-medium transition-colors ${
        isActive(to)
          ? 'text-andean-200 border-b-2 border-andean-200'
          : 'hover:text-andean-200'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-andean-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo — EducAndes */}
          <Link to="/" className="flex items-center gap-2 font-bold text-lg hover:text-andean-200 transition-colors">
            <Mountain className="w-7 h-7 text-andean-200" />
            <span className="hidden sm:block tracking-tight">EducAndes</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLink('/cursos', t('nav', 'courses'))}
            {navLink('/foros', t('nav', 'forums'))}
            {navLink('/metas', t('nav', 'goals'))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher variant="navbar" />

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/perfil"
                  className="flex items-center gap-1.5 text-sm text-andean-200 hover:text-white transition-colors"
                >
                  <UserCircle className="w-5 h-5" />
                  <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm bg-earth-600 hover:bg-earth-700 px-3 py-1.5 rounded-full transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {t('nav', 'logout')}
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-forest-600 hover:bg-forest-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
              >
                {t('nav', 'login')}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-andean-600 transition-colors">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-andean-800 border-t border-andean-600 px-4 pb-4 space-y-2">
          <Link to="/cursos" onClick={() => setOpen(false)} className="block py-2.5 font-medium hover:text-andean-200 transition-colors">{t('nav', 'courses')}</Link>
          <Link to="/foros" onClick={() => setOpen(false)} className="block py-2.5 font-medium hover:text-andean-200 transition-colors">{t('nav', 'forums')}</Link>
          <Link to="/metas" onClick={() => setOpen(false)} className="block py-2.5 font-medium hover:text-andean-200 transition-colors">{t('nav', 'goals')}</Link>
          <div className="border-t border-andean-600 pt-3">
            <LanguageSwitcher variant="navbar" />
          </div>
          <div className="border-t border-andean-600 pt-2">
            {user ? (
              <>
                <Link to="/perfil" onClick={() => setOpen(false)} className="flex items-center gap-2 py-2 text-andean-200 hover:text-white transition-colors">
                  <UserCircle className="w-5 h-5" /> {t('nav', 'profile')}
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 py-2 text-earth-300 hover:text-earth-200 transition-colors">
                  <LogOut className="w-4 h-4" /> {t('nav', 'logout')}
                </button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)} className="block py-2.5 text-forest-300 font-medium">{t('nav', 'login')}</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
