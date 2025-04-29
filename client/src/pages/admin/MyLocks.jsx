import React, { useEffect, useState } from 'react';
// 👇 Importa las nuevas funciones y la existente
import { listLocksOfCurrentHost, blockLock, unblockLock } from '../../services/api';
import styles from '../AdminHome.module.css';
import fotocerrradura from '../../assets/cerradura.png';
import BackButton from '../../components/BackButton';
import ToggleMenu from '../../components/ToggleMenu';

function MyLocks() {
  const [locks, setLocks] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Para feedback visual
  const [error, setError] = useState(''); // Para mostrar errores

  const toggleMenu = (open) => setMenuOpen(open);

  // Función para cargar las cerraduras
  const fetchLocks = () => {
    setLoading(true);
    setError('');
    listLocksOfCurrentHost()
      .then(setLocks)
      .catch((err) => {
        console.error("❌ Error al cargar cerraduras:", err);
        setError('Error al cargar cerraduras.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLocks(); // Carga inicial
  }, []);

  // Función para manejar el click del botón Bloquear/Desbloquear
  const handleToggleBlock = async (lockId, currentBlockedStatus) => {
    setLoading(true); // Muestra feedback
    setError('');
    try {
      if (currentBlockedStatus) {
        await unblockLock(lockId);
      } else {
        await blockLock(lockId);
      }
      // Actualiza el estado local para reflejar el cambio inmediatamente
      setLocks(prevLocks =>
        prevLocks.map(lock =>
          lock.id === lockId ? { ...lock, blocked: !currentBlockedStatus } : lock
        )
      );
    } catch (err) {
      console.error("❌ Error al cambiar estado de bloqueo:", err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.navContainer}>
        <BackButton to="/admin/home" />
        <ToggleMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
      </div>

      <div className={styles.mainContent}>
        <h1 className={styles.greeting}>Mis cerraduras</h1>
        {error && <p className={styles.errorText}>{error}</p>} {/* Muestra errores */}
        {loading && <p>Cargando...</p>} {/* Muestra feedback de carga */}
        <div className={styles.accessList}>
          {locks.map((lock) => (
            <div key={lock.id} className={styles.accessCard}>
              <img src={fotocerrradura} alt="Lock" className={styles.lockIcon} />
              <p><strong>Nombre:</strong> {lock.name}</p>
              <p><strong>Modelo:</strong> {lock.model}</p>
              <p><strong>Fabricante:</strong> {lock.manufacturer}</p>
              <p><strong>Estado Físico:</strong> {lock.locked ? '🔒 Cerrada' : '🔓 Abierta'}</p>
              {/* 👇 Muestra el estado de bloqueo de la aplicación */}
              <p><strong>Estado App:</strong> {lock.blocked ? '🚫 Bloqueada' : '✅ Operativa'}</p>
              <p><strong>Batería:</strong> {lock.batteryStatus} ({(lock.batteryLevel * 100).toFixed(2)}%)</p>
              {/* 👇 Botón para bloquear/desbloquear */}
              <button
                onClick={() => handleToggleBlock(lock.id, lock.blocked)}
                disabled={loading} // Deshabilita mientras carga
                className={lock.blocked ? styles.unblockButton : styles.deleteButton} // Estilos opcionales
              >
                {lock.blocked ? 'Desbloquear' : 'Bloquear'}
              </button>
              {/* <p><strong>Zona horaria:</strong> {lock.timezone}</p> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyLocks;