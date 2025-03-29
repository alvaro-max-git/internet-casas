// src/pages/client/AccessLoader.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AccessLoader.module.css';
import { getAccessesByToken} from '../services/api';
import BackButton from '../components/BackButton';
import ToggleMenu from '../components/ToggleMenu';

function AccessLoader() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
    // Para abrir/cerrar menú hamburguesa
    const toggleMenu = (open) => setMenuOpen(open);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      const accesses = await getAccessesByToken(input);
      localStorage.setItem('clientAccesses', JSON.stringify(accesses));
      navigate('/client/home');
    } catch (error) {
      console.error('Error al obtener accesos:', error);
      alert('❌ No se encontraron accesos válidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
        {/* Menú superior (BackButton + ToggleMenu) */}
      <div className={styles.navContainer}>
        <BackButton to="/register" className={styles.backButtonCustom} />
        <ToggleMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
      </div>
      <div className={styles.mainContent}>
        <h1 className={styles.greeting}>Hola Usuario</h1>
        <h2 className={styles.subtitle}>Introduzca token o email para ver sus accesos</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Token o email"
          className={styles.input}
        />
        <button type="submit" className={styles.entrarButton} disabled={loading}>
          {loading ? 'Buscando...' : 'Entrar'}
        </button>
      </form>
      </div>
    </div>
  );
}

export default AccessLoader;
