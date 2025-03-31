// src/pages/LockOpened.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './LockOpened.module.css';
import BackButton from '../components/BackButton';
import ToggleMenu from '../components/ToggleMenu';
import { openLock, getLock } from '../services/api';
import { notifyLockOpened, notifyLockOpenError } from '../utils/notifications';
import cerradura_abierta from '../assets/cerradura_abierta.png';
import cerradura_cerrada from '../assets/cerradura_cerrada.png';

function LockOpened() {
  const { state } = useLocation();
  const { lock } = state || {};
  const lockId = lock?.id;

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
      await openLock(lockId);
      const updated = await getLock(lockId);
      setIsLocked(updated.locked);
      updated.locked === false ? notifyLockOpened() : notifyLockOpenError();
    } catch (err) {
      console.error('❌ Error al abrir cerradura:', err);
      notifyLockOpenError();
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