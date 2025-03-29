package es.upm.dit.isst.ioh_api.service;

import org.springframework.stereotype.Service;

import es.upm.dit.isst.ioh_api.model.Host;
import es.upm.dit.isst.ioh_api.model.Lock;
import es.upm.dit.isst.ioh_api.repository.HostRepository;
import es.upm.dit.isst.ioh_api.repository.LockRepository;

import java.util.ArrayList;
import java.util.List;

import com.seam.api.Seam;
import com.seam.api.resources.locks.LocksClient;
import com.seam.api.resources.locks.requests.LocksGetRequest;
import com.seam.api.resources.locks.requests.LocksUnlockDoorRequest;
import com.seam.api.types.ActionAttempt;
import com.seam.api.types.AugustDeviceMetadata;
import com.seam.api.types.Device;
import com.seam.api.types.DeviceProperties;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class SeamLockService {

    private final LockRepository lockRepository;
    private final HostRepository hostRepository;

    public SeamLockService(LockRepository lockRepository, HostRepository hostRepository) {
        this.lockRepository = lockRepository;
        this.hostRepository = hostRepository;
    }

    /**
     * Dado un host (con su seamApiKey),
     * llama a Seam, obtiene las cerraduras y sincroniza nuestra BBDD.
    * */

    public boolean openLock(Host host, String lockId) {
        //Sincronizamos primero
        syncLocksFromSeam(host);
        
        // Ahora, intentamos abrir la cerradura
        Seam seam = Seam.builder().apiKey(host.getSeamApiKey()).build();
        
        ActionAttempt actionAttempt = seam.locks()
                .unlockDoor(LocksUnlockDoorRequest.builder()
                .deviceId(lockId)
                .build());
        
        //comprobamos si la cerradura se ha abierto en el 
        LocksClient locksClient = seam.locks();
        Device device = locksClient.get(
                LocksGetRequest.builder()
                .deviceId(lockId)
                .build());
        return !isLocked(device.toString());
    }
    

    public void syncLocksFromSeam(Host host) {

        List<Device> seamDevices = fetchAllDevicesFromSeam(host.getSeamApiKey());
        
        // Para cada Device, conviértelo en Lock (o actualiza si ya existe)
        //VER https://github.com/seamapi/java/blob/main/src/main/java/com/seam/api/types/Device.java
        //NO ES MUY RELEVANTE.

        for (Device device : seamDevices) {
            Lock existingLock = lockRepository.findById(device.getDeviceId()).orElse(null);
            String deviceJson = device.toString();

            if (existingLock == null) {
                Lock newLock = createLockFromJson(deviceJson, host);
                lockRepository.save(newLock);

            } else {
                // la cerradura existe, actualizamos sus datos con updateLockFromJson
                
                updateLockFromJson(existingLock, deviceJson);
                lockRepository.save(existingLock);

            }
        }
        // Además, podrías eliminar las cerraduras locales que
        // ya no aparezcan en la lista devuelta por Seam
        // (opcional, según tu lógica de negocio)
    }

    /**
     * Usa la librería oficial o un cliente HTTP para obtener la lista de dispositivos.
     */

    private List<Device> fetchAllDevicesFromSeam(String seamApiKey) {
        
        Seam seam = Seam.builder().apiKey(seamApiKey).build();
        return seam.locks().list();

    }



    public Lock createLockFromJson(String json, Host host) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            JsonNode root = mapper.readTree(json);
            JsonNode properties = root.get("properties");
    
            String deviceId = root.get("device_id").asText();
            String name = properties.get("name").asText();
            Boolean locked = properties.get("locked").asBoolean();
            Double batteryLevel = properties.has("battery_level")
                    ? properties.get("battery_level").asDouble()
                    : 0.0;
            
            // El estado de la batería está dentro del objeto "battery"
            String batteryStatus = "";
            if (properties.has("battery")) {
                JsonNode battery = properties.get("battery");
                batteryStatus = battery.has("status") ? battery.get("status").asText() : "";
            }
            
            String manufacturer = properties.has("manufacturer")
                    ? properties.get("manufacturer").asText()
                    : "";
            
            String model = "";
            if (properties.has("model")) {
                JsonNode modelNode = properties.get("model");
                model = modelNode.has("display_name")
                        ? modelNode.get("display_name").asText()
                        : "";
            }
            
            // El timezone puede estar en properties o en location
            String timezone = "";
            if (properties.has("timezone")) {
                timezone = properties.get("timezone").asText();
            } else if (root.has("location") && root.get("location").has("timezone")) {
                timezone = root.get("location").get("timezone").asText();
            }
            
            Lock newLock = new Lock();
            newLock.setId(deviceId);
            newLock.setPropietario(host);
            newLock.setName(name);
            newLock.setLocked(locked);
            newLock.setBatteryLevel(batteryLevel);
            newLock.setBatteryStatus(batteryStatus);
            newLock.setManufacturer(manufacturer);
            newLock.setModel(model);
            newLock.setTimezone(timezone);
            
            return newLock;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private Lock updateLockFromJson(Lock lock, String json) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            JsonNode root = mapper.readTree(json);
            JsonNode properties = root.get("properties");
            
            // Actualizamos los campos relevantes
            lock.setName(properties.get("name").asText());
            lock.setLocked(properties.get("locked").asBoolean());
            lock.setBatteryLevel(properties.has("battery_level")
                    ? properties.get("battery_level").asDouble() : lock.getBatteryLevel());
            
            // Extraemos el estado de la batería desde el objeto "battery"
            if (properties.has("battery")) {
                JsonNode battery = properties.get("battery");
                lock.setBatteryStatus(battery.has("status")
                        ? battery.get("status").asText() : lock.getBatteryStatus());
            }
            
            lock.setManufacturer(properties.has("manufacturer")
                    ? properties.get("manufacturer").asText() : lock.getManufacturer());
            
            if (properties.has("model")) {
                JsonNode modelNode = properties.get("model");
                lock.setModel(modelNode.has("display_name")
                        ? modelNode.get("display_name").asText() : lock.getModel());
            }
            
            // Para el timezone, se puede extraer de properties o de location
            if (properties.has("timezone")) {
                lock.setTimezone(properties.get("timezone").asText());
            } else if (root.has("location") && root.get("location").has("timezone")) {
                lock.setTimezone(root.get("location").get("timezone").asText());
            }
            
            return lock;
        } catch (Exception e) {
            e.printStackTrace();
            return lock;
        }
    }

    private boolean isLocked (String json) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            JsonNode root = mapper.readTree(json);
            JsonNode properties = root.get("properties");
            return properties.get("locked").asBoolean();
        } catch (Exception e) {
            e.printStackTrace();
        }
        // Si no se puede determinar el estado, devolvemos false
        return false;
    }

}
