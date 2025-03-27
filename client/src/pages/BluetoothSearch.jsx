import React, { useState, useEffect } from 'react';
import styles from './BluetoothSearch.module.css';
import BackButton from '../components/BackButton';
import ToggleMenu from '../components/ToggleMenu';

function BluetoothSearch() {
  const [devices, setDevices] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [token, setToken] = useState('');
  const [step, setStep] = useState('token'); // token | waiting | ready

  const toggleMenu = (open) => {
    setMenuOpen(open);
  };

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    if (token.trim() !== '') {
      setStep('waiting');
      // Simula esperar a la app
      setTimeout(() => {
        setStep('ready');
      }, 2000);
    } else {
      alert('Por favor, introduce un token válido.');
    }
  };

  const handleScan = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service'],
      });
      setDevices((prev) => [...prev, device]);
    } catch (error) {
      console.error('Error al escanear dispositivos:', error);
      alert('Error al escanear dispositivos Bluetooth.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.navContainer}>
        <BackButton to="/client/home" />
        <ToggleMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
      </div>

      <div className={styles.mainContent}>
        <h1 className={styles.greeting}>Buscar cerradura por Bluetooth</h1>

        {step === 'token' && (
          <form className={styles.tokenForm} onSubmit={handleTokenSubmit}>
            <input
              type="text"
              placeholder="Introduce tu token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className={styles.tokenInput}
            />
            <button type="submit" className={styles.submitTokenButton}>
              Confirmar token
            </button>
          </form>
        )}

        {step === 'waiting' && (
          <p className={styles.waitingText}>Esperando a la aplicación...</p>
        )}

        {step === 'ready' && (
          <>
            <button className={styles.scanButton} onClick={handleScan}>
              Escanear dispositivos
            </button>

            <ul className={styles.deviceList}>
              {devices.map((device, index) => (
                <li key={index}>
                  {device.name || `Dispositivo sin nombre (${device.id})`}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default BluetoothSearch;