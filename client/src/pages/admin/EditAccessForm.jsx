// src/pages/EditAccessForm.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import styles from './AccessForm.module.css';
import ToggleMenu from '../../components/ToggleMenu';
import {
  getCurrentUser,
  listLocksOfCurrentHost,
  getAccess,
  updateAccess
} from '../../services/api';
import {
  notifyAccessUpdated,
  notifyAccessUpdateError
} from '../../utils/notifications';

function EditAccessForm() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { accessId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    lockId: '',
    token: '',
    usuario: '',
    color: '#cccccc',
    fechaEntrada: '',
    fechaSalida: ''
  });

  const [hostLocks, setHostLocks] = useState([]);

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        if (user.tipo !== 'host') {
          console.warn('⚠ No eres un host. Redirigiendo a /client/home');
          navigate('/client/home');
          return;
        }
        listLocksOfCurrentHost()
          .then((locks) => setHostLocks(locks))
          .catch((err) => console.error('Error al obtener cerraduras:', err));
      })
      .catch((err) => {
        console.error('Error al autenticar:', err);
        navigate('/register');
      });
  }, [navigate]);

  useEffect(() => {
    getAccess(accessId)
      .then((data) => {
        const colores = JSON.parse(localStorage.getItem('accessColors') || '{}');
        const colorGuardado = colores[accessId] || '#cccccc';
        setFormData({
          lockId: data.cerradura?.id || '',
          token: data.token || '',
          usuario: data.usuario || '',
          color: '#cccccc',
          fechaEntrada: data.fechaEntrada?.slice(0, 16) || '',
          fechaSalida: data.fechaSalida?.slice(0, 16) || ''
        });
      })
      .catch((err) => {
        console.error('Error al obtener el acceso', err);
        navigate('/admin/home');
      });
  }, [accessId, navigate]);

  const toggleMenu = (open) => setMenuOpen(open);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
      await updateAccess(accessId, accessPayload);
      const colores = JSON.parse(localStorage.getItem('accessColors') || '{}');
      colores[accessId] = formData.color;
      localStorage.setItem('accessColors', JSON.stringify(colores));
      notifyAccessUpdated();
      navigate('/admin/home');
    } catch (error) {
      console.error(error);
      notifyAccessUpdateError();
    }
  };

  return (
  <div className={styles.background}>
    <div className={styles.container}>
      <div className={styles.navContainer}>
        <BackButton to="/admin/home" className={styles.backButtonCustom} />
        <ToggleMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
      </div>

      <h2 className={styles.title}>Editar acceso</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
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

        <div className={styles.field}>
          <label>Token</label>
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

        <div className={styles.field}>
          <label>Usuario</label>
          <input
            type="text"
            name="usuario"
            value={formData.usuario}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label>Color de tarjeta</label>
          <input
            type="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
          />
        </div>

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
          Guardar cambios
        </button>
      </form>
    </div>
    </div>
  );
}

export default EditAccessForm;
