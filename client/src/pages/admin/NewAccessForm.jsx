import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import styles from './AccessForm.module.css';
import ToggleMenu from '../../components/ToggleMenu';
import { createAccess } from '../../services/api';

function NewAccessForm() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    hostEmail: '',
    lockId: '',
    token: '',
    usuario: '',
    fechaEntrada: '',
    fechaSalida: ''
  });

  const toggleMenu = (open) => setMenuOpen(open);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateToken = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accessPayload = {
      host: { email: formData.hostEmail },
      cerradura: { id: formData.lockId },
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
      <div className={styles.field}>
          <label>Nombre de la cerradura</label>
          <input type="text" name="nombreCerradura" value={formData.nombreCerradura} onChange={handleChange} />
        </div>
        <div className={styles.field}>
          <label>Email del Host</label>
          <input
            type="email"
            name="hostEmail"
            value={formData.hostEmail}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.field}>
          <label>ID de la Cerradura</label>
          <input
            type="text"
            name="lockId"
            value={formData.lockId}
            onChange={handleChange}
            required
          />
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
                token: generateToken()
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
          <input type="color"
          name="color" 
          value={formData.color} 
          onChange={handleChange} />
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

        <button type="submit" className={styles.button}>Crear acceso</button>
      </form>
    </div>
  );
}

export default NewAccessForm;