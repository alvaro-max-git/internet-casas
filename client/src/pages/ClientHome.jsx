// src/pages/ClientHome.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminHome.module.css'; // Reutilizamos estilos
import { FaPlus } from 'react-icons/fa';
import fotocerrradura from '../assets/cerradura.png';
import BackButton from '../components/BackButton';
import ToggleMenu from '../components/ToggleMenu';
import { openLock, getLock } from '../services/api';

function ClientHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accesses, setAccesses] = useState([]);
  const navigate = useNavigate();
  
  const [polling, setPolling] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [lockOpened, setLockOpened] = useState(false);


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

  const handleOpenLock = async (lockId) => {
      try {
        // Llamada al método que abre la cerradura
        await openLock(lockId);
  
        // Iniciamos el polling
        setPolling(true);
        setLockOpened(false);
        setTimeLeft(60);
  
        const intervalId = setInterval(async () => {
          setTimeLeft((prev) => prev - 1);
  
          try {
            const lockData = await getLock(lockId);
            // lockData.LOCKED es true o false
            if (lockData && lockData.LOCKED === false) {
              setLockOpened(true);
              setPolling(false);
              clearInterval(intervalId);
            }
          } catch (error) {
            console.error(error);
          }
  
          // Si se acaba el tiempo, se detiene el polling
          if (timeLeft <= 1) {
            setPolling(false);
            clearInterval(intervalId);
          }
        }, 2000);
      } catch (error) {
        console.error(`No se pudo abrir la cerradura con ID=${lockId}`, error);
        alert(`No se pudo abrir la cerradura con ID=${lockId}`);
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
                onClick={() => handleOpenLock(access.cerradura?.id)}
              >
                Abrir
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(access.id)}
              >
                Borrar
              </button>
        
        {/* Indicador de proceso */}
                {polling && !lockOpened && (
                  <div>
                    <p>Verificando estado de la cerradura...</p>
                    <p>Tiempo restante: {timeLeft}s</p>
                    <div className={styles.spinner}>Cargando...</div>
                  </div>
                )}
                {lockOpened && <p>¡La cerradura está abierta!</p>}
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