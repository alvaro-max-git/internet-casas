// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import IoHIcon from '../assets/IoH-icon.png';
import BackButton from '../components/BackButton';
import ToggleMenu from '../components/ToggleMenu';

import {
  notifyLoginSuccess,
  notifyLoginError,
  notifyRegisterUserSuccess,
  notifyRegisterHostSuccess,
  notifyRegisterError,
} from '../utils/notifications';

import { registerUser, registerHost, login } from '../services/api';

function Register() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const [view, setView] = useState('initial');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    seamApiKey: '',
  });

  const toggleMenu = (open) => setMenuOpen(open);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', seamApiKey: '' });
  };

  const goToRegisterChoice = () => {
    resetForm();
    setView('registerChoice');
  };

  const goToLoginChoice = () => {
    resetForm();
    setView('loginChoice');
  };

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData.email, formData.password);
      notifyRegisterUserSuccess();
      setView('initial');
    } catch (error) {
      notifyRegisterError(error.message);
    }
  };

  const handleRegisterHost = async (e) => {
    e.preventDefault();
    try {
      await registerHost(formData.email, formData.password, formData.seamApiKey);
      notifyRegisterHostSuccess();
      setView('initial');
    } catch (error) {
      notifyRegisterError(error.message);
    }
  };

  const handleLoginHost = async (e) => {
    e.preventDefault();
    localStorage.removeItem("sessionToken"); // 🧹 Limpia sesión anterior
    try {
      const response = await login(formData.email, formData.password);
      localStorage.setItem("sessionToken", response.token); // ✅ Nueva sesión
      notifyLoginSuccess('🔐');
      navigate('/admin/home');
    } catch (error) {
      notifyLoginError();
    }
  };
  
  const handleLoginUser = async (e) => {
    e.preventDefault();
    localStorage.removeItem("sessionToken"); // 🧹 Limpia sesión anterior
    try {
      const response = await login(formData.email, formData.password);
      localStorage.setItem("sessionToken", response.token); // ✅ Nueva sesión
      notifyLoginSuccess('👤');
      navigate('/client/access-loader');
    } catch (error) {
      notifyLoginError();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.navContainer}>
        <BackButton to="/" />
        <ToggleMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
      </div>

      <div className={styles.mainContent}>
        <div className={styles.iconContainer}>
          <img src={IoHIcon} alt="IoH Icon" className={styles.icon} />
        </div>
        <h1 className={styles.title}>Internet of Homes</h1>

        {view === 'initial' && (
          <>
            <button className={styles.registerButton} onClick={goToRegisterChoice}>
              Regístrate
            </button>
            <p className={styles.loginLink} onClick={goToLoginChoice}>
              ¿Ya tienes cuenta?
            </p>
          </>
        )}

        {view === 'registerChoice' && (
          <div className={styles.loginChoice}>
            <button className={styles.clientButton} onClick={() => setView('registerUser')}>
              Registrarse como Usuario
            </button>
            <button className={styles.adminButton} onClick={() => setView('registerHost')}>
              Registrarse como Host
            </button>
          </div>
        )}

        {view === 'loginChoice' && (
          <div className={styles.loginChoice}>
            <button className={styles.clientButton} onClick={() => setView('loginUser')}>
              Iniciar sesión como Usuario
            </button>
            <button className={styles.adminButton} onClick={() => setView('loginHost')}>
              Iniciar sesión como Host
            </button>
          </div>
        )}

        {view === 'registerUser' && (
          <form className={styles.loginForm} onSubmit={handleRegisterUser}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={styles.inputField}
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              className={styles.inputField}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" className={styles.loginButton}>
              Registrar Usuario
            </button>
          </form>
        )}

        {view === 'registerHost' && (
          <form className={styles.loginForm} onSubmit={handleRegisterHost}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={styles.inputField}
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              className={styles.inputField}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="seamApiKey"
              placeholder="Seam API Key"
              className={styles.inputField}
              value={formData.seamApiKey}
              onChange={handleChange}
              required
            />
            <button type="submit" className={styles.loginButton}>
              Registrar Host
            </button>
          </form>
        )}

        {view === 'loginUser' && (
          <form className={styles.loginForm} onSubmit={handleLoginUser}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={styles.inputField}
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              className={styles.inputField}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" className={styles.loginButton}>
              Iniciar sesión
            </button>
          </form>
        )}

        {view === 'loginHost' && (
          <form className={styles.loginForm} onSubmit={handleLoginHost}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={styles.inputField}
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              className={styles.inputField}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" className={styles.loginButton}>
              Iniciar sesión
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Register;