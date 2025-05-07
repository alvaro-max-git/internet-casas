import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles_folder from './Folder.module.css';
import styles from './AdminHome.module.css';
import AccessCard from '../components/AccessCard';
import ToggleMenu from '../components/ToggleMenu';
import BackButton from '../components/BackButton';
import { updateAccessFolder } from '../services/api';

function Folder() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const carpetaNombre = state?.carpetaNombre;
  const [folderAccesses, setFolderAccesses] = useState(state?.accesos || []);
  const colores = JSON.parse(localStorage.getItem('accessColors') || '{}');

  const toggleMenu = (open) => setMenuOpen(open);

  if (!carpetaNombre) return <div>No se encontró la carpeta.</div>;

  const handleOpen = access => {
    if (!access.cerradura?.id) return alert('Cerradura inválida');
    navigate(`/client/access/${access.id}/open`, { state: { access, lock: access.cerradura } });
  };

  const handleRemove = async accessId => {
    if (!window.confirm('¿Sacar este acceso de la carpeta?')) return;
    try {
      await updateAccessFolder(accessId, null);
      navigate('/client/home');
    } catch (err) {
      console.error('Error al sacar acceso de carpeta:', err);
    }
  };

  const onDragStart = (e, access) => {
    localStorage.setItem('draggedAccess', JSON.stringify({ access }));
  };

  const handleDragEnter = () => {
    setDragCounter(prev => {
      const next = prev + 1;
      if (next === 1) setIsDraggingOver(true);
      return next;
    });
  };

  const handleDragLeave = () => {
    setDragCounter(prev => {
      const next = prev - 1;
      if (next === 0) setIsDraggingOver(false);
      return next;
    });
  };

  const onDropOutside = async () => {
    const data = JSON.parse(localStorage.getItem('draggedAccess'));
    if (!data) return;
    try {
      await updateAccessFolder(data.access.id, null);
      localStorage.removeItem('draggedAccess');
      navigate('/client/home');
    } catch (err) {
      console.error('Error al mover fuera de carpeta:', err);
    }
  };

  return (
    <div
      className={styles_folder.pageWrapper}
      onDragEnter={handleDragEnter}
      onDragOver={e => e.preventDefault()}
      onDragLeave={handleDragLeave}
      onDrop={e => {
        setIsDraggingOver(false);
        setDragCounter(0);
        onDropOutside();
      }}
    >
      {isDraggingOver && (
        <div className={styles_folder.fullscreenDrop}>
          <div className={styles_folder.dropMessage}>🔽 Suelta aquí para remover</div>
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.navContainer}>  
          <BackButton to="/client/home" id="folder-back-button"/>
          <ToggleMenu menuOpen={menuOpen} toggleMenu={toggleMenu} id="folder-toggle-menu" />
        </div>
        <div className={styles.mainContent}>
          <h1 className={styles.greeting}>📁 {carpetaNombre}</h1>
          <h2 className={styles.subtitle}>Accesos en esta carpeta</h2>

          <div className={styles.accessList}>
            {folderAccesses.map(access => (
              <AccessCard
                id={`folder-access-card-${access.id}`}  // ← ID de la tarjeta en carpeta
                key={access.id}
                access={access}
                color={colores[access.id]}
                onOpen={() => handleOpen(access)}
                onDelete={() => handleRemove(access.id)}
                draggable
                onDragStart={e => onDragStart(e, access)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Folder;
