// src/utils/notifications.js
import { toast } from 'react-toastify';

/*
  ===========================
  LOGIN
  ===========================
*/
export function notifyLoginSuccess() {
  toast.success('🎉 Bienvenido de nuevo!', {
    icon: '👋',
  });
}

export function notifyLoginError() {
  toast.error('❌ Credenciales incorrectas', {
    icon: '🔒',
  });
}

/*
  ===========================
  REGISTRO
  ===========================
*/
export function notifyRegisterUserSuccess() {
  toast.success('🙌 Usuario registrado con éxito', {
    icon: '🧑‍💻',
  });
}

export function notifyRegisterHostSuccess() {
  toast.success('🏠 Host registrado correctamente', {
    icon: '🔑',
  });
}

export function notifyRegisterError() {
  toast.error('❌ Error al registrar. Inténtalo de nuevo.', {
    icon: '⚠️',
  });
}