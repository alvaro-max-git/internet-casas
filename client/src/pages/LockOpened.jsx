
// src/pages/LockOpened.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './LockOpened.module.css';

// Iconos
import hamburgerIcon from '../assets/hamburger-icon.png';
import greenLockIcon from '../assets/green-lock.png';

import { FaUser, FaCog } from 'react-icons/fa';

// React Icons para el submenú
import {
  FaMapMarkerAlt,
  FaArrowLeft,
  FaQuestionCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

function LockOpened() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { lockId } = useParams(); // si necesitas el id de la cerradura
  const navigate = useNavigate();

  // Alterna el menú hamburguesa
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Ejemplo: si quieres que "Volver" lleve al menú de usuario
  const handleBack = () => {
    navigate('/home');
  };

  return (
    <div className={styles.container}>
      {/* Cabecera con el icono de menú */}
      <header className={styles.header}>
        <img
          src={hamburgerIcon}
          alt="Menú"
          className={styles.hamburgerIcon}
          onClick={toggleMenu}
        />
      </header>

      {/* Menú flotante (overlay) */}
      {menuOpen && (
        <div className={styles.overlay} onClick={() => setMenuOpen(false)}>
          <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
            <div className={styles.menuItem}>
              <FaUser className={styles.icon} />
              <span>Mi cuenta</span>
            </div>

            <div className={styles.menuItem}>
              <FaCog className={styles.icon} />
              <span>Configuración</span>
            </div>

            <div className={styles.menuItem}>
              <FaQuestionCircle className={styles.icon} />
              <span>Ayuda</span>
            </div>
          </div>
        </div>
      )}

      {/* Icono grande de cerradura abierta */}
      <div className={styles.lockIconContainer}>
        <img
          src={greenLockIcon}
          alt="Lock Opened"
          className={styles.greenLockIcon}
        />
      </div>

      {/* Texto "Cerradura abierta" */}
      <h2 className={styles.openText}>Cerradura abierta</h2>

      {/* Submenú inferior con iconos y texto */}
      <div className={styles.actions}>
        <div className={styles.actionItem}>
          <FaMapMarkerAlt className={styles.actionIcon} />
          <span>Ver en el mapa</span>
        </div>

        <div className={styles.actionItem} onClick={handleBack}>
          <FaArrowLeft className={styles.actionIcon} />
          <span>Volver</span>
        </div>

        <div className={styles.actionItem}>
          <FaQuestionCircle className={styles.actionIcon} />
          <span>Ayuda</span>
        </div>

        <div className={styles.actionItem}>
          <FaExclamationTriangle className={styles.actionIcon} />
          <span>¿Problemas?</span>
        </div>
      </div>
    </div>
  );
}

export default LockOpened;


/*
Menú antiguo:
  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>Cerradura {lockId} abierta</h1>
      <p>¡Has abierto la cerradura correctamente!</p>
      <button onClick={handleBackHome}>Volver al Home</button>
    </div>
  );
}

export default LockOpened;

*/