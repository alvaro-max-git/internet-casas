// src/pages/AdminHome.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminHome.module.css';
import { FaPlus } from 'react-icons/fa';

import lockIcon from '../assets/IoH-lockiconusermenu.png';
import BackButton from '../components/BackButton';
import ToggleMenu from '../components/ToggleMenu';
import { listAccessesByHost, deleteAccess } from '../services/api';


function AdminHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accesses, setAccesses] = useState([]); // Renombramos a 'accesses' en vez de 'locks'
  const navigate = useNavigate();

  const toggleMenu = (open) => setMenuOpen(open);

  // Manejo del botón "Configurar": abrimos un formulario de edición
  const handleConfigure = (accessId) => {
    navigate(`/admin/access/${accessId}/edit`);
  };

  // Manejo del botón "Borrar": hacemos DELETE en backend y removemos del state
  const handleDelete = async (accessId) => {
    const confirmDelete = window.confirm('¿Estás seguro de que quieres borrar este acceso?');
    if (!confirmDelete) return;
    try {
      await deleteAccess(accessId);
      // Quitamos del estado
      setAccesses((prev) => prev.filter((a) => a.id !== accessId));
    } catch (error) {
      console.error('Error al borrar el acceso:', error);
    }
  };

  // Manejo del botón "Agregar acceso": vamos al formulario de creación
  const handleAddAccess = () => {
    navigate('/admin/access/new');
  };

  // Cargar la lista de Accesses del Host
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) return;

    listAccessesByHost(email)
      .then((data) => setAccesses(data))
      .catch((err) => console.error('Error al cargar accesos:', err));
  }, []);

  return (
    <div className={styles.container}>
      {/* NAV SUPERIOR */}
      <div className={styles.navContainer}>
        <BackButton to="/register" className={styles.backButtonCustom} />
        <ToggleMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className={styles.mainContent}>
        <h1 className={styles.greeting}>Hola, Administrador</h1>
        <h2 className={styles.subtitle}>Accesos activos</h2>

        <div className={styles.accessList}>
          {accesses.map((access) => (
            <div
              key={access.id}
              className={styles.accessCard}
              style={{ backgroundColor: '#FFE5BD' }}
            >
              <img src={lockIcon} alt="Lock" className={styles.lockIcon} />
              
              {/* Mostramos algo de info del acceso */}
              <p>Cerradura: {access.cerradura?.id || '(sin cerradura)'}</p>
              <p>Usuario: {access.usuario || '—'}</p>
              <p>Token: {access.token || '—'}</p>
              {/* Puedes mostrar fechaEntrada, fechaSalida, etc. */}
              
              <button
                className={styles.configureButton}
                onClick={() => handleConfigure(access.id)}
              >
                Configurar
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(access.id)}
              >
                Borrar
              </button>
            </div>
          ))}

          {/* Tarjeta para agregar acceso */}
          <div
            className={styles.accessCard}
            onClick={handleAddAccess}
            style={{ backgroundColor: '#DBD2DA' }}
          >
            <FaPlus className={styles.lockIcon} />
            <p>Agregar acceso</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;