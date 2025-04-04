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
  LOGOUT
  ===========================
*/
// Sesión cerrada correctamente
export function notifyLogoutSuccess() {
  toast.info('👋 Sesión cerrada correctamente', {
    icon: '🔒',
  });
}

// Error al cerrar sesión
export function notifyLogoutError() {
  toast.error('❌ Error al cerrar sesión', {
    icon: '⚠️',
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

//Acceso agregado (como cliente)
export function notifyAccessLinked() {
  toast.success('🔗 Acceso agregado a tu cuenta', {
    icon: '🔑',
  });
}
// Error al vincular acceso existente al usuario
export function notifyAccessLinkError() {
  toast.error('❌ No se pudo vincular el acceso a tu cuenta', {
    icon: '⚠️',
  });
}

// Error cuando el acceso está caducado o fuera de fecha
export function notifyAccessExpired() {
  toast.error('❌ Acceso caducado o fuera de fecha', {
    icon: '⚠️',
  });
}

/*
  ===========================
  CERRADURAS
  ===========================
*/
// Cerradura abierta correctamente
export function notifyLockOpened() {
  toast.success('🔓 Cerradura abierta correctamente', {
    icon: '✅',
  });
}

// Error al abrir la cerradura
export function notifyLockOpenError() {
  toast.error('❌ Error al abrir la cerradura', {
    icon: '🚫',
  });
}

/*
  ===========================
  GOOGLE CALENDAR
  ===========================
*/

// Login exitoso con Google
export function notifyGoogleLoginSuccess() {
  toast.success('✅ Sesión con Google iniciada correctamente', {
    icon: '🟢',
  });
}

// Error al iniciar sesión con Google
export function notifyGoogleLoginError() {
  toast.error('❌ Error al iniciar sesión con Google', {
    icon: '⚠️',
  });
}

// cargar eventos de Google Calendar
export function notifyGoogleEventSyncSuccess() {
  toast.success('📅 Accesos cargados al Google Calendar', {
    icon: '📤',
  });
}

// Error al sincronizar eventos de Google Calendar
export function notifyGoogleEventSyncError() {
  toast.error('❌ No se pudieron cargar los accesos al calendario', {
    icon: '⚠️',
  });
}

export function notifyGoogleLogoutSuccess() {
  toast.success('✅ Sesión de Google cerrada correctamente', {
    icon: '🚪',
  });
}