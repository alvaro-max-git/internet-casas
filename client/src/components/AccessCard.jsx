import React from 'react';
import fotocerrradura from '../assets/cerradura.png';
import styles from '../pages/AdminHome.module.css'; // usa el mismo CSS

function AccessCard({ access, color, onOpen, draggable, onDragStart }) {
  // Función para verificar si la fecha actual está dentro del rango de acceso
  const isAccessExpired = () => {
    const currentDate = new Date();
    const fechaEntrada = new Date(access.fechaEntrada);
    const fechaSalida = new Date(access.fechaSalida);
    
    // Verificar si la fecha actual está fuera del rango
    return currentDate < fechaEntrada || currentDate > fechaSalida;
  };

    // Función para formatear las fechas de manera legible
    const formatDate = (date) => {
      if (!date) return '—';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString('es-ES', options);
    };

  return (
    <div
      className={styles.accessCard}
      style={{ backgroundColor: color || '#D4EFFF' }}
      draggable={draggable}
      onDragStart={onDragStart}
    >
      <img src={fotocerrradura} alt="Lock" className={styles.lockIcon} />
      <p><strong>Cerradura:</strong> {access.cerradura?.name || '(sin nombre)'}</p>
      <p><strong>Fecha de Entrada:</strong> <br></br>{formatDate(access.fechaEntrada)}</p>
      <p><strong>Fecha de Salida:</strong> <br></br>{formatDate(access.fechaSalida)}</p>

      {/* Mostrar "Acceso caducado" si la fecha actual está fuera del rango */}
      {isAccessExpired() ? (
        <div className={styles.expiredMessage}>
          Acceso caducado
        </div>
      ) : (
        // Si no está caducado, mostrar el botón "Abrir"
        <button className={styles.configureButton} onClick={() => onOpen(access)}>
          Abrir
        </button>
      )}
    </div>
  );
}

export default AccessCard;
