import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';

function EditAccessForm() {
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
    <div style={{ padding: '2rem' }}>
      <BackButton to="/admin/home" />
      <h2>Editar acceso: {accessId}</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />

        <label>Desde</label>
        <input type="datetime-local" name="from" value={formData.from} onChange={handleChange} />

        <label>Hasta</label>
        <input type="datetime-local" name="to" value={formData.to} onChange={handleChange} />

        <label>Color</label>
        <input type="color" name="color" value={formData.color} onChange={handleChange} />

        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}

export default EditAccessForm;