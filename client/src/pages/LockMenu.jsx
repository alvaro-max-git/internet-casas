// src/pages/LockMenu.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './LockMenu.module.css';

// Iconos (puedes cambiarlos según tus preferencias)
import hamburgerIcon from '../assets/hamburger-icon.png';
import bluetoothIcon from '../assets/bluetooth-green.png';
import IoHIcon from '../assets/IoH-icon.png';

import { FaUser, FaCog } from 'react-icons/fa';

// React Icons para el submenú
import { FaMapMarkerAlt, FaArrowLeft, FaQuestionCircle, FaExclamationTriangle } from 'react-icons/fa';

function LockMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { lockId } = useParams();  // si deseas capturar el ID de la cerradura
  const navigate = useNavigate();

  // Alterna el menú hamburguesa
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Lógica para "Abrir" la cerradura (happy path)
  const handleOpenLock = () => {
    // Aquí iría la llamada a la API (Seam).
    // Por ahora, simulamos y navegamos a /lock/:id/open
    navigate(`/lock/${lockId}/open`);
  };

  // Vuelve al menú del usuario
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

      {/* Indicación de que la cerradura está detectada vía Bluetooth */}
      <div className={styles.bluetoothContainer}>
        <img
          src={bluetoothIcon}
          alt="Bluetooth icon"
          className={styles.bluetoothIcon}
        />
        <span className={styles.detectedText}>Cerradura detectada</span>
      </div>

      {/* Cuadrado grande con el icono y texto "Abrir" */}
      <div className={styles.lockContainer} onClick={handleOpenLock}>
        <img src={IoHIcon} alt="Lock icon" className={styles.lockIcon} />
        <span className={styles.openText}>Abrir</span>
      </div>

      {/* Detalles de la cerradura (dirección, horarios) */}
      <div className={styles.lockDetails}>
        <h2>Calle Falsa 123 3ª A</h2>
        <p>Desde: Viernes 14/03/25 16:00</p>
        <p>Hasta: Domingo 16/03/25 12:00</p>
      </div>

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

export default LockMenu;

