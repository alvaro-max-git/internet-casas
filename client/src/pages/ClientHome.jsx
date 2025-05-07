// src/pages/ClientHome.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminHome.module.css';
import { FaPlus } from 'react-icons/fa';
import ToggleMenu from '../components/ToggleMenu';
import { listAccessesOfCurrentUser, updateAccessFolder } from '../services/api';
import AccessCard from '../components/AccessCard';

function ClientHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accesses, setAccesses] = useState([]);
  const [folders, setFolders] = useState([]);
  const navigate = useNavigate();

  const toggleMenu = (open) => setMenuOpen(open);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('clientFolders') || '[]');
    setFolders(saved);
    fetchAccesses();
  }, []);

  useEffect(() => {
    localStorage.setItem('clientFolders', JSON.stringify(folders));
  }, [folders]);

  const fetchAccesses = async () => {
    try {
      const resp = await listAccessesOfCurrentUser();
      setAccesses(resp);
    } catch (err) {
      console.error('❌ Error al obtener accesos:', err);
    }
  };

  const colores = JSON.parse(localStorage.getItem('accessColors') || '{}');

  const handleAccessByToken = () => navigate('/client/access-loader');

  const handleCreateFolder = () => {
    const nombre = prompt('Nombre de la nueva carpeta:');
    if (!nombre) return;
    if (folders.includes(nombre)) {
      alert('Esa carpeta ya existe');
      return;
    }
    setFolders(prev => [...prev, nombre]);
  };

  const handleDeleteFolder = (folderName) => {
    if (!window.confirm(`¿Eliminar carpeta "${folderName}"? Esta acción no se puede deshacer.`)) return;
    setFolders(prev => prev.filter((f) => f !== folderName));
  };

  const handleOpenLock = (access) => {
    if (!access.cerradura?.id) return alert('Cerradura inválida');
    navigate(`/client/access/${access.id}/open`, { state: { access, lock: access.cerradura } });
  };

  const handleMoveToFolder = async (accessId, carpetaName) => {
    try {
      await updateAccessFolder(accessId, carpetaName);
      fetchAccesses();
    } catch (error) {
      console.error('❌ Error al mover acceso:', error);
    }
  };

  const handleDragStart = (access) => {
    localStorage.setItem('draggedAccess', JSON.stringify({ access }));
  };

  const handleDropOnFolder = (folderName) => {
    const data = JSON.parse(localStorage.getItem('draggedAccess'));
    if (!data) return;
    handleMoveToFolder(data.access.id, folderName);
    localStorage.removeItem('draggedAccess');
  };

  const freeAccesses = accesses.filter(a => !a.carpeta);

  return (
    <div className={styles.container}>
      <div className={styles.navContainer}>
        {/* <BackButton to="/register" /> */}
        <ToggleMenu menuOpen={menuOpen} toggleMenu={toggleMenu}  id="toggle-menu-clienthome" />
      </div>
      <div className={styles.mainContent}>
        <h1 className={styles.greeting}>Hola Cliente</h1>
        <h2 className={styles.subtitle}>Tus accesos</h2>

        <div className={styles.accessList}>
          {/* Accesos sin carpeta */}
          {freeAccesses.map(access => (
            <AccessCard
              id={`access-card-${access.id}`} // 🆕 ID para la tarjeta
              key={access.id}
              access={access}
              color={colores[access.id]}
              onOpen={() => handleOpenLock(access)}
              draggable
              onDragStart={() => handleDragStart(access)}
            />
          ))}

          {/* Carpetas (siempre visibles) */}
          {folders.map(folderName => {
            const count = accesses.filter(a => a.carpeta === folderName).length;
            return (
              <div
                id={folderId} // 🆕 ID para la carpeta
                key={folderName}
                className={styles.accessCard}
                onClick={() => navigate(
                  `/client/folder/${folderName}`,
                  { state: { carpetaNombre: folderName, accesos: accesses.filter(a => a.carpeta === folderName) } }
                )}
                onDragOver={e => e.preventDefault()}
                onDrop={() => handleDropOnFolder(folderName)}
                style={{ backgroundColor: '#F7D6E0', cursor: 'pointer' }}
              >
                <h1><strong>📁 {folderName}</strong></h1>
                <p>{count} acceso(s)</p>
                {count === 0 && (
                  <button
                    id={`delete-folder-${folderId}`} // 🆕 ID botón eliminar carpeta
                    className={styles.deleteButton}
                    onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folderName); }}
                  >
                    Eliminar carpeta
                  </button>
                )}
              </div>
            );
          })}

          {/* Añadir acceso por token */}
          <div
            id="add-access-token-card" // 🆕 ID
            className={styles.accessCard}
            onClick={handleAccessByToken}
            style={{ backgroundColor: '#E2F0CB', cursor: 'pointer' }}
          >
            <FaPlus className={styles.lockIcon} />
            <p><strong>Añadir acceso con token</strong></p>
          </div>

          {/* Crear carpeta vacía */}
          <div
            id="create-folder-card" // 🆕 ID
            className={styles.accessCard}
            onClick={handleCreateFolder}
            style={{ backgroundColor: '#FDE2E4', cursor: 'pointer' }}
          >
            <FaPlus className={styles.lockIcon} />
            <p><strong>Crear carpeta</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientHome;