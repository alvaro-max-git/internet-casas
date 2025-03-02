// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import IoHIcon from '../assets/IoH-icon.png';

function Register() {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Lógica mínima: en el prototipo, cualquier dato sirve para "loguear"
    // Navegamos a /home
    navigate('/home');
  };

  return (
    <div className={styles.container}>
      {/* Cuadrado con esquinas redondeadas + icono */}
      <div className={styles.iconContainer}>
        <img src={IoHIcon} alt="IoH Icon" className={styles.icon} />
      </div>

      {/* Título */}
      <h1 className={styles.title}>Internet of Homes</h1>

      {/* Si no estamos mostrando el formulario de login */}
      {!showLogin && (
        <>
          {/* Botón "Regístrate" (sin acción real en este prototipo) */}
          <button className={styles.registerButton}>
            Regístrate
          </button>

          {/* Al hacer clic, mostramos el formulario de login */}
          <p className={styles.loginLink} onClick={() => setShowLogin(true)}>
            ¿Ya tienes una cuenta?
          </p>
        </>
      )}

      {/* Formulario de login (se muestra al hacer clic en "¿Ya tienes una cuenta?") */}
      {showLogin && (
        <form className={styles.loginForm} onSubmit={handleLoginSubmit}>
          <div>
            <input
              type="text"
              placeholder="Usuario o Email"
              className={styles.inputField}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              className={styles.inputField}
            />
          </div>
          <button type="submit" className={styles.loginButton}>
            Iniciar sesión
          </button>
        </form>
      )}
    </div>
  );
}

export default Register;
