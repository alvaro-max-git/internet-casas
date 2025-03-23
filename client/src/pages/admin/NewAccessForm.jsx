import React from 'react';
import BackButton from '../../components/BackButton';

function NewAccessForm() {
  return (
    <div style={{ padding: '2rem' }}>
      <BackButton to="/admin/home" />
      <h2>Agregar nuevo acceso</h2>
      <form>
        <label>Nombre</label>
        <input type="text" placeholder="Ej: Calle Nueva 456" />

        <label>Desde</label>
        <input type="datetime-local" />

        <label>Hasta</label>
        <input type="datetime-local" />

        <button type="submit">Crear acceso</button>
      </form>
    </div>
  );
}

export default NewAccessForm;