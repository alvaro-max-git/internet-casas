// src/components/SearchBluetoothDevices.jsx
import React, { useState } from 'react';
import styles from './SearchBluetoothDevices.module.css';

function SearchBluetoothDevices() {
  const [devices, setDevices] = useState([]);
  const [scanDone, setScanDone] = useState(false);

  // Lógica de escaneo
  const handleScan = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service'] // Ejemplo de servicio opcional
      });
      setDevices((prev) => [...prev, device]);
      setScanDone(true);
    } catch (error) {
      console.error('Error al escanear dispositivos:', error);
      alert('Error al escanear dispositivos Bluetooth.');
    }
  };

  // Ejemplo: botón "Abrir cerradura" al detectar al menos un dispositivo
  const handleOpenLock = () => {
    alert('¡Cerradura abierta con éxito!');
    // Aquí podrías redirigir, emitir evento, etc.
  };

  return (
    <div className={styles.container}>
      <button className={styles.scanButton} onClick={handleScan}>
        Escanear dispositivos
      </button>

      <ul className={styles.deviceList}>
        {devices.map((device, index) => (
          <li key={index}>{device.name || `Dispositivo sin nombre (${device.id})`}</li>
        ))}
      </ul>

      {scanDone && (
        <button className={styles.openLockButton} onClick={handleOpenLock}>
          Abrir cerradura
        </button>
      )}
    </div>
  );
}

export default SearchBluetoothDevices;