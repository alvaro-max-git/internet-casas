import React from 'react';
import { useParams } from 'react-router-dom';
import BackButton from '../../components/BackButton';

function EditAccessForm() {
  const { accessId } = useParams();

  return (
    <div style={{ padding: '2rem' }}>
      <BackButton to="/admin/home" />
      <h2>Editar acceso: {accessId}</h2>
      <form>
        <label>Nombre</label>
        <input type="text" placeholder="Ej: Calle Falsa 123" />

        <label>Desde</label>
        <input type="datetime-local" />

        <label>Hasta</label>
        <input type="datetime-local" />

        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}

export default EditAccessForm;