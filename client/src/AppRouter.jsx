// src/AppRouter.jsx
import { Routes, Route } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen';
import Register from './pages/Register';
import Home from './pages/Home';
import LockMenu from './pages/LockMenu';
import LockOpened from './pages/LockOpened';

function AppRouter() {
  return (
    <Routes>
      {/* Ruta raíz -> Splash Screen */}
      <Route path="/" element={<SplashScreen />} />

      {/* Registro / Login */}
      <Route path="/register" element={<Register />} />

      {/* Home del usuario */}
      <Route path="/home" element={<Home />} />

      {/* Menú de cerradura */}
      <Route path="/lock/:lockId" element={<LockMenu />} />

      {/* Cerradura abierta */}
      <Route path="/lock/:lockId/open" element={<LockOpened />} />

      {/* Ruta por defecto (si no encuentra coincidencias) */}
      <Route path="*" element={<SplashScreen />} />
    </Routes>
  );
}

export default AppRouter;
