import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Tutorial from './components/Tutorial';
import YachayChat from './components/YachayChat';
import Home from './pages/Home';
import Cursos from './pages/Cursos';
import CursoDetalle from './pages/CursoDetalle';
import Foros from './pages/Foros';
import ForoDetalle from './pages/ForoDetalle';
import Metas from './pages/Metas';
import Auth from './pages/Auth';
import Perfil from './pages/Perfil';
import { useAuth } from './hooks/useAuth';

// Tutorial controller — muestra el tutorial la primera vez que ingresa el usuario
function TutorialController() {
  const { user } = useAuth();
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (user && !user.tutorialDone) {
      // Pequeño delay para que la página cargue primero
      const t = setTimeout(() => setShowTutorial(true), 800);
      return () => clearTimeout(t);
    }
  }, [user]);

  if (!showTutorial) return null;
  return <Tutorial onComplete={() => setShowTutorial(false)} />;
}

function AppLayout() {
  return (
    <>
      <Navbar />
      <TutorialController />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/curso/:slug" element={<CursoDetalle />} />
          <Route path="/foros" element={<Foros />} />
          <Route path="/foros/:id" element={<ForoDetalle />} />
          <Route path="/metas" element={<Metas />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-stone-400">
              <p className="text-6xl mb-4">🏔️</p>
              <p className="text-xl font-medium text-stone-600 mb-2">Página no encontrada</p>
              <a href="/" className="text-andean-600 hover:underline mt-2">← Volver al inicio</a>
            </div>
          } />
        </Routes>
      </main>
      <YachayChat />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<AppLayout />} />
          </Routes>
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}
