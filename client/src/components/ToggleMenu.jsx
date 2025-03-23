// src/components/ToggleMenu.jsx
import React from 'react';
import {  FaBars, FaUser, FaCog, FaQuestionCircle } from 'react-icons/fa';
import styles from './ToggleMenu.module.css'; // Aquí puedes definir los estilos del menú

function ToggleMenu({ menuOpen, toggleMenu }) {
  return (
    <div>
        {/* Icono hamburguesa (siempre visible) */}
      <FaBars
        className={styles.hamburgerIcon}
        onClick={() => toggleMenu(true)}
      />
      {/* Menú flotante */}
      {menuOpen && (
        <div className={styles.overlay} onClick={() => toggleMenu(false)}>
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
    </div>
  );
}

export default ToggleMenu;