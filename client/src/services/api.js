// src/services/api.js

const API_BASE = "https://localhost:8443/api";

//const API_BASE = "https://internet-casas.onrender.com/api";

function getAuthHeaders() {
  const token = localStorage.getItem("sessionToken");
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}

/* ============================ ACCESOS ============================ */

// CREAR ACCESO

export async function createAccess(accessData) {
  const response = await fetch(`${API_BASE}/accesses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(accessData),
  });

  const responseText = await response.text();

  if (!response.ok) {
    console.error("❌ Error al crear Access:", response.status, response.statusText);
    console.error("Respuesta del servidor:", responseText);
    throw new Error("Error al crear Access");
  }

  return JSON.parse(responseText);
}

// OBTENER UN ACCESO POR SU ID
export async function getAccess(id) {
  const response = await fetch(`${API_BASE}/accesses/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error(`No se encontró Access con ID=${id}`);
  }
  return response.json();
}

// ACTUALIZAR ACCESO
export async function updateAccess(id, accessData) {
  const response = await fetch(`${API_BASE}/accesses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(accessData),
  });
  if (!response.ok) {
    throw new Error("Error al actualizar Access");
  }
  return response.json();
}

// ELIMINAR ACCESO
export async function deleteAccess(id) {
  const response = await fetch(`${API_BASE}/accesses/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Error al eliminar Access");
  }
}

// OBTENER ACCESOS POR TOKEN O USUARIO
export async function getAccessesByToken(token) {
  const response = await fetch(`${API_BASE}/accesses/by-token/${token}`);
  if (!response.ok) {
    throw new Error("No se encontraron accesos con ese token");
  }
  return response.json();
}

/* ============================ CERRADURAS ============================ */

export async function openLock(lockId) {
  const response = await fetch(`${API_BASE}/locks/${lockId}/open`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error(`No se pudo abrir la cerradura con ID=${lockId}`);
  }
  return response.text();
}

export const openLockWithAccess = async (accessId) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE}/accesses/${accessId}/open`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${token}` cambiado por:
        ...getAuthHeaders(),
      }
    });
    // Si el backend devuelve FORBIDDEN, lanzamos error con el mensaje que envía
    if (response.status === 403) {
      const backendMessage = await response.text();
      throw new Error("Acceso no válido o expirado");
    }
    if (!response.ok) {
      throw new Error('Failed to open lock');
    }
    // Suponemos que se retorna texto (mensaje de operación iniciada)
    return await response.text();
  } catch (error) {
    console.error('Error opening lock with access:', error);
    throw error;
  }
};

export async function getLock(lockId) {
  const response = await fetch(`${API_BASE}/locks/${lockId}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error(`No se encontró la cerradura con ID=${lockId}`);
  }
  return response.json();
}

// Cerraduras del host autenticado
export async function listLocksOfCurrentHost() {
  const response = await fetch(`${API_BASE}/me/locks`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("❌ Error al obtener las cerraduras del host actual");
  }
  return response.json();
}

// Accesos del host o usuario autenticado
export async function listAccessesOfCurrentUser() {
  const response = await fetch(`${API_BASE}/me/accesses`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("❌ Error al obtener los accesos del usuario actual");
  }
  return response.json();
}

/* ============================ AUTENTICACIÓN ============================ */

export async function registerHost(email, password, seamApiKey) {
  const response = await fetch(`${API_BASE}/auth/register/host`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, seamApiKey }),
  });

  if (!response.ok) {
    throw new Error("❌ Error al registrar host");
  }

  return response.json();
}

export async function registerUser(email, password) {
  const response = await fetch(`${API_BASE}/auth/register/user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("❌ Error al registrar usuario");
  }

  return response.json();
}

export async function login(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`❌ Error al iniciar sesión: ${errorText}`);
  }

  return response.json();
}

export async function logout() {
  const response = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("❌ Error al cerrar sesión");
  }
  return response.text();
}

export async function getCurrentUser() {
  const response = await fetch(`${API_BASE}/me`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("No autenticado");
  }
  return response.json();
}

/* ============================ GOOGLE CALENDAR ============================ */
export async function saveGoogleTokenToBackend(token) {
  const sessionToken = localStorage.getItem("sessionToken");

  const response = await fetch(`${API_BASE}/me/google-token`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      //Authorization: `Bearer ${sessionToken}`,
      ...getAuthHeaders(), // Cambiado por esto para usar el token de sesión
    },
    body: JSON.stringify({ googleAccessToken: token }),
  });

  if (!response.ok) {
    throw new Error("No se pudo guardar el token de Google");
  }

  return response.text(); // o .json() si devuelves un objeto
}

/* ============================ REGISTRO DE ACCESOS ============================ */
export async function getLockEvents() {
  const sessionToken = localStorage.getItem("sessionToken");
  const res = await fetch(`${API_BASE}/me/lock-events`, {
    headers: {
      headers: getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const text = await res.text(); // por si viene como texto plano
    throw new Error(text || "Error al obtener eventos desde tu backend");
  }
  return await res.json();
}