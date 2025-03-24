// src/pages/ClientHome.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminHome.module.css';
import { FaPlus } from 'react-icons/fa';

import lockIcon from '../assets/IoH-lockiconusermenu.png';
import BackButton from '../components/BackButton';
import ToggleMenu from '../components/ToggleMenu';
import { useAccesses } from '../hooks/useAccesses';

function ClientHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { accesses, setAccesses } = useAccesses();


  // Lógica para botón de "Rastrear Dispositivos"
  const handleScanDevices = () => {
    navigate('/client/scan');
  };
 
  // Lógica para botón de "Abrir Cerradura"
  const handleOpenLock = (accessId) => {
    navigate(`/lock/${accessId}/open`);
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
      <h1 className={styles.greeting}>Hola Cliente</h1>
      <p className={styles.subtitle}>¿Quieres abrir una cerradura?</p>

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
                onClick={() => handleOpenLock(access.id)}
              >
                Abrir
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(access.id)}
              >
                Borrar
              </button>
            </div>
          ))}

          <div className={styles.accessCard} onClick={handleScanDevices}>
            <FaPlus className={styles.lockIcon} />
            <p>Rastrear nueva cerradura</p>
          </div>
        </div>

       
    </div>
    </div>
  );
}

export default ClientHome;