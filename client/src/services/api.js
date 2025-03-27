// src/services/api.js

// ¡Ajusta la URL según tu configuración!
// Para desarrollo local: http://localhost:8080/api
// Si despliegas el backend en otro dominio, actualiza esta constante.
const API_BASE = "http://localhost:8080/api";

/*
  ============================
  Accesos
  ============================
*/
// Crear un Access nuevo
export async function createAccess(accessData) {
    const response = await fetch(`${API_BASE}/accesses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(accessData),
    });
  
    const responseText = await response.text(); // ← capturamos la respuesta aunque falle
  
    if (!response.ok) {
      console.error("❌ Error al crear Access:", response.status, response.statusText);
      console.error("Respuesta del servidor:", responseText);
      throw new Error("Error al crear Access");
    }
  
    return JSON.parse(responseText); // ← usamos el texto porque ya lo habíamos leído
  }

// Obtener Access por ID
export async function getAccess(id) {
  const response = await fetch(`${API_BASE}/accesses/${id}`);
  if (!response.ok) {
    throw new Error(`No se encontró Access con ID=${id}`);
  }
  return response.json();
}

// Actualizar un Access
export async function updateAccess(id, accessData) {
  const response = await fetch(`${API_BASE}/accesses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(accessData),
  });
  if (!response.ok) {
    throw new Error("Error al actualizar Access");
  }
  return response.json(); // Retorna el Access actualizado
}

// Eliminar un Access
export async function deleteAccess(id) {
  const response = await fetch(`${API_BASE}/accesses/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Error al eliminar Access");
  }
  // no retornamos nada porque el backend no retorna nada
}

/*
  ============================
  Cerraduras
  ============================
*/
// Abrir una cerradura
export async function openLock(lockId) {
  const response = await fetch(`${API_BASE}/locks/${lockId}/open`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`No se pudo abrir la cerradura con ID=${lockId}`);
  }
  return response.text(); // el endpoint retorna un texto
}

// Listar cerraduras
export async function listLocks() {
  const response = await fetch(`${API_BASE}/locks`);
  if (!response.ok) {
    throw new Error("Error al obtener lista de cerraduras");
  }
  return response.json();
}

// Detalles de una cerradura
export async function getLock(lockId) {
  const response = await fetch(`${API_BASE}/locks/${lockId}`);
  if (!response.ok) {
    throw new Error(`No se encontró la cerradura con ID=${lockId}`);
  }
  return response.json();
}
/*
  ============================
  Registro de hosts
  ============================
*/

// Crear un nuevo host
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

  /*
  ============================
  Registro de usuarios
  ============================
*/
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

  /*
  ============================
  Login común entre usuarios y hosts
  ============================
*/

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


