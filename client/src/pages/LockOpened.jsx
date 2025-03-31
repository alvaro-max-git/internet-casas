// src/pages/LockOpened.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './LockOpened.module.css';
import BackButton from '../components/BackButton';
import ToggleMenu from '../components/ToggleMenu';
import { openLockWithAccess, getLock } from '../services/api';
import { notifyLockOpened, notifyLockOpenError } from '../utils/notifications';
import cerradura_abierta from '../assets/cerradura_abierta.png';
import cerradura_cerrada from '../assets/cerradura_cerrada.png';

function LockOpened() {
  const { state } = useLocation();
  const { lock, access } = state || {};
  const lockId = lock?.id;
  const accessId = access?.id;

  const [menuOpen, setMenuOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleMenu = (open) => setMenuOpen(open);

  useEffect(() => {
    if (!lockId) return;
    const fetchLockStatus = async () => {
      try {
        const data = await getLock(lockId);
        setIsLocked(data.locked);
      } catch (error) {
        console.error('❌ Error al obtener estado:', error);
      }
    };
    fetchLockStatus();
  }, [lockId]);

  const handleUnlock = async () => {
    setLoading(true);
    try {
      // Usamos el id de acceso para iniciar la apertura
      await openLockWithAccess(accessId);
      console.log('🔓 Cerradura abierta con acceso:', accessId);
      console.log("id cerradura:", lockId);
  
      // Función de sondeo que consulta el estado cada 3 segundos hasta 60 segundos
      const pollLockStatus = async () => {
        const interval = 3000; // 3 segundos
        const timeout = 60000; // 60 segundos
        let elapsed = 0;
        while (elapsed < timeout) {
          await new Promise(resolve => setTimeout(resolve, interval));
          const updated = await getLock(lockId);
          console.log(`Polling: estado actual ${updated.locked}`);
          if (updated.locked === false) {
            return updated;
          }
          elapsed += interval;
        }
        throw new Error('Tiempo de espera agotado');
      };
  
      const updated = await pollLockStatus();
      console.log('🔓 Cerradura actualizada:', updated);
      setIsLocked(updated.locked);
      console.log('Estado actualizado:', updated.locked);
      updated.locked === false
        ? notifyLockOpened()
        : notifyLockOpenError('La cerradura sigue cerrada');
    } catch (err) {
      console.error('❌ Error al abrir cerradura:', err);
      if (err.message.trim().toLowerCase() === "acceso no válido o expirado") {
        notifyAccessExpired();
      } else {
        notifyLockOpenError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.navContainer}>
        <BackButton to="/client/home" />
        <ToggleMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
      </div>

      <div className={styles.mainContent}>
        <img
          src={isLocked === false ? cerradura_abierta : cerradura_cerrada}
          alt="Estado"
          className={styles.greenLockIcon}
        />

        <h2 className={styles.openText}>
          Cerradura: <span className={styles.lockName}>{lock?.name || 'Desconocida'}</span>
        </h2>

        <p className={styles.statusText}>
          <strong>Estado actual:{" "}</strong>
          {isLocked === null ? "Cargando..." : isLocked ? "🔒 Cerrada" : "🔓 Abierta"}
        </p>

        {isLocked !== false && (
          <button
            className={styles.openButton}
            onClick={handleUnlock}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span> Abriendo...
              </>
            ) : (
              "Abrir cerradura"
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default LockOpened;