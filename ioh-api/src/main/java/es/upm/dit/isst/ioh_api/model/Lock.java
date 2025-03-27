package es.upm.dit.isst.ioh_api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Lock {

    @Id
    private String id; // El ID que te proporciona Seam (PK)

    @ManyToOne
    private Host propietario; // El host dueño de la cerradura

    // Podrías añadir más campos, por ejemplo:
    // private String marca;
    // private String modelo;

    public Lock() {
    }

    public Lock(String id, Host propietario) {
        this.id = id;
        this.propietario = propietario;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) { 
        this.id = id;
    }

    public Host getPropietario() {
        return propietario;
    }

    public void setPropietario(Host propietario) {
        this.propietario = propietario;
    }
}
