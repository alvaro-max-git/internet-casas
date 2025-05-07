package es.upm.dit.isst.ioh_api.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Lock {

    @Id
    private String id; // El ID que te proporciona Seam (PK)

    @ManyToOne
    private Host propietario; // El host dueño de la cerradura (relación muchos-a-uno)

    private String name; // Nombre personalizado de la cerradura
    private Boolean locked; // Estado de bloqueo actual (true si está bloqueada)
    private Boolean blocked = false; // Flag que indica si la cerradura está bloqueada por motivos lógicos (ej. revocación)

    private Double batteryLevel; // Nivel de batería en porcentaje (ej. 87.5)
    private String batteryStatus;  // Estado de la batería: "low", "medium", "full"
    private String manufacturer; // Fabricante del dispositivo
    private String model; // Modelo del dispositivo
    private String timezone; // Zona horaria de la cerradura, útil para entradas/salidas programadas

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getLocked() {
        return locked;
    }

    public void setLocked(Boolean locked) {
        this.locked = locked;
    }

    public Double getBatteryLevel() {
        return batteryLevel;
    }

    public void setBatteryLevel(Double batteryLevel) {
        this.batteryLevel = batteryLevel;
    }

    public String getBatteryStatus() {
        return batteryStatus;
    }

    public void setBatteryStatus(String batteryStatus) {
        this.batteryStatus = batteryStatus;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public Boolean getBlocked() {
        return blocked;
    }

    public void setBlocked(Boolean blocked) {
        this.blocked = blocked;
    }
}
