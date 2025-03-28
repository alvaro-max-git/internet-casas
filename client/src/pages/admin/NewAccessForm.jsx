// src/pages/admin/NewAccessForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import styles from './AccessForm.module.css';
import ToggleMenu from '../../components/ToggleMenu';
import { createAccess, listLocksByHost } from '../../services/api';

function NewAccessForm() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Guardaremos aquí las cerraduras descargadas del backend
  const [hostLocks, setHostLocks] = useState([]);

  const [formData, setFormData] = useState({
    lockId: '',
    token: '',
    usuario: '',
    color: '#cccccc',
    fechaEntrada: '',
    fechaSalida: ''
  });

  // Al montar el componente, llamamos a listLocksByHost para cargar las cerraduras del host
  useEffect(() => {
    const hostEmail = localStorage.getItem('userEmail');
    if (!hostEmail) {
      console.warn('No hay email de host en localStorage. No se pueden listar cerraduras.');
      return;
    }

    listLocksByHost(hostEmail)
      .then((locks) => {
        setHostLocks(locks);
      })
      .catch((err) => {
        console.error('Error al obtener cerraduras del host:', err);
      });
  }, []);

  const toggleMenu = (open) => setMenuOpen(open);

  // Handler para los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Generador de token aleatorio
  const generateToken = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  // Al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const hostEmail = localStorage.getItem('userEmail');
    if (!hostEmail) {
      alert('No se encontró el email del host en localStorage');
      return;
    }

    // Construimos el payload que espera tu backend en /api/accesses
    const accessPayload = {
      host: { email: hostEmail },
      cerradura: { id: formData.lockId }, // lockId elegido en el <select>
      token: formData.token || null,
      usuario: formData.usuario || null,
      fechaEntrada: formData.fechaEntrada || null,
      fechaSalida: formData.fechaSalida || null
    };

    try {
      await createAccess(accessPayload);
      alert('✅ Acceso creado correctamente');
      navigate('/admin/home');
    } catch (error) {
      console.error(error);
      alert('❌ Error al crear el acceso');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.navContainer}>
        <BackButton to="/admin/home" className={styles.backButtonCustom} />
        <ToggleMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
      </div>

      <h2 className={styles.title}>Agregar nuevo acceso</h2>

      <form onSubmit={handleSubmit} className={styles.form}>

        {/* DESPLEGABLE para elegir la cerradura */}
        <div className={styles.field}>
          <label>Cerradura</label>
          <select
            name="lockId"
            value={formData.lockId}
            onChange={handleChange}
            required
          >
            <option value="">-- Selecciona la cerradura --</option>
            {hostLocks.map((lock) => (
              <option key={lock.id} value={lock.id}>
                {lock.name} (ID: {lock.id})
              </option>
            ))}
          </select>
        </div>

        {/* Token con opción de autogenerar */}
        <div className={styles.field}>
          <label>Token</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              name="token"
              value={formData.token}
              onChange={handleChange}
            />
            <button
              type="button"
              className={styles.tokenButton}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  token: generateToken()
                }))
              }
            >
              Generar token
            </button>
          </div>
        </div>

        {/* Usuario (huésped) */}
        <div className={styles.field}>
          <label>Usuario</label>
          <input
            type="text"
            name="usuario"
            value={formData.usuario}
            onChange={handleChange}
          />
        </div>

        {/* Color de la tarjeta */}
        <div className={styles.field}>
          <label>Color de tarjeta</label>
          <input
            type="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
          />
        </div>

        {/* Fechas */}
        <div className={styles.fieldGroup}>
          <div className={styles.field}>
            <label>Desde</label>
            <input
              type="datetime-local"
              name="fechaEntrada"
              value={formData.fechaEntrada}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label>Hasta</label>
            <input
              type="datetime-local"
              name="fechaSalida"
              value={formData.fechaSalida}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className={styles.button}>Crear acceso</button>
      </form>
    </div>
  );
}

export default NewAccessForm;