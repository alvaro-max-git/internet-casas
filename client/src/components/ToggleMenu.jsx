import React from 'react';
import { FaBars, FaCog, FaSignOutAlt, FaLock, FaCalendarAlt, FaHistory } from 'react-icons/fa'; // 🆕 FaHistory
import  { useNavigate } from 'react-router-dom';
import { logout } from '../services/api';
import styles from './ToggleMenu.module.css';
import { notifyLogoutSuccess, notifyLogoutError } from '../utils/notifications';

function ToggleMenu({ menuOpen, toggleMenu }) {
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType');

  const handleLogout = async () => {
    try {
      await logout();
      notifyLogoutSuccess();
    } catch (err) {
      console.warn('Error al cerrar sesión:', err);
      notifyLogoutError();
    }
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('userType');
    navigate('/register');
  };

  const handleGoToLocks = () => {
    navigate('/admin/locks');
  };

  const handleGoToCalendar = () => {
    navigate('/admin/calendar-auth');
  };

  const handleGoToLogs = () => {
    navigate('/admin/logs');
  };
  return (
    <div>
      <FaBars id="menu-hamburguesa" className={styles.hamburgerIcon} onClick={() => toggleMenu(true)} />
      {menuOpen && (
        <div className={styles.overlay} onClick={() => toggleMenu(false)}>
          <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
            {userType === 'host' && (
              <>
                <div id="menu-mis-cerraduras" className={styles.menuItem} onClick={handleGoToLocks}>
                  <FaLock className={styles.icon} />
                  <span>Mis cerraduras</span>
                </div>

                <div id="menu-google-calendar" className={styles.menuItem} onClick={handleGoToCalendar}>
                  <FaCalendarAlt className={styles.icon} />
                  <span>Google Calendar</span>
                </div>

                <div id="menu-historial-accesos" className={styles.menuItem} onClick={handleGoToLogs}>
                  <FaHistory className={styles.icon} />
                  <span>Historial de accesos</span>
                </div>
              </>
            )}
            {/* <div className={styles.menuItem}>
              <FaCog className={styles.icon} />
              <span>Configuración</span>
            </div> */}
            <div id="menu-cerrar-sesion" className={styles.menuItem2} onClick={handleLogout}>
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