// src/pages/AdminHome.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminHome.module.css';
import { FaPlus } from 'react-icons/fa';

//import lockIcon from '../assets/IoH-lockiconusermenu.png'; Icono de cerradura antiguo
import fotocerrradura from '../assets/cerradura.png';
import BackButton from '../components/BackButton';
import ToggleMenu from '../components/ToggleMenu';

// Importa las llamadas de API que te interesen
import {
  getCurrentUser,
  listAccessesOfCurrentUser,
  deleteAccess,
} from '../services/api';
import { notifyAccessDeleted, notifyAccessDeleteError } from '../utils/notifications';

function AdminHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accesses, setAccesses] = useState([]);
  const navigate = useNavigate();

  //Estado para la eliminación de un acceso (botón de eliminar)
  const [deletingAccessId, setDeletingAccessId] = useState(null);

  // Para abrir/cerrar menú hamburguesa
  const toggleMenu = (open) => setMenuOpen(open);

  // Llamada al backend para obtener los accesos del host actual
  useEffect(() => {
    // 1) Verifica que el usuario actual sea un host
    getCurrentUser()
      .then((user) => {
        if (user.tipo !== 'host') {
          console.warn('⚠ Intento de acceso a AdminHome con un usuario que NO es host');
          // Podrías redirigir a otro sitio, o mostrar error
          navigate('/client/home');
          return;
        }

        // 2) Ya es Host, pedimos sus accesos
        listAccessesOfCurrentUser()
          .then((data) => {
            setAccesses(data);
          })
          .catch((err) => {
            console.error('Error al cargar accesos (Host)', err);
          });
      })
      .catch((err) => {
        // No está autenticado o falló
        console.error('No autenticado o error al obtener /me', err);
        // Podrías redirigir a /register
        navigate('/register');
      });
  }, [navigate]);

  // Botón para editar un acceso existente
  const handleConfigure = (accessId) => {
    navigate(`/admin/access/${accessId}/edit`);
  };

  // Botón para borrar un acceso (DELETE en backend + quitar del state)
  const handleDelete = async (accessId) => {
    const confirmDelete = window.confirm('¿Estás seguro de que quieres borrar este acceso?');
    if (!confirmDelete) return;

    setDeletingAccessId(accessId); // ⬅️ Activa el spinner

    try {
      await deleteAccess(accessId);
      setAccesses((prev) => prev.filter((a) => a.id !== accessId));
      notifyAccessDeleted();
    } catch (error) {
      console.error('Error al borrar el acceso:', error);
      notifyAccessDeleteError();
    } finally {
      setDeletingAccessId(null); // ⬅️ Lo quitamos
    }
  };

  // Botón para ir al formulario de creación
  const handleAddAccess = () => {
    navigate('/admin/access/new');
  };
  const colores = JSON.parse(localStorage.getItem('accessColors') || '{}');
  return (
    <div className={styles.container}>
      {/* Menú superior (BackButton + ToggleMenu) */}
      <div className={styles.navContainer}>
        <BackButton to="/register" className={styles.backButtonCustom} />
        <ToggleMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
      </div>

      {/* Contenido principal */}
      <div className={styles.mainContent}>
        <h1 className={styles.greeting}>Hola, Administrador</h1>
        <h2 className={styles.subtitle}>Accesos activos</h2>

        <div className={styles.accessList}>
          {accesses.map((access) => (
            <div
              key={access.id}
              className={styles.accessCard}
              style={{ backgroundColor: colores[access.id] || '#FFE5BD' }}
            >
              <img src={fotocerrradura} alt="Lock" className={styles.lockIcon} />
              {/* Info básica del Access */}
              <p><strong>Cerradura:</strong> {access.cerradura?.name || '(sin nombre)'}</p>
              <p><strong>Usuario:</strong> {access.usuario || '—'}</p>
              <p><strong>Token:</strong> {access.token || '—'}</p>

              <button
                className={styles.configureButton}
                onClick={() => handleConfigure(access.id)}
              >
                Configurar
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(access.id)}
                disabled={deletingAccessId === access.id}
              >
                {deletingAccessId === access.id ? 'Borrando...' : 'Borrar'}
              </button>
            </div>
          ))}

          {/* Tarjeta para agregar un nuevo acceso */}
          <div
            className={styles.accessCard}
            onClick={handleAddAccess}
            style={{ backgroundColor: '#DBD2DA', cursor: 'pointer' }}
          >
            <FaPlus className={styles.lockIcon} />
            <p> <strong>Agregar acceso</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;