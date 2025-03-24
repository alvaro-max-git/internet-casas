// src/pages/NewAccessForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import styles from './AccessForm.module.css';
import ToggleMenu from "../../components/ToggleMenu";


function NewAccessForm() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    from: '',
    to: '',
    color: '#cccccc'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const toggleMenu = (open) => {
    setMenuOpen(open);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = formData.name.toLowerCase().replace(/\s+/g, '-');
    const newAccess = { id, ...formData };

    const stored = JSON.parse(localStorage.getItem('accesses')) || [];
    stored.push(newAccess);
    localStorage.setItem('accesses', JSON.stringify(stored));

    navigate('/admin/home');
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
          <label>Nombre</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className={styles.fieldGroup}>
          <div className={styles.field}>
            <label>Desde</label>
            <input type="datetime-local" name="from" value={formData.from} onChange={handleChange} required />
          </div>

          <div className={styles.field}>
            <label>Hasta</label>
            <input type="datetime-local" name="to" value={formData.to} onChange={handleChange} required />
          </div>
        </div>

        <div className={styles.field}>
          <label>Color</label>
          <input type="color" name="color" value={formData.color} onChange={handleChange} />
        </div>

        <button type="submit" className={styles.button}>Crear acceso</button>
      </form>
    </div>
  );
}

export default NewAccessForm;