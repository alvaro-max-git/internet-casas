package es.upm.dit.isst.ioh_api.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;

@Entity
public class Session {
 @Id private String sessionToken;
//TODO Hacer con objeto usuario
 @Email private String userEmail;

 private LocalDateTime creationTime;
 private LocalDateTime expirationTime;

 public Session() {
    //Constructor vacío
 }

 public Session(String sessionToken, String userEmail) {
    this.sessionToken = sessionToken;
    this.userEmail = userEmail;
    this.creationTime = LocalDateTime.now();
    this.expirationTime = LocalDateTime.now().plusHours(1);
 }

 public boolean isValid() {
    return LocalDateTime.now().isBefore(expirationTime);
 }

    // === Getters y Setters ===...

    public String getSessionToken() {
        return sessionToken;
    }

    public void setSessionToken(String sessionToken) {
        this.sessionToken = sessionToken;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }
    public String getUserEmail() {
        return userEmail;
    }

    public LocalDateTime getCreationTime() { return creationTime; }
    public void setCreationTime(LocalDateTime creationTime) { this.creationTime = creationTime; }
    
    public LocalDateTime getExpirationTime() { return expirationTime; }
    public void setExpirationTme(LocalDateTime expirationTime) { this.expirationTime = expirationTime; }

}
