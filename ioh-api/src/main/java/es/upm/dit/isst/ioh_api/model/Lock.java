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
    private Host propietario; // El host dueño de la cerradura

    private String name;
    private Boolean locked;
    private Boolean blocked = false;
    
    private Double batteryLevel;
    private String batteryStatus;  // "low", "medium", "full"
    private String manufacturer;
    private String model;
    private String timezone;

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
