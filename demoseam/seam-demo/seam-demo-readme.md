## Cómo importar Seam en nuestro proyecto Maven

En pom.xml, dentro de `<dependencies>`

```xml
<dependency>
            <groupId>io.github.seamapi</groupId>
            <artifactId>java</artifactId>
            <!-- Sustituye 0.2.0 por la versión adecuada -->
            <version>0.2.0</version>
</dependency>
```
## Cómo abrir una cerradura

Mirar el Main.java. Necesitamos la API Key, y con ella creamos un objeto Seam.

```java
Seam seam = Seam.builder()
      .apiKey(SEAM_API_KEY)
      .build();
```
Para extraer la lista de cerraduras asociada a la API Key, y escoger una.

```java
LocksClient locksClient = seam.locks();
List<Device> allDevices = locksClient.list();
Device frontDoor = allDevices.get(0);
```

Mandamos el comando de apertura:

```java
ActionAttempt actionAttempt = seam.locks()
            .unlockDoor(LocksUnlockDoorRequest.builder()
            .deviceId(frontDoor.getDeviceId())
            .build());
```
### Formato JSON de Seam
Cuando extraemos la lista de objetos de tipo Device, su toString nos devuelve un JSON con el siguiente formato:

```
{
  "device_id" : "1539df0e-60fd-455c-b4f4-91d8cfc025c4",
  "device_type" : "august_lock",
  "capabilities_supported" : [ "access_code", "lock" ],
  "properties" : {
    "online" : true,
    "name" : "BACK DOOR",
    "model" : {
      "display_name" : "Lock",
      "can_connect_accessory_keypad" : true,
      "has_built_in_keypad" : true,
      "online_access_codes_supported" : true,
      "accessory_keypad_supported" : true,
      "offline_access_codes_supported" : false,
      "manufacturer_display_name" : "August"
    },
    "august_metadata" : {
      "lock_id" : "lock-2",
      "lock_name" : "BACK DOOR",
      "house_name" : "My House",
      "house_id" : "house-1",
      "has_keypad" : true,
      "keypad_battery_level" : "Full"
    },
    "offline_access_codes_enabled" : false,
    "battery_level" : 0.9999532347993827,
    "image_url" : "https://connect.getseam.com/_next/image?url=https://connect.getseam.com/assets/images/devices/august_wifi-smart-lock-3rd-gen_silver_front.png&q=75&w=128",
    "keypad_battery" : {
      "level" : 1
    },
    "supports_accessory_keypad" : true,
    "serial_number" : "00000004-992d-45a0-bea1-9128fdcd8d12",
    "accessory_keypad" : {
      "battery" : {
        "level" : 1
      },
      "is_connected" : true
    },
    "battery" : {
      "level" : 0.9999532347993827,
      "status" : "full"
    },
    "code_constraints" : [ ],
    "has_native_entry_events" : true,
    "image_alt_text" : "August Wifi Smart Lock 3rd Gen, Silver, Front",
    "manufacturer" : "august",
    "door_open" : false,
    "online_access_codes_enabled" : true,
    "appearance" : {
      "name" : "BACK DOOR"
    },
    "supported_code_lengths" : [ 4, 5, 6, 7, 8 ],
    "locked" : false,
    "supports_offline_access_codes" : false,
    "supports_backup_access_code_pool" : true
  },
  "location" : {
    "timezone" : "America/Los_Angeles",
    "location_name" : "My House"
  },
  "connected_account_id" : "8f2c5a3a-97bf-466a-a7af-4df1db69b8ef",
  "workspace_id" : "3336f32c-587a-4a33-8c5f-bab08c47d3d4",
  "created_at" : "2025-03-13T11:28:30.384Z",
  "is_managed" : true,
  "can_program_online_access_codes" : true,
  "can_simulate_removal" : true,
  "nickname" : "",
  "can_simulate_connection" : false,
  "display_name" : "BACK DOOR",
  "can_remotely_lock" : true,
  "custom_metadata" : { },
  "can_remotely_unlock" : true,
  "can_simulate_disconnection" : true
}
´´´
Fin
