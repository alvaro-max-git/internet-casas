// src/pages/ClientHome.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminHome.module.css';
import { FaPlus } from 'react-icons/fa';
import fotocerrradura from '../assets/cerradura.png';
import BackButton from '../components/BackButton';
import ToggleMenu from '../components/ToggleMenu';
import { listAccessesOfCurrentUser } from '../services/api';

function ClientHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accesses, setAccesses] = useState([]);
  const navigate = useNavigate();

  const toggleMenu = (open) => setMenuOpen(open);

  // Cargar accesos reales desde el backend al montar
  useEffect(() => {
    const fetchAccesses = async () => {
      try {
        const response = await listAccessesOfCurrentUser();
        setAccesses(response);
        localStorage.setItem('clientAccesses', JSON.stringify(response));
      } catch (err) {
        console.error('❌ Error al obtener accesos del usuario:', err);
      }
    };
    fetchAccesses();
  }, []);

  const colores = JSON.parse(localStorage.getItem('accessColors') || '{}');

  const handleScanDevices = () => {
    navigate('/client/scan');
  };

  const handleAccessByToken = () => {
    navigate('/client/access-loader');
  };

  const handleOpenLock = (access) => {
    if (!access.cerradura?.id) {
      alert('Esta cerradura no tiene un ID válido');
      return;
    }

    navigate(`/lock/${access.cerradura.id}/open`, {
      state: {
        access,
        lock: access.cerradura,
      },
    });
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
      <div className={styles.navContainer}>
        <BackButton to="/register" />
        <ToggleMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
      </div>

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

              <button className={styles.configureButton} onClick={() => handleOpenLock(access)}>
                Abrir
              </button>
              <button className={styles.deleteButton} onClick={() => handleDelete(access.id)}>
                Borrar
              </button>
            </div>
          ))}

          {/* Tarjeta para rastrear nueva cerradura */}
         {/* <div
            className={styles.accessCard}
            onClick={handleScanDevices}
            style={{ backgroundColor: '#DBD2DA', cursor: 'pointer' }}
          >
            <FaPlus className={styles.lockIcon} />
            <p><strong>Rastrear nueva cerradura</strong></p>
          </div>

          {/* Tarjeta para añadir acceso por token */}
          <div
            className={styles.accessCard}
            onClick={handleAccessByToken}
            style={{ backgroundColor: '#E2F0CB', cursor: 'pointer' }}
          >
            <FaPlus className={styles.lockIcon} />
            <p><strong>Añadir acceso con token</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientHome;
