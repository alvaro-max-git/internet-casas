import React, { useState } from 'react';
import styles from './BluetoothSearch.module.css';
import BackButton from '../components/BackButton'; // 👈 Importar botón

function BluetoothSearch() {
  const [devices, setDevices] = useState([]);

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
      {/* Botón de volver */}
      <BackButton to="/lock/portal" /> {/* o to={-1} si prefieres ir atrás dinámicamente */}

      <h2>Buscar dispositivos Bluetooth</h2>

      <button className={styles.scanButton} onClick={handleScan}>
        Escanear dispositivos
      </button>

      <ul className={styles.deviceList}>
        {devices.map((device, index) => (
          <li key={index}>{device.name || `Dispositivo sin nombre (${device.id})`}</li>
        ))}
      </ul>
    </div>
  );
}

export default BluetoothSearch;