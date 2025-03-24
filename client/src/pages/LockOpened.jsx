
// src/pages/LockOpened.jsx
import React, { useState } from 'react';
import styles from './LockOpened.module.css';
import BackButton from '../components/BackButton';
import ToggleMenu from '../components/ToggleMenu';

// Icono de cerradura abierta
import greenLockIcon from '../assets/green-lock.png';


// React Icons para el submenú
import {
  FaMapMarkerAlt,
  FaQuestionCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

function LockOpened() {
  const [menuOpen, setMenuOpen] = useState(false);

  

  const toggleMenu = (open) => {
    setMenuOpen(open);
  };


  return (
    <div className={styles.container}>
       {/* === Contenedor de NAV (BackButton + ToggleMenu) === */}
       <div className={styles.navContainer}>
        <BackButton to="/client/home" className={styles.backButtonCustom} />
        <ToggleMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
      </div>


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


