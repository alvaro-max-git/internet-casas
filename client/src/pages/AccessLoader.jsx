// src/pages/client/AccessLoader.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AccessLoader.module.css';
import {
  getAccessesByToken,
  getCurrentUser,
  updateAccess
} from '../services/api';
import BackButton from '../components/BackButton';
import ToggleMenu from '../components/ToggleMenu';
import {
  notifyAccessLinked,
  notifyAccessLinkError
} from '../utils/notifications';
function AccessLoader() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = (open) => setMenuOpen(open);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);

    try {
      const accesses = await getAccessesByToken(input);
      const access = accesses[0];

      const user = await getCurrentUser();

      await updateAccess(access.id, {
        usuario: user.email,  // Solo queremos modificar este campo
      });
      notifyAccessLinked();
      // No guardamos nada en localStorage: simplemente navegamos
      navigate('/client/home');
    } catch (error) {
      console.error('❌ Error al asociar acceso con el usuario:', error);
      notifyAccessLinkError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.background}>
    <div className={styles.container}>
      {/* NAV */}
      <div className={styles.navContainer}>
        <BackButton to="/client/home" className={styles.backButtonCustom} />
        <ToggleMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
      </div>

      <div className={styles.mainContent}>
        <h1 className={styles.greeting}>Hola Usuario</h1>
        <h2 className={styles.subtitle}>
          Introduzca token para agregar acceso
        </h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Token"
            className={styles.input}
          />
          <button type="submit" className={styles.entrarButton} disabled={loading}>
            {loading ? 'Buscando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}

export default AccessLoader;