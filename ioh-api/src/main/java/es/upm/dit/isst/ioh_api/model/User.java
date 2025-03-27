package es.upm.dit.isst.ioh_api.model;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;


@Entity
@Table(name="usuario")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE) // o JOINED, según prefieras
public class User {

    @Id
    private String email; // PK

    // Campos básicos que compartan todos los usuarios
    // Por ejemplo:
    // private String password; (si fuese necesario)
    // private String nombre;
    
    public User() {
    }

    public User(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
