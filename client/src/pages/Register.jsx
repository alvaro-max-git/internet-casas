import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import IoHIcon from '../assets/IoH-icon.png';
import BackButton from '../components/BackButton';
import ToggleMenu from '../components/ToggleMenu';

function Register() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLoginChoice, setShowLoginChoice] = useState(false);
  const [role, setRole] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = (open) => setMenuOpen(open);
  const handleShowLoginChoice = () => setShowLoginChoice(true);
  const handleLoginChoice = (chosenRole) => {
    setRole(chosenRole);
    setShowForm(true);
  };
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (role === 'admin') navigate('/admin/home');
    else navigate('/client/home');
  };
  const handleRegister = () => {
    alert('Funcionalidad de registro en desarrollo...');
  };

  return (
    <div className={styles.container}>
      {/* Contenedor nav */}
      <div className={styles.navContainer}>
      <BackButton to="/"  />
        <ToggleMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
      </div>

      {/* Contenido central */}
      <div className={styles.mainContent}>
        <div className={styles.iconContainer}>
          <img src={IoHIcon} alt="IoH Icon" className={styles.icon} />
        </div>

        <h1 className={styles.title}>Internet of Homes</h1>

        {!showLoginChoice && !showForm && (
          <>
            <button className={styles.registerButton} onClick={handleRegister}>
              Regístrate
            </button>
            <p className={styles.loginLink} onClick={handleShowLoginChoice}>
              ¿Ya tienes cuenta?
            </p>
          </>
        )}

        {showLoginChoice && !showForm && (
          <div className={styles.loginChoice}>
            <button className={styles.adminButton} onClick={() => handleLoginChoice('admin')}>
              Iniciar sesión como Admin
            </button>
            <button className={styles.clientButton} onClick={() => handleLoginChoice('client')}>
              Iniciar sesión como Cliente
            </button>
          </div>
        )}

        {showForm && (
          <form className={styles.loginForm} onSubmit={handleLoginSubmit}>
            <input type="text" placeholder="Usuario o Email" className={styles.inputField} />
            <input type="password" placeholder="Contraseña" className={styles.inputField} />
            <button type="submit" className={styles.loginButton}>Iniciar sesión</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Register;