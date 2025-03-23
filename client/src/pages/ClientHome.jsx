// src/pages/ClientHome.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import styles from './ClientHome.module.css';

function ClientHome() {
  const navigate = useNavigate();

  // Lógica para botón de "Rastrear Dispositivos"
  const handleScanDevices = () => {
    navigate('/client/scan');
  };

  return (
    <div className={styles.container}>
      {/* Botón de volver (si quieres ir al /register o a donde prefieras) */}
      <BackButton to="/register" />

      <h2 className={styles.title}>Bienvenido, Cliente</h2>
      <p className={styles.subtitle}>
        ¿Quieres abrir una cerradura?
      </p>

      <button className={styles.scanButton} onClick={handleScanDevices}>
        Rastrear Dispositivos
      </button>
    </div>
  );
}

export default ClientHome;