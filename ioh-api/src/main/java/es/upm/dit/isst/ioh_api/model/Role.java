package es.upm.dit.isst.ioh_api.model;

/**
 * Enumeración que define los diferentes roles de usuario disponibles en el sistema.
 * Se utiliza para la autorización y control de acceso.
 */
public enum Role {
    ROLE_USER,  // Rol básico para usuarios comunes (invitados, clientes, etc.)
    ROLE_HOST,  // Rol para usuarios anfitriones que poseen cerraduras y gestionan accesos
    ROLE_ADMIN  // Rol con privilegios de administración completa del sistema
}
