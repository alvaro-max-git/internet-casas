// src/pages/LockOpened.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './LockOpened.module.css';
import BackButton from '../components/BackButton';
import ToggleMenu from '../components/ToggleMenu';
import { openLock, getLock } from '../services/api';


// Icono de cerradura
import greenLockIcon from '../assets/green-lock.png';
import redLockIcon from '../assets/red-lock.png';


// React Icons para el submenú
import {
  FaMapMarkerAlt,
  FaQuestionCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

function LockOpened() {

  const { lockId } = useParams(); // Extraer el ID de la URL (/lock/:lockId/open)

  /*
  const checkLockStatus = async () => {
    try {
      const lockData = await getLock(lockId);
    return lockData.LOCKED;
    } catch (error) {
      console.error("Error al verificar el estado de la cerradura:", error);
      return false; // O manejar el error de otra manera
    }
  }
    */

  const [menuOpen, setMenuOpen] = useState(false);

  const [polling, setPolling] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [lockOpened, setLockOpened] = useState(false);

  // Verificar estado inicial de la cerradura
  useEffect(() => {
    const checkInitialState = async () => {
      try {
        const lockData = await getLock(lockId);
        console.log(lockData)
        
        console.log(lockData.locked)


        if (lockData && lockData.locked === false) {
          setLockOpened(true);
        }
      } catch (error) {
        console.error("Error al verificar estado inicial:", error);
      }
    };


  if (lockId) {
      checkInitialState();
    }
  }, [lockId]);
  

  const toggleMenu = (open) => {
    setMenuOpen(open);
  };

  


  const openDetectedLock = async () => {
    try {
      // Llamada al método que abre la cerradura
      await openLock(lockId);

      // Iniciamos el polling
      setPolling(true);
      setLockOpened(false);
      setTimeLeft(60);

      const intervalId = setInterval(async () => {
        setTimeLeft((prev) => {
          const newValue = prev - 1;
          // Si se acaba el tiempo, se detiene el polling
          if (newValue <= 0) {
            setPolling(false);
            clearInterval(intervalId);
            return 0;
          }
          return newValue;
        });

        try {
          const lockData = await getLock(lockId);
          // lockData.LOCKED es true o false
          if (lockData && lockData.locked === false) {
            setLockOpened(true);
            setPolling(false);
            clearInterval(intervalId);
          }
        } catch (error) {
          console.error(error);
        }
      }, 2000);
    } catch (error) {
      console.error(`No se pudo abrir la cerradura con ID=${lockId}`, error);
      alert(`No se pudo abrir la cerradura`);
      setPolling(false);
    }
  };



  return (
    <div className={styles.container}>
      {/* === Contenedor de NAV === */}
      <div className={styles.navContainer}>
        <BackButton to="/client/home" className={styles.backButtonCustom} />
        <ToggleMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
      </div>

      {/* Icono de cerradura (roja o verde según estado) */}
      <div className={styles.lockIconContainer}>
        <img
          src={lockOpened ? greenLockIcon : redLockIcon}
          alt={lockOpened ? "Cerradura Abierta" : "Cerradura Cerrada"}
          className={styles.lockIcon}
        />
      </div>

      {/* Texto de estado */}
      <h2 className={styles.statusText}>
        {lockOpened ? "Cerradura abierta" : "Cerradura cerrada"}
      </h2>

      {/* Botón de abrir o spinner durante polling */}
      {!lockOpened && (
        <div className={styles.actionContainer}>
          {polling ? (
            <div className={styles.spinnerContainer}>
              <div className={styles.spinner}></div>
              <p className={styles.spinnerText}>Verificando... {timeLeft}s</p>
            </div>
          ) : (
            <button 
              className={styles.openButton}
              onClick={openDetectedLock}
            >
              Abrir cerradura
            </button>
          )}
        </div>
      )}

      {/* Submenú inferior con iconos y texto */}
      <div className={styles.actions}>
        <div className={styles.actionItem}>
          <FaMapMarkerAlt className={styles.actionIcon} />
          <span>Ver en el mapa</span>
        </div>

        <div className={styles.actionItem}>
          <FaQuestionCircle className={styles.actionIcon} />
          <span>Ayuda</span>
        </div>

        <div className={styles.actionItem}>
          <FaExclamationTriangle className={styles.actionIcon} />
          <span>¿Problemas?</span>
        </div>
      </div>
    </div>
  );
}

export default LockOpened;
