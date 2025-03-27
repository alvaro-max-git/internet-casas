// src/pages/EditAccessForm.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import styles from './AccessForm.module.css';
import ToggleMenu from "../../components/ToggleMenu";


function EditAccessForm() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { accessId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    from: '',
    to: '',
    color: '#cccccc'
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('accesses')) || [];
    const access = stored.find((a) => a.id === accessId);
    if (access) {
      setFormData(access);
    }
  }, [accessId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleMenu = (open) => {
    setMenuOpen(open);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = JSON.parse(localStorage.getItem('accesses')) || [];
    const updatedAccesses = updated.map((a) =>
      a.id === accessId ? { ...a, ...formData } : a
    );
    localStorage.setItem('accesses', JSON.stringify(updatedAccesses));
    navigate('/admin/home');
  };

  return (
    <div className={styles.container}>
       <div className={styles.navContainer}>
        <BackButton to="/admin/home" className={styles.backButtonCustom} />
        <ToggleMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
      </div>
      <h2 className={styles.title}>Editar acceso: {accessId}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label>Nombre</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </div>

        <div className={styles.fieldGroup}>
          <div className={styles.field}>
            <label>Desde</label>
            <input type="datetime-local" name="from" value={formData.from} onChange={handleChange} />
          </div>

          <div className={styles.field}>
            <label>Hasta</label>
            <input type="datetime-local" name="to" value={formData.to} onChange={handleChange} />
          </div>
        </div>

        <div className={styles.field}>
          <label>Color</label>
          <input type="color" name="color" value={formData.color} onChange={handleChange} />
        </div>

        <button type="submit" className={styles.button}>Guardar</button>
      </form>
    </div>
  );
}

export default EditAccessForm;