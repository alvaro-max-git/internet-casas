// src/pages/AdminHome.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminHome.module.css';
import { FaPlus } from 'react-icons/fa';

import lockIcon from '../assets/IoH-lockiconusermenu.png';
import BackButton from '../components/BackButton';
import ToggleMenu from '../components/ToggleMenu'; // Usamos el componente ToggleMenu
import { useAccesses } from '../hooks/useAccesses';

function AdminHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { accesses, setAccesses } = useAccesses();

  const handleConfigure = (accessId) => {
    navigate(`/admin/access/${accessId}/edit`);
  };

  const handleDelete = (accessId) => {
    const confirmDelete = window.confirm('¿Estás seguro de que quieres borrar este acceso?');
    if (confirmDelete) {
      const updated = accesses.filter((a) => a.id !== accessId);
      setAccesses(updated);
    }
  };

  const handleAddAccess = () => {
    navigate('/admin/access/new');
  };

  const toggleMenu = (open) => {
    setMenuOpen(open);
  };

  const resetAccesses = () => {
    const confirmReset = window.confirm('¿Seguro que quieres resetear los accesos?');
    if (confirmReset) {
      localStorage.removeItem('accesses');
      window.location.reload();
    }
  };

  return (
    <div className={styles.container}>
       {/* BackButton posicionado */}
       <div className={styles.backButtonCustom}>
        <BackButton to="/register" />
      </div>

      {/* Menú flotante */}
      <ToggleMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />

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
            <button
              className={styles.deleteButton}
              onClick={() => handleDelete(access.id)}
            >
              Borrar
            </button>
          </div>
        ))}

        <div className={styles.accessCard} onClick={handleAddAccess}>
          <FaPlus className={styles.lockIcon} />
          <p>Agregar acceso</p>
        </div>
      </div>

      <button className={styles.resetButton} onClick={resetAccesses}>
        Resetear accesos
      </button>
    </div>
  );
}

export default AdminHome;