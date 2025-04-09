import { Routes, Route } from 'react-router-dom';

// Splash y login/registro
import SplashScreen from './pages/SplashScreen';
import Register from './pages/Register';

// Cliente
import ClientHome from './pages/ClientHome';
import BluetoothSearch from './pages/BluetoothSearch';

// Admin
import AdminHome from './pages/AdminHome';
import EditAccessForm from './pages/admin/EditAccessForm';
import NewAccessForm from './pages/admin/NewAccessForm';
import CalendarAuth from './pages/admin/CalendarAuth';
import AdminLogs from './pages/admin/AdminLogs';
import MyLocks from './pages/admin/MyLocks';
import AccessLoader from './pages/AccessLoader';

// Legacy (por si los sigues usando)
import Home from './pages/Home';
import LockOpened from './pages/LockOpened';

function AppRouter() {
  return (
    <Routes>
      {/* Página inicial */}
      <Route path="/" element={<SplashScreen />} />

      {/* Registro/Login */}
      <Route path="/register" element={<Register />} />

      {/* === CLIENTE === */}
      <Route path="/client/access-loader" element={<AccessLoader />} />
      <Route path="/client/home" element={<ClientHome />} />
      <Route path="/client/scan" element={<BluetoothSearch />} />
      <Route path="/client/access/:accessId/open" element={<LockOpened />} />

      {/* === ADMINISTRADOR === */}
      <Route path="/admin/home" element={<AdminHome />} />
      <Route path="/admin/locks" element={<MyLocks />} />
      <Route path="/admin/access/:accessId/edit" element={<EditAccessForm />} />
      <Route path="/admin/access/new" element={<NewAccessForm />} />
      <Route path="admin/calendar-auth" element={<CalendarAuth />} />
      <Route path="/admin/logs" element={<AdminLogs />} />
     

      {/* === LEGACY (LockMenu, etc.) === */}
    
      

      {/* Fallback por si no encuentra ruta */}
      <Route path="*" element={<SplashScreen />} />
    </Routes>
  );
}

export default AppRouter;