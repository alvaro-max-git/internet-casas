package es.upm.dit.isst.ioh_api.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@DiscriminatorValue("HOST")
public class Host extends User {

    private String seamApiKey;

    public Host() {
        super();
    }

    public Host(String email, String password, String seamApiKey) {
        super(email, password);
        this.seamApiKey = seamApiKey;
    }

    public String getSeamApiKey() {
        return seamApiKey;
    }

    public void setSeamApiKey(String seamApiKey) {
        this.seamApiKey = seamApiKey;
    }
}