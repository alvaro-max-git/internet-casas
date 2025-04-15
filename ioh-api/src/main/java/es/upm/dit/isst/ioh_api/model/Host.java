package es.upm.dit.isst.ioh_api.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotEmpty;

@Entity
@DiscriminatorValue("HOST")
public class Host extends User {
    @NotEmpty
    private String seamApiKey;

    private String googleAccessToken; // 🆕 Añadido para almacenar el token de Google


    public Host() {
        super();
    }

    public Host(String email, String password, Role role, String seamApiKey) {
        super(email, password, role);
        this.seamApiKey = seamApiKey;
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