// src/pages/ClientHome.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminHome.module.css';
import { FaPlus } from 'react-icons/fa';
import BackButton from '../components/BackButton';
import ToggleMenu from '../components/ToggleMenu';
import { listAccessesOfCurrentUser } from '../services/api';
import AccessCard from '../components/AccessCard';

function ClientHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accesses, setAccesses] = useState([]);
  const [folders, setFolders] = useState([]);
  const navigate = useNavigate();

  const toggleMenu = (open) => setMenuOpen(open);

  useEffect(() => {
    const fetchAccesses = async () => {
      try {
        const response = await listAccessesOfCurrentUser();
        setAccesses(response);
        localStorage.setItem('clientAccesses', JSON.stringify(response));
      } catch (err) {
        console.error('❌ Error al obtener accesos del usuario:', err);
      }
    };
    fetchAccesses();
  }, []);

  const colores = JSON.parse(localStorage.getItem('accessColors') || '{}');

  const handleAccessByToken = () => {
    navigate('/client/access-loader');
  };

  const handleCreateFolder = () => {
    const nombre = prompt('Nombre de la carpeta:');
    if (nombre) {
      const nuevaCarpeta = {
        id: `carpeta-${Date.now()}`,
        nombre,
        accesos: [],
      };
      const nuevasCarpetas = [...folders, nuevaCarpeta];
      setFolders(nuevasCarpetas);
      localStorage.setItem('clientFolders', JSON.stringify(nuevasCarpetas));
    }
  };

  const handleOpenLock = (access) => {
    if (!access.cerradura?.id) {
      alert('Esta cerradura no tiene un ID válido');
      return;
    }

    navigate(`/client/access/${access.id}/open`, {
      state: {
        access,
        lock: access.cerradura,
      },
    });
  };

  const handleDelete = (accessId) => {
    const confirmDelete = window.confirm('¿Seguro que quieres borrar este acceso?');
    if (confirmDelete) {
      const updated = accesses.filter((a) => a.id !== accessId);
      setAccesses(updated);
      localStorage.setItem('clientAccesses', JSON.stringify(updated));
    }
  };

  const onDragStart = (access, source) => {
    const data = { access, source };
    localStorage.setItem('draggedAccess', JSON.stringify(data));
  };

  const onDrop = (folderId) => {
    const data = JSON.parse(localStorage.getItem('draggedAccess'));
    if (!data) return;

    const updatedFolders = folders.map((folder) => {
      if (folder.id === folderId) {
        return {
          ...folder,
          accesos: [...folder.accesos, data.access],
        };
      }
      return folder;
    });

    const updatedAccesses = accesses.filter((a) => a.id !== data.access.id);

    setAccesses(updatedAccesses);
    setFolders(updatedFolders);

    localStorage.setItem('clientFolders', JSON.stringify(updatedFolders));
    localStorage.setItem('clientAccesses', JSON.stringify(updatedAccesses));
    localStorage.removeItem('draggedAccess');
  };

  useEffect(() => {
    const savedFolders = localStorage.getItem('clientFolders');
    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    }
  }, []);

  const handleOpenFolder = (folder) => {
    navigate(`/client/folder/${folder.id}`, { state: { carpeta: folder } });
  };

  return (
    <div className={styles.container}>
      <div className={styles.navContainer}>
        <BackButton to="/register" />
        <ToggleMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
      </div>

      <div className={styles.mainContent}>
        <h1 className={styles.greeting}>Hola Cliente</h1>
        <h2 className={styles.subtitle}>Tus cerraduras disponibles</h2>

        <div className={styles.accessList}>
          {accesses.map((access) => (
            <AccessCard
              key={access.id}
              access={access}
              color={colores[access.id]}
              onOpen={handleOpenLock}
              onDelete={handleDelete}
              draggable
              onDragStart={() => onDragStart(access, 'fuera')}
            />
          ))}

          {folders.map((folder) => (
            <div
              key={folder.id}
              className={styles.accessCard}
              onClick={() => handleOpenFolder(folder)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(folder.id)}
              style={{ backgroundColor: '#F7D6E0', cursor: 'pointer' }}
            >
              <FaPlus className={styles.lockIcon} />
              <p><strong>📁 {folder.nombre}</strong></p>
              <p>{folder.accesos.length} acceso(s)</p>
              <p>Haz click para ver</p>
            </div>
          ))}

          {/* Botón para añadir acceso por token */}
          <div
            className={styles.accessCard}
            onClick={handleAccessByToken}
            style={{ backgroundColor: '#E2F0CB', cursor: 'pointer' }}
          >
            <FaPlus className={styles.lockIcon} />
            <p><strong>Añadir acceso con token</strong></p>
          </div>

          {/* Botón para crear carpeta */}
          <div
            className={styles.accessCard}
            onClick={handleCreateFolder}
            style={{ backgroundColor: '#FDE2E4', cursor: 'pointer' }}
          >
            <FaPlus className={styles.lockIcon} />
            <p><strong>Crear carpeta de accesos</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientHome;
