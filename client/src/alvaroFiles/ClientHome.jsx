// src/pages/ClientHome.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminHome.module.css'; // Reutilizamos estilos
import { FaPlus } from 'react-icons/fa';
import fotocerrradura from '../assets/cerradura.png';
import BackButton from '../components/BackButton';
import ToggleMenu from '../components/ToggleMenu';


function ClientHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accesses, setAccesses] = useState([]);
  const navigate = useNavigate();

  const toggleMenu = (open) => setMenuOpen(open);

  // Cargar accesos del localStorage al montar
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('clientAccesses')) || [];
    setAccesses(stored);
  }, []);

  const colores = JSON.parse(localStorage.getItem('accessColors') || '{}');

  const handleScanDevices = () => {
    navigate('/client/scan');
  };

  const handleOpenLock = async (access) => {
    // Verificamos que tengamos el ID de la cerradura
    const lockId = access.cerradura?.id;
    if (lockId) {
      navigate(`/lock/${lockId}/open`);
    } else {
      alert('Esta cerradura no tiene un ID válido');
    }
  };
 
  const handleDelete = (accessId) => {
    const confirmDelete = window.confirm('¿Seguro que quieres borrar este acceso?');
    if (confirmDelete) {
      const updated = accesses.filter((a) => a.id !== accessId);
      setAccesses(updated);
      localStorage.setItem('clientAccesses', JSON.stringify(updated));
    }
  };

  return (
    <div className={styles.container}>
      {/* NAV */}
      <div className={styles.navContainer}>
        <BackButton to="/register" className={styles.backButtonCustom} />
        <ToggleMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
      </div>

      {/* CONTENIDO */}
      <div className={styles.mainContent}>
        <h1 className={styles.greeting}>Hola Cliente</h1>
        <h2 className={styles.subtitle}>Tus cerraduras disponibles</h2>

        <div className={styles.accessList}>
          {accesses.map((access) => (
            <div
              key={access.id}
              className={styles.accessCard}
              style={{ backgroundColor: colores[access.id] || '#D4EFFF' }}
            >
              <img src={fotocerrradura} alt="Lock" className={styles.lockIcon} />
              <p><strong>Cerradura:</strong> {access.cerradura?.name || '(sin nombre)'}</p>
              <p><strong>Usuario:</strong> {access.usuario || '—'}</p>
              <p><strong>Token:</strong> {access.token || '—'}</p>

              <button
                className={styles.configureButton}
                onClick={() => handleOpenLock(access)}
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

          {/* Tarjeta para rastrear nueva cerradura */}
          <div
            className={styles.accessCard}
            onClick={handleScanDevices}
            style={{ backgroundColor: '#DBD2DA', cursor: 'pointer' }}
          >
            <FaPlus className={styles.lockIcon} />
            <p><strong>Rastrear nueva cerradura</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientHome;