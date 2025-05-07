package es.upm.dit.isst.ioh_api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;

@Entity
@Table(name="usuario") // La tabla se llamará "usuario" en la base de datos
@Inheritance(strategy = InheritanceType.SINGLE_TABLE) // Estrategia de herencia: una única tabla para todas las subclases
public class User {

    @Id @Email
    private String email; // Clave primaria e identificador del usuario, validado como email

    private String password; // Contraseña del usuario (idealmente almacenada en forma hash)

    @Enumerated(EnumType.STRING)
    private Role role; // Rol del usuario (USER, HOST, ADMIN), almacenado como texto en la BD

    public User() {
    }

    // Constructor sin contraseña
    public User(String email, Role role) {
        this.email = email;
        this.role = role;
    }

    // Constructor completo
    public User(String email, String password, Role role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // === Getters y Setters ===

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
