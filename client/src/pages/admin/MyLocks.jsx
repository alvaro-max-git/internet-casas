import React, { useEffect, useState } from 'react';
import { listLocksOfCurrentHost } from '../../services/api';
import styles from '../AdminHome.module.css';
import fotocerrradura from '../../assets/cerradura.png';
import BackButton from '../../components/BackButton';
import ToggleMenu from '../../components/ToggleMenu';



function MyLocks() {
  const [locks, setLocks] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = (open) => setMenuOpen(open);

  useEffect(() => {
    listLocksOfCurrentHost()
      .then(setLocks)
      .catch((err) => console.error("❌ Error al cargar cerraduras:", err));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.navContainer}>
        <BackButton to="/admin/home" />
        <ToggleMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
      </div>

      <div className={styles.mainContent}>
        <h1 className={styles.greeting}>Mis cerraduras</h1>
        <div className={styles.accessList}>
          {locks.map((lock) => (
            <div key={lock.id} className={styles.accessCard}>
               <img src={fotocerrradura} alt="Lock" className={styles.lockIcon} />
              <p><strong>Nombre:</strong> {lock.name}</p>
              <p><strong>Modelo:</strong> {lock.model}</p>
              <p><strong>Fabricante:</strong> {lock.manufacturer}</p>
              <p><strong>Estado:</strong> {lock.locked ? '🔒 Cerrada' : '🔓 Abierta'}</p>
              <p><strong>Batería:</strong> {lock.batteryStatus} ({(lock.batteryLevel * 100).toFixed(2)}%)</p>              
               {/* <p><strong>Zona horaria:</strong> {lock.timezone}</p> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyLocks;