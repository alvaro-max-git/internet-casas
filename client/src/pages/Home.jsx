// src/pages/Home.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import { FaUser, FaCog, FaQuestionCircle } from 'react-icons/fa';

/* Reemplaza con tus iconos */
import lockIcon from '../assets/IoH-lockiconusermenu.png';
import hamburgerIcon from '../assets/hamburger-icon.png';

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLockClick = (lockId) => {
    // Navega al menú de la cerradura
    navigate(`/lock/${lockId}`);
  };

  // Para mostrar/ocultar el menú flotante
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className={styles.container}>
      {/* Cabecera con el ícono de menú (hamburguesa) */}
      <header className={styles.header}>
        <img
          src={hamburgerIcon}
          alt="Menu"
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

      {/* Contenido principal */}
      <div className={styles.greeting}>
        <h1>Hola, Daniel</h1>
      </div>

      <div className={styles.subtitle}>Accesos activos</div>

      <div className={styles.accessList}>
        {/* Ejemplo: dos tarjetas con colores distintos */}
        <div
          className={styles.accessCard}
          style={{ backgroundColor: "#FFE5BD" }}
          onClick={() => handleLockClick("portal")}
        >
          <img src={lockIcon} alt="Lock" className={styles.lockIcon} />
          <p>Calle Falsa 123 Portal</p>
        </div>

        <div
          className={styles.accessCard}
          style={{ backgroundColor: "#DBD2DA" }}
          onClick={() => handleLockClick("3A")}
        >
          <img src={lockIcon} alt="Lock" className={styles.lockIcon} />
          <p>Calle Falsa 123 3ªA</p>
        </div>

        {/* Puedes añadir más tarjetas si deseas */}
      </div>
    </div>
  );
}

export default Home;
