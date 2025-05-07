package es.upm.dit.isst.ioh_api.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotEmpty;

@Entity
@DiscriminatorValue("HOST") // Indica que esta subclase de User se discrimina como "HOST" en la herencia
public class Host extends User {

    @NotEmpty
    private String seamApiKey; // Clave API para integración con el servicio de cerraduras Seam

    private String googleAccessToken; // 🆕 Añadido para almacenar el token de Google

    public Host() {
        super(); // Llama al constructor de la clase padre (User)
    }

    public Host(String email, String password, Role role, String seamApiKey) {
        super(email, password, role); // Inicializa los campos heredados
        this.seamApiKey = seamApiKey; // Establece la clave Seam específica del host
    }

    public String getSeamApiKey() {
        return seamApiKey;
    }

    public void setSeamApiKey(String seamApiKey) {
        this.seamApiKey = seamApiKey;
    }

    public String getGoogleAccessToken() {
        return googleAccessToken;
    }

    public void setGoogleAccessToken(String googleAccessToken) {
        this.googleAccessToken = googleAccessToken;
    }
}
