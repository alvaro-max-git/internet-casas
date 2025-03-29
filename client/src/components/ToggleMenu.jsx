// src/components/ToggleMenu.jsx
import React from 'react';
import { FaBars, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/api';
import styles from './ToggleMenu.module.css';
import { notifyLogoutSuccess, notifyLogoutError } from '../utils/notifications';

function ToggleMenu({ menuOpen, toggleMenu }) {
  const navigate = useNavigate();

  // Manejador para cerrar sesión
  const handleLogout = async () => {
    try {
      await logout();
      notifyLogoutSuccess();
    } catch (err) {
      console.warn('Error al cerrar sesión:', err);
      notifyLogoutError();
    }
    localStorage.removeItem('sessionToken');
    navigate('/register');
  };

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
            <div className={styles.menuItem} onClick={handleLogout}>
              <FaSignOutAlt className={styles.icon} />
              <span>Cerrar sesión</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ToggleMenu;