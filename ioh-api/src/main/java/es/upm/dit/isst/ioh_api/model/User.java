package es.upm.dit.isst.ioh_api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;

@Entity
@Table(name="usuario")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public class User {

    @Id
    private String email; // PK

    private String password; // Añadimos el campo de contraseña

    public User() {
    }

    public User(String email) {
        this.email = email;
    }

    public User(String email, String password) {
        this.email = email;
        this.password = password;
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
}