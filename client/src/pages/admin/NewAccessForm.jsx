import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';

function NewAccessForm() {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = formData.name.toLowerCase().replace(/\s+/g, '-'); // ejemplo: '3A' => '3a'
    const newAccess = { id, ...formData };

    const stored = JSON.parse(localStorage.getItem('accesses')) || [];
    stored.push(newAccess);
    localStorage.setItem('accesses', JSON.stringify(stored));

    navigate('/admin/home');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <BackButton to="/admin/home" />
      <h2>Agregar nuevo acceso</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Desde</label>
        <input type="datetime-local" name="from" value={formData.from} onChange={handleChange} required />

        <label>Hasta</label>
        <input type="datetime-local" name="to" value={formData.to} onChange={handleChange} required />

        <label>Color</label>
        <input type="color" name="color" value={formData.color} onChange={handleChange} />

        <button type="submit">Crear acceso</button>
      </form>
    </div>
  );
}

export default NewAccessForm;