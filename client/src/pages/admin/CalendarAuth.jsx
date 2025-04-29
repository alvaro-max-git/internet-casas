// src/pages/CalendarAuth.jsx
import React, { useState, useEffect } from 'react';
import styles from '../AdminHome.module.css';
import BackButton from '../../components/BackButton';
import ToggleMenu from '../../components/ToggleMenu';
import { FaCalendarAlt } from 'react-icons/fa';
import { useGoogleLogin } from '@react-oauth/google';
import {
  notifyGoogleLoginSuccess,
  notifyGoogleLoginError,
  notifyGoogleEventSyncSuccess,
  notifyGoogleEventSyncError,
  notifyGoogleLogoutSuccess
} from '../../utils/notifications';
import { saveGoogleTokenToBackend } from '../../services/api';

function CalendarAuth() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [googleName, setGoogleName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [googleLoggedIn, setGoogleLoggedIn] = useState(false);

  const toggleMenu = (open) => setMenuOpen(open);

  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
    access_type: 'offline',
    prompt: 'consent',
    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse.access_token;
      localStorage.setItem("googleAccessToken", accessToken);
      setGoogleLoggedIn(true);

      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        const profile = await res.json();
        setGoogleName(profile.name);
        setUserEmail(profile.email);

        await saveGoogleTokenToBackend(accessToken);
        notifyGoogleLoginSuccess();
      } catch (err) {
        console.error('❌ Error al obtener perfil o guardar token:', err);
        notifyGoogleLoginError();
      }
    },
    onError: () => notifyGoogleLoginError()
  });

  useEffect(() => {
    const token = localStorage.getItem("googleAccessToken");

    if (!token) {
      setGoogleLoggedIn(false);
      return;
    }

    fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Token expirado o inválido");
        return res.json();
      })
      .then(profile => {
        setGoogleName(profile.name);
        setUserEmail(profile.email);
        setGoogleLoggedIn(true);
      })
      .catch(err => {
        console.warn("⚠️ No se pudo restaurar la sesión de Google:", err);
        localStorage.removeItem("googleAccessToken");
        setGoogleLoggedIn(false);
      });
  }, []);

  const handleLoadEvents = async () => {
    try {
      const sessionToken = localStorage.getItem("sessionToken");
      if (!sessionToken) return notifyGoogleEventSyncError();

      const tokenRes = await fetch("https://localhost:8443/api/me/google-token", {
        headers: { Authorization: `Bearer ${sessionToken}` }
      });

      if (!tokenRes.ok) throw new Error("Error obteniendo token de Google");
      const { googleAccessToken } = await tokenRes.json();

      const accessesRes = await fetch("https://localhost:8443/api/me/accesses", {
        headers: { Authorization: `Bearer ${sessionToken}` }
      });

      if (!accessesRes.ok) throw new Error("Error obteniendo accesos");
      const accesses = await accessesRes.json();

      for (const access of accesses) {
        const event = {
          summary: `Acceso a ${access.cerradura?.name || 'cerradura desconocida'}`,
          description: `Asignado a: ${access.usuario || '—'}`,
          start: { dateTime: access.fechaEntrada, timeZone: 'Europe/Madrid' },
          end: { dateTime: access.fechaSalida, timeZone: 'Europe/Madrid' }
        };

        await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${googleAccessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(event)
        });
      }

      notifyGoogleEventSyncSuccess();
      window.location.reload();
    } catch (err) {
      console.error("❌ Error al sincronizar eventos:", err);
      notifyGoogleEventSyncError();
    }
  };

  const handleGoogleLogout = async () => {
    try {
      const sessionToken = localStorage.getItem("sessionToken");
      if (!sessionToken) return;
  
      await fetch("https://localhost:8443/api/me/google-token", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${sessionToken}` }
      });
  
      localStorage.removeItem("googleAccessToken");
      setGoogleName(null);
      setUserEmail(null);
      setGoogleLoggedIn(false);
  
      // ✅ Notificación
      notifyGoogleLogoutSuccess();
    } catch (error) {
      console.error("❌ Error al cerrar sesión de Google:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.navContainer}>
        <BackButton to="/admin/home" />
        <ToggleMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
      </div>

      <div className={styles.mainContent}>
        <h1 className={styles.greeting}>Sincroniza tus accesos con Google Calendar</h1>

        {!googleLoggedIn && (
          <div className={styles.googleLoginBox}>
            <p className={styles.subtitle}>Conecta con Google Calendar</p>
            <button className={styles.googleLoginButton} onClick={login}>
              Iniciar sesión con Google
            </button>
          </div>
        )}

        {googleLoggedIn && (
          <>
            <div className={styles.googleCalendarContainer}>
              <p className={styles.subtitle}>
                Sesión iniciada como <strong>{googleName}</strong>
              </p>

              <button className={styles.syncButton} onClick={handleLoadEvents}>
                <FaCalendarAlt style={{ marginRight: '8px' }} />
                Cargar accesos en Google Calendar
              </button>

              <button className={styles.logoutButton} onClick={handleGoogleLogout}>
                Cerrar sesión de Google
              </button>
            </div>

            <div className={styles.calendarFrameWrapper}>
              <iframe
                title="Calendario de Google"
                src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(userEmail)}&ctz=Europe/Madrid`}
                className={styles.calendarIframe}
              ></iframe>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CalendarAuth;