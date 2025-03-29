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

/*
  ===========================
  ACCESOS
  ===========================
*/

// Creación de acceso
export function notifyAccessCreated() {
  toast.success('🔓 Acceso creado correctamente', {
    icon: '📬',
  });
}
// Error al crear acceso
export function notifyAccessCreationError() {
  toast.error('❌ Error al crear el acceso. Inténtalo de nuevo.', {
    icon: '🚫',
  });
}
// Acceso eliminado
export function notifyAccessDeleted() {
  toast.success('🗑️ Acceso eliminado correctamente', {
    icon: '✔️',
  });
}
// Error al eliminar acceso
export function notifyAccessDeleteError() {
  toast.error('❌ Error al eliminar el acceso', {
    icon: '⚠️',
  });
}

// Acceso editado correctamente
export function notifyAccessUpdated() {
  toast.success('✅ Acceso editado correctamente', {
    icon: '✏️',
  });
}

// Error al editar acceso
export function notifyAccessUpdateError() {
  toast.error('❌ Error al editar el acceso', {
    icon: '⚠️',
  });
}