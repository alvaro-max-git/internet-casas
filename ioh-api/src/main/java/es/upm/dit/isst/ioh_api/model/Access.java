package es.upm.dit.isst.ioh_api.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
public class Access {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // PK autoincrement

    @ManyToOne
    private Host host; // El host que crea/posee este acceso (dueño de la cerradura)

    @ManyToOne
    private Lock cerradura; // Referencia a la cerradura a la que da acceso

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fechaEntrada;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fechaSalida;

    // Para simplificar, guardamos un token y el “usuario” (aunque no sea un User real)
    private String token;   
    private String usuario; // p.ej. "guest1@ejemplo.com" si no queremos Modelar un user completo

    public Access() {
    }

    public Access(Host host, Lock cerradura, LocalDateTime fechaEntrada,
                  LocalDateTime fechaSalida, String token, String usuario) {
        this.host = host;
        this.cerradura = cerradura;
        this.fechaEntrada = fechaEntrada;
        this.fechaSalida = fechaSalida;
        this.token = token;
        this.usuario = usuario;
    }

    public Long getId() {
        return id;
    }
    // Resto de getters y setters

    public Host getHost() {
        return host;
    }

    public void setHost(Host host) {
        this.host = host;
    }

    public Lock getCerradura() {
        return cerradura;
    }

    public void setCerradura(Lock cerradura) {
        this.cerradura = cerradura;
    }

    public LocalDateTime getFechaEntrada() {
        return fechaEntrada;
    }

    public void setFechaEntrada(LocalDateTime fechaEntrada) {
        this.fechaEntrada = fechaEntrada;
    }

    public LocalDateTime getFechaSalida() {
        return fechaSalida;
    }

    public void setFechaSalida(LocalDateTime fechaSalida) {
        this.fechaSalida = fechaSalida;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }
}
