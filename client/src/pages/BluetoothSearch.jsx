import React, { useState } from 'react';
import styles from './BluetoothSearch.module.css';
import BackButton from '../components/BackButton'; 
import ToggleMenu from '../components/ToggleMenu';

function BluetoothSearch() {
  const [devices, setDevices] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);


  const toggleMenu = (open) => {
    setMenuOpen(open);
  };

  const handleScan = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service']
      });
      setDevices(prev => [...prev, device]);
    } catch (error) {
      console.error('Error al escanear dispositivos:', error);
      alert('Error al escanear dispositivos Bluetooth.');
    }
  };

  return (
    <div className={styles.container}>

       {/* === Contenedor de NAV (BackButton + ToggleMenu) === */}
       <div className={styles.navContainer}>
        <BackButton to="/client/home" className={styles.backButtonCustom} />
        <ToggleMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
      </div>
      <div className={styles.mainContent}>
      <h1 className={styles.greeting}>Buscar cerradura por Bluetooth</h1>

      <button className={styles.scanButton} onClick={handleScan}>
        Escanear dispositivos
      </button>

      <ul className={styles.deviceList}>
        {devices.map((device, index) => (
          <li key={index}>{device.name || `Dispositivo sin nombre (${device.id})`}</li>
        ))}
      </ul>
    </div>
    </div>
  );
}

export default BluetoothSearch;