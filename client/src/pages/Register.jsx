// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import IoHIcon from '../assets/IoH-icon.png';
import BackButton from '../components/BackButton';
import ToggleMenu from '../components/ToggleMenu';

// Llamadas de API
import { registerUser, registerHost, login } from '../services/api';

function Register() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  /*
    Estados posibles en 'view':
    1. "initial" (dos botones: Regístrate / ¿Ya tienes cuenta?)
    2. "registerChoice" (elige Usuario/Host para registro)
    3. "loginChoice" (elige Usuario/Host para login)
    4. "registerUser" (form registro user)
    5. "registerHost" (form registro host)
    6. "loginUser" (form login user)
    7. "loginHost" (form login host)
  */
  const [view, setView] = useState('initial');

  // Campos de formulario
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    seamApiKey: '',
  });

  const toggleMenu = (open) => setMenuOpen(open);

  // Handler para campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Resetea el formulario
  const resetForm = () => {
    setFormData({ email: '', password: '', seamApiKey: '' });
  };

  // === Flujos ===
  const goToRegisterChoice = () => {
    resetForm();
    setView('registerChoice');
  };
  const goToLoginChoice = () => {
    resetForm();
    setView('loginChoice');
  };

  // === Registro y login: acciones concretas ===
  const handleRegisterUser = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData.email, formData.password);
      alert('✅ Usuario registrado correctamente');
      setView('initial');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRegisterHost = async (e) => {
    e.preventDefault();
    try {
      await registerHost(formData.email, formData.password, formData.seamApiKey);
      alert('✅ Host registrado correctamente');
      setView('initial');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLoginUser = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/client/home');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLoginHost = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/admin/home');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className={styles.container}>
      {/* Menú superior */}
      <div className={styles.navContainer}>
        <BackButton to="/" />
        <ToggleMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
      </div>

      {/* Contenido principal */}
      <div className={styles.mainContent}>
        <div className={styles.iconContainer}>
          <img src={IoHIcon} alt="IoH Icon" className={styles.icon} />
        </div>
        <h1 className={styles.title}>Internet of Homes</h1>

        {/* Vista inicial: Regístrate / ¿Ya tienes cuenta? */}
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

        {/* Elección de registro: user o host */}
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

        {/* Elección de login: user o host */}
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

        {/* Formulario: Registrar User */}
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

        {/* Formulario: Registrar Host */}
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

        {/* Formulario: Login User */}
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

        {/* Formulario: Login Host */}
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