// src/pages/admin/NewAccessForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import styles from './AccessForm.module.css';
import ToggleMenu from '../../components/ToggleMenu';
import { notifyAccessCreated, notifyAccessCreationError} from '../../utils/notifications'; //notificaciones
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
  
//Función para abrir y cerrar el menú hamnurguesa
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

  //Función para formatear la fecha y hora
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
      const savedAccess = await createAccess(accessPayload);
  
      // ✅ Guardar color en localStorage
      const coloresGuardados = JSON.parse(localStorage.getItem('accessColors') || '{}');
      coloresGuardados[savedAccess.id] = formData.color;
      localStorage.setItem('accessColors', JSON.stringify(coloresGuardados));
  
      notifyAccessCreated();
      navigate('/admin/home');
    } catch (error) {
      console.error(error);
      notifyAccessCreationError();
    }
  };

  return (
    <div className={styles.background}>
    <div className={styles.container}>
      <div className={styles.navContainer}>
      <BackButton to="/admin/home" id="new-access-form-back-button" />
      <ToggleMenu menuOpen={menuOpen} toggleMenu={toggleMenu} id="new-access-form-toggle-menu" />
      </div>

      <h2 className={styles.title}>Agregar nuevo acceso</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Selección de la cerradura */}
        <div className={styles.field}>
          <label>Cerradura</label>
          <select
            id="select-lock"
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
          <input
            id="input-token"
            type="text"
            name="token"
            value={formData.token}
            onChange={handleChange}
            
          />
          <button
            id="generate-token-button"
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

        {/* Usuario (huésped) */}
        <div className={styles.field}>
          <label>Usuario</label>
          <input
            id="input-usuario"
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
            id="input-color"
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
              id="input-fecha-entrada"
              type="datetime-local"
              name="fechaEntrada"
              value={formData.fechaEntrada}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label>Hasta</label>
            <input
              id="input-fecha-salida"
              type="datetime-local"
              name="fechaSalida"
              value={formData.fechaSalida}
              onChange={handleChange}
            />
          </div>
        </div>

        <button id="submit-new-access" type="submit" className={styles.button}>
          Crear acceso
        </button>
      </form>
    </div>
    </div>
  );
}

export default NewAccessForm;