// src/components/AccessCard.jsx
import React from 'react';
import fotocerrradura from '../assets/cerradura.png';
import styles from '../pages/AdminHome.module.css'; // usa el mismo CSS

function AccessCard({ access, color, onOpen, onDelete, draggable, onDragStart }) {
  return (
    <div
      className={styles.accessCard}
      style={{ backgroundColor: color || '#D4EFFF' }}
      draggable={draggable}
      onDragStart={onDragStart}
    >
      <img src={fotocerrradura} alt="Lock" className={styles.lockIcon} />
      <p><strong>Cerradura:</strong> {access.cerradura?.name || '(sin nombre)'}</p>
      <p><strong>Usuario:</strong> {access.usuario || '—'}</p>
      <p><strong>Token:</strong> {access.token || '—'}</p>

      {onOpen && (
        <button className={styles.configureButton} onClick={() => onOpen(access)}>
          Abrir
        </button>
      )}
      {onDelete && (
        <button className={styles.deleteButton} onClick={() => onDelete(access.id)}>
          Borrar
        </button>
      )}
    </div>
  );
}

export default AccessCard;
