// src/pages/LockOpened.jsx
import React, { useState } from 'react';
import styles from './LockOpened.module.css';
import BackButton from '../components/BackButton';
import ToggleMenu from '../components/ToggleMenu';
import { useLocation } from 'react-router-dom';
import cerradura_abierta from '../assets/cerradura_abierta.png';

function LockOpened() {
  const { state } = useLocation();
  const { lock } = state || {};

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = (open) => setMenuOpen(open);

  return (
    <div className={styles.container}>
      {/* NAV */}
      <div className={styles.navContainer}>
        <BackButton to="/client/home" />
        <ToggleMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
      </div>

      {/* Imagen */}
      <div className={styles.lockIconContainer}>
        <img
          src={cerradura_abierta}
          alt="Lock Opened"
          className={styles.greenLockIcon}
        />
      </div>

      {/* Nombre de la cerradura */}
      <h2 className={styles.openText}>
        Cerradura: <span className={styles.lockName}>{lock?.name || 'Desconocida'}</span>
      </h2>

      {/* Estado */}
      <p className={styles.statusText}>
        Estado actual:{" "}
        {lock?.locked === null
          ? "Cargando..."
          : lock?.locked
          ? "🔒 Cerrada"
          : "🔓 Abierta"}
      </p>
    </div>
  );
}

export default LockOpened;