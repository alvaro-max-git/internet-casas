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
    private LocalDateTime fechaEntrada; // Fecha y hora desde la que es válido el acceso

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fechaSalida; // Fecha y hora hasta la que es válido el acceso

    // Para simplificar, guardamos un token y el “usuario” (aunque no sea un User real)
    private String token;   // Token de acceso, puede funcionar como identificador de seguridad
    private String usuario; // p.ej. "guest1@ejemplo.com" si no queremos Modelar un user completo

    private String carpeta; // Identificador de carpeta virtual o grupo al que pertenece el acceso

    public Access() {
    }

    public Access(Host host, Lock cerradura, LocalDateTime fechaEntrada,
                  LocalDateTime fechaSalida, String token, String usuario, String carpeta) {
        this.host = host;
        this.cerradura = cerradura;
        this.fechaEntrada = fechaEntrada;
        this.fechaSalida = fechaSalida;
        this.token = token;
        this.usuario = usuario;
        this.carpeta = carpeta;
    }

    public Long getId() {
        return id;
    }
    // Resto de getters y setters

    public String getCarpeta() {
        return carpeta;
    }

    public void setCarpeta(String carpeta) {
        this.carpeta = carpeta;
    }

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

    //Métodos auxiliares

    public boolean isExpired() {
        // Si no hay fecha de salida, el acceso no expira
        if (fechaSalida == null) {
            return false;
        }
        
        // Compara la fecha de salida con la fecha actual
        return LocalDateTime.now().isAfter(fechaSalida);
    }

    public boolean isValidNow() {
        LocalDateTime now = LocalDateTime.now();
        
        // Verifica si la fecha actual está después de la fecha de entrada
        boolean hasStarted = fechaEntrada == null || !now.isBefore(fechaEntrada);
        
        // Verifica si la fecha actual está antes de la fecha de salida
        boolean hasNotEnded = fechaSalida == null || now.isBefore(fechaSalida);
        
        return hasStarted && hasNotEnded;
    }

}
