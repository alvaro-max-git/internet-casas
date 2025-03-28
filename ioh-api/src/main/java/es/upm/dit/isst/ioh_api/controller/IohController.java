package es.upm.dit.isst.ioh_api.controller;

import es.upm.dit.isst.ioh_api.model.*;
import es.upm.dit.isst.ioh_api.repository.*;
import es.upm.dit.isst.ioh_api.service.SeamLockService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class IohController {

    @Autowired
    private AccessRepository accessRepository;

    @Autowired
    private LockRepository lockRepository;

    @Autowired
    private HostRepository hostRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SeamLockService seamLockService;


    /*
     * ===================================================================
     * 1. Endpoints de Access
     * ===================================================================
     */

    // CREATE Access
    @PostMapping("/accesses")
    public ResponseEntity<Access> createAccess(@RequestBody Access newAccess)
            throws URISyntaxException {
        // Ojo con validaciones: que la cerradura y el host existan, etc.
        if (newAccess.getHost() == null || newAccess.getHost().getEmail() == null) {
            return ResponseEntity.badRequest().build();
        }
        // Buscamos el host en la BD
        Optional<Host> hostOpt = hostRepository.findById(newAccess.getHost().getEmail());
        if (!hostOpt.isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        // Buscamos la cerradura en la BD
        if (newAccess.getCerradura() == null || newAccess.getCerradura().getId() == null) {
            return ResponseEntity.badRequest().build();
        }
        Optional<Lock> lockOpt = lockRepository.findById(newAccess.getCerradura().getId());
        if (!lockOpt.isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        newAccess.setHost(hostOpt.get());
        newAccess.setCerradura(lockOpt.get());
        newAccess.setFechaEntrada(newAccess.getFechaEntrada() != null 
            ? newAccess.getFechaEntrada() : LocalDateTime.now());
        newAccess.setFechaSalida(newAccess.getFechaSalida()); // Podrías poner por defecto + X días

        Access saved = accessRepository.save(newAccess);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // READ Access por ID
    @GetMapping("/accesses/{id}")
    public ResponseEntity<Access> readAccess(@PathVariable Long id) {
        return accessRepository.findById(id)
                .map(access -> ResponseEntity.ok().body(access))
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE Access
    @PutMapping("/accesses/{id}")
    public ResponseEntity<Access> updateAccess(@PathVariable Long id,
                                               @RequestBody Access updatedAccess) {
        return accessRepository.findById(id).map(access -> {
            // Actualizamos campos
            if (updatedAccess.getFechaEntrada() != null)
                access.setFechaEntrada(updatedAccess.getFechaEntrada());
            if (updatedAccess.getFechaSalida() != null)
                access.setFechaSalida(updatedAccess.getFechaSalida());
            if (updatedAccess.getToken() != null)
                access.setToken(updatedAccess.getToken());
            if (updatedAccess.getUsuario() != null)
                access.setUsuario(updatedAccess.getUsuario());
            
            // (Opcional) Cambiar la cerradura o el host
            // ...
            accessRepository.save(access);
            return ResponseEntity.ok(access);
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE Access
    @DeleteMapping("/accesses/{id}")
    public ResponseEntity<Void> deleteAccess(@PathVariable Long id) {
        return accessRepository.findById(id).map(access -> {
            accessRepository.delete(access);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    /*
     * ===================================================================
     * 2. Endpoints de Lock (Cerradura)
     * ===================================================================
     */

    // GET lista de cerraduras
    @GetMapping("/locks")
    public List<Lock> listLocks() {
        // Retornamos todas las cerraduras
        return (List<Lock>) lockRepository.findAll();
    }

    // GET detalle de una cerradura
    @GetMapping("/locks/{lockId}")
    public ResponseEntity<Lock> getLock(@PathVariable String lockId) {

        //Actualizamos la lista de cerraduras desde Seam

        Optional<Lock> lockOpt = lockRepository.findById(lockId);
        if (!lockOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Host host = lockOpt.get().getPropietario();
        seamLockService.syncLocksFromSeam(host);

        // Buscamos la cerradura por ID

        return lockRepository.findById(lockId)
                .map(lock -> ResponseEntity.ok(lock))
                .orElse(ResponseEntity.notFound().build());
    }

    // Abrir una cerradura (POST /api/locks/{lockId}/open)
    @PostMapping("/locks/{lockId}/open")
    public ResponseEntity<?> openLock(@PathVariable String lockId) {

        // Aquí es donde invocarías la integración con Seam

        Optional<Lock> lockOpt = lockRepository.findById(lockId);
        if (!lockOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        // 1. Recuperas la seamApiKey del propietario
        Host host = lockOpt.get().getPropietario();
        
        seamLockService.syncLocksFromSeam(host); // Sincroniza las cerraduras del host

        // 2. Llamas a tu servicio que integre la librería Seam y desbloquee la cerradura
        boolean success = mockUnlockLockInSeam(lockId, host.getSeamApiKey());
        // En un caso real, usarías la librería:
        //   Seam seam = Seam.builder().apiKey(host.getSeamApiKey()).build();
        //   ActionAttempt actionAttempt = seam.locks().unlockDoor( LocksUnlockDoorRequest.builder()
        //                             .deviceId(lockId).build());

        if (success) {
            return ResponseEntity.ok("Cerradura " + lockId + " abierta correctamente (vía Seam)");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al abrir la cerradura en Seam");
        }
    }

    /*
     * Simulamos la llamada a Seam para la demo, 
     * en la práctica usarías la librería oficial (como tu snippet).
     */
    private boolean mockUnlockLockInSeam(String lockId, String seamApiKey) {
        // Lógica simulada
        System.out.println("Simulando desbloqueo en Seam, lockId = " + lockId 
                + ", seamApiKey = " + seamApiKey);
        return true;
    }



    // Crear un nuevo Host
@PostMapping("/hosts")
public ResponseEntity<Host> createHost(@RequestBody Host newHost) {
    if (newHost.getEmail() == null || newHost.getEmail().isEmpty()) {
        return ResponseEntity.badRequest().build();
    }
    // Ver si ya existe
    if (hostRepository.findById(newHost.getEmail()).isPresent()) {
        return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }
    // Guardar en BD
    Host saved = hostRepository.save(newHost);
    return ResponseEntity.status(HttpStatus.CREATED).body(saved);
}

// Crear una nueva Lock (Cerradura)
//ESTE ENDOPOINT DEBERÍA NO SER ACCESIBLE.
@PostMapping("/locks")
public ResponseEntity<Lock> createLock(@RequestBody Lock newLock) {
    if (newLock.getId() == null || newLock.getId().isEmpty()) {
        return ResponseEntity.badRequest().build();
    }
    // Ver si ya existe
    if (lockRepository.findById(newLock.getId()).isPresent()) {
        return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }
    // Verificar propietario
    if (newLock.getPropietario() == null || newLock.getPropietario().getEmail() == null) {
        return ResponseEntity.badRequest().build();
    }
    Optional<Host> hostOpt = hostRepository.findById(newLock.getPropietario().getEmail());
    if (!hostOpt.isPresent()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(null);
    }

    newLock.setPropietario(hostOpt.get());
    Lock saved = lockRepository.save(newLock);
    return ResponseEntity.status(HttpStatus.CREATED).body(saved);
}


 /*
     * ===================================================================
     * 2. Endpoints de Autenticación 
     * ===================================================================
     */

    // Registro 
     @PostMapping("/auth/login")
     public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
         String email = credentials.get("email");
         String password = credentials.get("password");
     
         if (email == null || password == null) {
             return ResponseEntity.badRequest().body("Faltan email o contraseña.");
         }
     
         Optional<User> userOpt = userRepository.findById(email);
         if (userOpt.isEmpty()) {
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no encontrado.");
         }
     
         User user = userOpt.get();
     
         if (!passwordEncoder.matches(password, user.getPassword())) {
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña incorrecta.");
         }
     
         Map<String, Object> response = new HashMap<>();
         response.put("email", user.getEmail());
         response.put("tipo", user instanceof Host ? "host" : "user");
     
         return ResponseEntity.ok(response);
     }

@PostMapping("/auth/register/user")
public ResponseEntity<?> registerUser(@RequestBody Map<String, String> payload) {
    String email = payload.get("email");
    String password = payload.get("password");

    if (email == null || password == null) {
        return ResponseEntity.badRequest().body("Faltan email o contraseña.");
    }

    if (userRepository.existsById(email)) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("El usuario ya existe.");
    }

    User newUser = new User();
    newUser.setEmail(email);
    newUser.setPassword(passwordEncoder.encode(password)); // ✅ cifrado

    User saved = userRepository.save(newUser);
    return ResponseEntity.status(HttpStatus.CREATED).body(saved);
}



@PostMapping("/auth/register/host")
public ResponseEntity<?> registerHost(@RequestBody Map<String, String> payload) {
    String email = payload.get("email");
    String password = payload.get("password");
    String seamApiKey = payload.get("seamApiKey");

    if (email == null || password == null || seamApiKey == null) {
        return ResponseEntity.badRequest().body("Faltan campos obligatorios.");
    }

    if (hostRepository.existsById(email)) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("El host ya existe.");
    }

    Host newHost = new Host();
    newHost.setEmail(email);
    newHost.setPassword(passwordEncoder.encode(password)); 
    newHost.setSeamApiKey(seamApiKey);

    Host saved = hostRepository.save(newHost);

    try {
        seamLockService.syncLocksFromSeam(saved);
    } catch (Exception e) {
        // Manejar error si la API Key es inválida...
        // Podrías hacer un rollback manual si quieres anular
        // el registro del Host si la ApiKey no funciona
    }

    return ResponseEntity.status(HttpStatus.CREATED).body(saved);
}



}
