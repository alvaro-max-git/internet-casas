// src/pages/ClientHome.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import styles from './ClientHome.module.css';
import ToggleMenu from '../components/ToggleMenu';

function ClientHome() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Lógica para botón de "Rastrear Dispositivos"
  const handleScanDevices = () => {
    navigate('/client/scan');
  };

  // Lógica para botón de "Abrir Cerradura"
  const handleOpenLock = () => {
    navigate('/client/lockopen'); // Abrir cerradura
  };

  const handleDelete = (accessId) => {
    const confirmDelete = window.confirm('¿Estás seguro de que quieres borrar este acceso?');
    if (confirmDelete) {
      const updated = accesses.filter((a) => a.id !== accessId);
      setAccesses(updated);
    }
  };

  const toggleMenu = (open) => {
    setMenuOpen(open);
  };

  return (
    <div className={styles.container}>
       {/* === Contenedor de NAV (BackButton + ToggleMenu) === */}
       <div className={styles.navContainer}>
        <BackButton to="/register" className={styles.backButtonCustom} />
        <ToggleMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
      </div>

      
    <div className={styles.mainContent}>
      <h1 className={styles.greeting}>Hola, Cliente</h1>
      <p className={styles.subtitle}>¿Quieres abrir una cerradura?</p>

      <button className={styles.scanButton} onClick={handleScanDevices}>
        Rastrear Dispositivos
      </button>
    </div>
    </div>
  );
}

export default ClientHome;