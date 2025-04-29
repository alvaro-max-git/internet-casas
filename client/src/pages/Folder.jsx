// src/pages/Folder.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './AdminHome.module.css';
import styles_folder from './Folder.module.css'; // Asegúrate de tener este CSS
import AccessCard from '../components/AccessCard';
import BackButton from '../components/BackButton';

function Folder() {
  const location = useLocation();
  const navigate = useNavigate();
  const carpeta = location.state?.carpeta;

  const colores = JSON.parse(localStorage.getItem('accessColors') || '{}');

  if (!carpeta) {
    return <div>No se encontró la carpeta.</div>;
  }

  const handleOpen = (access) => {
    if (!access.cerradura?.id) {
      alert('Esta cerradura no tiene un ID válido');
      return;
    }

    navigate(`/client/access/${access.id}/open`, {
      state: { access, lock: access.cerradura },
    });
  };

  const handleDelete = (accessId) => {
    const confirmDelete = window.confirm('¿Seguro que quieres borrar este acceso?');
    if (confirmDelete) {
      const updated = carpeta.accesos.filter((a) => a.id !== accessId);
      const updatedFolder = { ...carpeta, accesos: updated };

      const allFolders = JSON.parse(localStorage.getItem('clientFolders')) || [];
      const newFolders = allFolders.map((f) =>
        f.id === carpeta.id ? updatedFolder : f
      );

      localStorage.setItem('clientFolders', JSON.stringify(newFolders));
      navigate('/client/home');
    }
  };

  const onDragStart = (e, access) => {
    const data = {
      access,
      source: 'carpeta',
      carpetaId: carpeta.id,
    };
    localStorage.setItem('draggedAccess', JSON.stringify(data));
  };

  const onDropOutside = () => {
    const data = JSON.parse(localStorage.getItem('draggedAccess'));
    if (!data || data.source !== 'carpeta') return;

    const allFolders = JSON.parse(localStorage.getItem('clientFolders')) || [];
    const updatedFolders = allFolders.map((folder) => {
      if (folder.id === data.carpetaId) {
        const updatedAccesos = folder.accesos.filter((a) => a.id !== data.access.id);
        return { ...folder, accesos: updatedAccesos };
      }
      return folder;
    });

    const allAccesses = JSON.parse(localStorage.getItem('clientAccesses')) || [];
    const updatedAccesses = [data.access, ...allAccesses];

    localStorage.setItem('clientFolders', JSON.stringify(updatedFolders));
    localStorage.setItem('clientAccesses', JSON.stringify(updatedAccesses));
    localStorage.removeItem('draggedAccess');

    navigate('/client/home');
  };

  // Eliminar la carpeta cuando esté vacía
  const handleDeleteFolder = () => {
    const confirmDelete = window.confirm('¿Seguro que quieres eliminar esta carpeta?');
    if (confirmDelete) {
      const allFolders = JSON.parse(localStorage.getItem('clientFolders')) || [];
      const newFolders = allFolders.filter((f) => f.id !== carpeta.id);

      localStorage.setItem('clientFolders', JSON.stringify(newFolders));
      navigate('/client/home'); // Volver a la vista principal
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.navContainer}>
        <BackButton to="/client/home" />
      </div>

      <h1 className={styles.greeting}>📁 {carpeta.nombre}</h1>
      <h2 className={styles.subtitle}>Accesos en esta carpeta</h2>

      {carpeta.accesos.length === 0 && (
        <button
          className={styles_folder.deleteButton}
          onClick={handleDeleteFolder}
        >
          Eliminar carpeta
        </button>
      )}

      <div
        className={styles.accessList}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDropOutside}
      >
        {carpeta.accesos.map((access) => (
          <AccessCard
            key={access.id}
            access={access}
            color={colores[access.id]}
            onOpen={handleOpen}
            onDelete={() => handleDelete(access.id)}
            draggable
            onDragStart={(e) => onDragStart(e, access)}
          />
        ))}
      </div>
    </div>
  );
}

export default Folder;
