// src/pages/AdminHome.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminHome.module.css';
import { FaPlus } from 'react-icons/fa';
import fotocerrradura from '../assets/cerradura.png';
import BackButton from '../components/BackButton';
import ToggleMenu from '../components/ToggleMenu';
import {
  getCurrentUser,
  listAccessesOfCurrentUser,
  deleteAccess,
} from '../services/api';
import { notifyAccessDeleted, notifyAccessDeleteError } from '../utils/notifications';

// Helper function to check if an access is expired
const isAccessExpired = (access) => {
  if (!access.fechaSalida) {
    return false; // No expiration date means it's never expired
  }
  // Compare expiration date with current date/time
  return new Date(access.fechaSalida) < new Date();
};


function AdminHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  // Separate states for active and expired accesses
  const [activeAccesses, setActiveAccesses] = useState([]);
  const [expiredAccesses, setExpiredAccesses] = useState([]);
  const navigate = useNavigate();
  const [deletingAccessId, setDeletingAccessId] = useState(null);

  const toggleMenu = (open) => setMenuOpen(open);

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        if (user.tipo !== 'host') {
          console.warn('⚠ Intento de acceso a AdminHome con un usuario que NO es host');
          navigate('/client/home');
          return;
        }

        listAccessesOfCurrentUser()
          .then((allAccesses) => {
            // Filter accesses into active and expired lists
            const active = allAccesses.filter(access => !isAccessExpired(access));
            const expired = allAccesses.filter(access => isAccessExpired(access));
            setActiveAccesses(active);
            setExpiredAccesses(expired);
          })
          .catch((err) => {
            console.error('Error al cargar accesos (Host)', err);
          });
      })
      .catch((err) => {
        console.error('No autenticado o error al obtener /me', err);
        navigate('/register');
      });
  }, [navigate]);

  const handleConfigure = (accessId) => {
    navigate(`/admin/access/${accessId}/edit`);
  };

  const handleDelete = async (accessId) => {
    const confirmDelete = window.confirm('¿Estás seguro de que quieres borrar este acceso?');
    if (!confirmDelete) return;

    setDeletingAccessId(accessId);

    try {
      await deleteAccess(accessId);
      // Remove from both lists after successful deletion
      setActiveAccesses((prev) => prev.filter((a) => a.id !== accessId));
      setExpiredAccesses((prev) => prev.filter((a) => a.id !== accessId));
      notifyAccessDeleted();
    } catch (error) {
      console.error('Error al borrar el acceso:', error);
      notifyAccessDeleteError();
    } finally {
      setDeletingAccessId(null);
    }
  };

  const handleAddAccess = () => {
    navigate('/admin/access/new');
  };

  const colores = JSON.parse(localStorage.getItem('accessColors') || '{}');

  // Helper function to render an access card
  const renderAccessCard = (access, isExpired = false) => (
    <div
      key={access.id}
      className={`${styles.accessCard} ${isExpired ? styles.expiredCard : ''}`} // Add expired style if needed
      style={{ backgroundColor: colores[access.id] || (isExpired ? '#f0f0f0' : '#FFE5BD') }} // Different color for expired
    >
      <img src={fotocerrradura} alt="Lock" className={styles.lockIcon} />
      <p><strong>Cerradura:</strong> {access.cerradura?.name || '(sin nombre)'}</p>
      <p><strong>Fecha de Entrada:</strong> <br></br>{formatDate(access.fechaEntrada)}</p>
      <p><strong>Fecha de Salida:</strong> <br></br>{formatDate(access.fechaSalida)}</p>
      {/* Show expiration date if expired */}
      {isExpired && <p><strong>Caducado:</strong> {new Date(access.fechaSalida).toLocaleString()}</p>}

      {/* Configure button only for active accesses */}
      {!isExpired && (
        <button
          className={styles.configureButton}
          onClick={() => handleConfigure(access.id)}
        >
          Configurar
        </button>
      )}
      <button
        className={styles.deleteButton}
        onClick={() => handleDelete(access.id)}
        disabled={deletingAccessId === access.id}
      >
        {deletingAccessId === access.id ? 'Borrando...' : 'Borrar'}
      </button>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.navContainer}>
        {/* <BackButton to="/register" className={styles.backButtonCustom} /> */}
        <ToggleMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
      </div>

      <div className={styles.mainContent}>
        <h1 className={styles.greeting}>Hola, Administrador</h1>

        {/* Active Accesses Section */}
        <h2 className={styles.subtitle}>Accesos Activos</h2>
        <div className={styles.accessList}>
          {activeAccesses.map(access => renderAccessCard(access, false))}

          {/* Card to add new access */}
          <div
            className={styles.accessCard}
            onClick={handleAddAccess}
            style={{ backgroundColor: '#DBD2DA', cursor: 'pointer' }}
          >
            <FaPlus className={styles.lockIcon} />
            <p> <strong>Agregar acceso</strong></p>
          </div>
        </div>

        {/* Expired Accesses Section */}
        {expiredAccesses.length > 0 && (
          <>
            <h2 className={`${styles.subtitle} ${styles.expiredTitle}`}>Accesos Caducados</h2>
            <div className={styles.accessList}>
              {expiredAccesses.map(access => renderAccessCard(access, true))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminHome;