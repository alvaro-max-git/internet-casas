// src/pages/admin/NewAccessForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import styles from './AccessForm.module.css';
import ToggleMenu from '../../components/ToggleMenu';
import {
  createAccess,
  getCurrentUser,
  listLocksOfCurrentHost
} from '../../services/api';

function NewAccessForm() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Lista de cerraduras del host (descargadas de /api/me/locks)
  const [hostLocks, setHostLocks] = useState([]);

  const [formData, setFormData] = useState({
    lockId: '',
    token: '',
    usuario: '',
    color: '#cccccc',
    fechaEntrada: '',
    fechaSalida: ''
  });

  // Asegurarte de que el usuario actual sea un host y de paso cargar sus locks
  useEffect(() => {
    // 1) Verificar usuario actual
    getCurrentUser()
      .then((user) => {
        if (user.tipo !== 'host') {
          console.warn('⚠ No eres un host. Redirigiendo a /client/home');
          navigate('/client/home');
          return;
        }

        // 2) Como es host, descargamos sus cerraduras
        listLocksOfCurrentHost()
          .then((locks) => {
            setHostLocks(locks);
          })
          .catch((err) => {
            console.error('Error al obtener cerraduras del host:', err);
          });
      })
      .catch((err) => {
        console.error('No autenticado o error al obtener /me', err);
        navigate('/register');
      });
  }, [navigate]);

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
  const formatDateTimeForLocalDateTime = (value) => {
    if (!value) return null;
    const date = new Date(value);
    const pad = (n) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  // Cuando se envía el formulario: creamos un Access
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.token && !formData.usuario) {
      alert("Debes proporcionar al menos un Token o un Usuario");
      return;
    }
  
    const accessPayload = {
      cerradura: { id: formData.lockId },
      token: formData.token || null,
      usuario: formData.usuario || null,
      fechaEntrada: formatDateTimeForLocalDateTime(formData.fechaEntrada),
      fechaSalida: formatDateTimeForLocalDateTime(formData.fechaSalida),
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
        {/* Selección de la cerradura */}
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

        {/* Token con autogenerar */}
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
                  token: generateToken(),
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

        {/* Color */}
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

        <button type="submit" className={styles.button}>
          Crear acceso
        </button>
      </form>
    </div>
  );
}

export default NewAccessForm;