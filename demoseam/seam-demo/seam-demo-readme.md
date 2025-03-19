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



