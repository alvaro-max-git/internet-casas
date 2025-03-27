package es.upm.dit.isst.ioh_api.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
//@Table(name = "app_user")
@DiscriminatorValue("HOST") // solo aplica si usas SINGLE_TABLE
public class Host extends User {
    
    // Campos específicos de un Host
    private String seamApiKey; // para conectar con la API de Seam

    public Host() {
        super();
    }

    public Host(String email, String seamApiKey) {
        super(email);
        this.seamApiKey = seamApiKey;
    }

    public String getSeamApiKey() {
        return seamApiKey;
    }

    public void setSeamApiKey(String seamApiKey) {
        this.seamApiKey = seamApiKey;
    }
}
