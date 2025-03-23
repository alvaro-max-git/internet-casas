// src/pages/AdminHome.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css'; // Reutilizamos estilos
import { FaUser, FaCog, FaQuestionCircle, FaPlus } from 'react-icons/fa';

import lockIcon from '../assets/IoH-lockiconusermenu.png';
import hamburgerIcon from '../assets/hamburger-icon.png';
import BackButton from '../components/BackButton'; // Asegúrate de tener este componente creado

function AdminHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleConfigure = (accessId) => {
    navigate(`/admin/access/${accessId}/edit`);
  };

  const handleAddAccess = () => {
    navigate('/admin/access/new');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const accesses = [
    { id: 'portal', name: 'Calle Falsa 123 Portal', color: '#FFE5BD' },
    { id: '3A', name: 'Calle Falsa 123 3ªA', color: '#DBD2DA' }
  ];

  return (
    <div className={styles.container}>
      <BackButton to="/register" /> {/* ⬅ Botón de volver */}

      <header className={styles.header}>
        <img
          src={hamburgerIcon}
          alt="Menú"
          className={styles.hamburgerIcon}
          onClick={toggleMenu}
        />
      </header>

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

      <div className={styles.greeting}>
        <h1>Hola, Administrador</h1>
      </div>

      <div className={styles.subtitle}>Accesos activos</div>

      <div className={styles.accessList}>
        {accesses.map((access) => (
          <div
            key={access.id}
            className={styles.accessCard}
            style={{ backgroundColor: access.color }}
          >
            <img src={lockIcon} alt="Lock" className={styles.lockIcon} />
            <p>{access.name}</p>
            <button
              className={styles.configureButton}
              onClick={() => handleConfigure(access.id)}
            >
              Configurar
            </button>
          </div>
        ))}

        <div className={styles.accessCard} onClick={handleAddAccess}>
          <FaPlus className={styles.lockIcon} />
          <p>Agregar acceso</p>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;