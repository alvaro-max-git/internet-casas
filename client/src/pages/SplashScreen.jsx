// SplashScreen.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SplashScreen.module.css';
import IoHIcon from '../assets/IoH-icon2.png';

function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Aquí tu lógica de check de usuario logueado
      navigate('/register');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.container}>
      {/* Cuadrado con esquinas redondeadas y fondo azul */}
      <div className={styles.iconContainer}>
        <img src={IoHIcon} alt="IoH Icon" className={styles.icon} />
      </div>
      <h1 className={styles.title}>Internet of Homes</h1>
    </div>
  );
}

export default SplashScreen;

