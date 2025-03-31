package es.upm.dit.isst.ioh_api.controller;

import java.net.URISyntaxException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import es.upm.dit.isst.ioh_api.service.SeamLockService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.upm.dit.isst.ioh_api.model.Access;
import es.upm.dit.isst.ioh_api.model.Host;
import es.upm.dit.isst.ioh_api.model.Lock;
import es.upm.dit.isst.ioh_api.model.Session;
import es.upm.dit.isst.ioh_api.model.User;
import es.upm.dit.isst.ioh_api.repository.AccessRepository;
import es.upm.dit.isst.ioh_api.repository.HostRepository;
import es.upm.dit.isst.ioh_api.repository.LockRepository;
import es.upm.dit.isst.ioh_api.repository.SessionRepository;
import es.upm.dit.isst.ioh_api.repository.UserRepository;

@RestController
@RequestMapping("/api")
public class IohController {

    @Autowired
    private SessionRepository sessionRepository;
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
    public ResponseEntity<Access> createAccess(@RequestHeader("Authorization") String authHeader,
            @RequestBody Access newAccess) throws URISyntaxException {

        // 1. Recuperamos el host autenticado desde el token
        Optional<User> userOpt = getUserFromAuthHeader(authHeader);
        if (userOpt.isEmpty() || !(userOpt.get() instanceof Host)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Host host = (Host) userOpt.get();

        // 2. Validamos la cerradura
        if (newAccess.getCerradura() == null || newAccess.getCerradura().getId() == null) {
            return ResponseEntity.badRequest().build();
        }
        Optional<Lock> lockOpt = lockRepository.findById(newAccess.getCerradura().getId());
        if (!lockOpt.isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        // 3. Validamos que haya token o usuario
        boolean noToken = newAccess.getToken() == null || newAccess.getToken().isBlank();
        boolean noUser = newAccess.getUsuario() == null || newAccess.getUsuario().isBlank();
        if (noToken && noUser) {
            return ResponseEntity.badRequest().build();
        }

        // 4. Creamos el acceso
        newAccess.setHost(host);
        newAccess.setCerradura(lockOpt.get());
        newAccess.setFechaEntrada(newAccess.getFechaEntrada() != null
                ? newAccess.getFechaEntrada()
                : LocalDateTime.now());
        newAccess.setFechaSalida(newAccess.getFechaSalida());

        Access saved = accessRepository.save(newAccess);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // READ Access por ID
    @GetMapping("/accessAccesses/{id}")
    public ResponseEntity<> readAccess(@PathVariable Long id) {
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

    // NOS DEVUELVE LOS ACCESOS POR HOST
    // GET /api/hosts/{hostId}/accesses
    @GetMapping("/hosts/{hostId}/accesses")
    public ResponseEntity<List<Access>> listAccessesByHost(@PathVariable String hostId) {
        // 1. Verificamos que el Host existe
        Optional<Host> hostOpt = hostRepository.findById(hostId);
        if (!hostOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        // 2. Obtenemos todos los Access de la BD, filtrando por host.email
        List<Access> accesses = accessRepository.findByHostEmail(hostId);
        // 3. Eliminamos expirados

        accesses.removeIf(access -> access.isExpired());


        // 4. Retornamos la lista
        return ResponseEntity.ok(accesses);
    }

    // NOS DEVUELVE LOS ACCESOS POR TOKEN

    @GetMapping("/accesses/by-token/{token}")
    public ResponseEntity<List<Access>> getAccessesByToken(@PathVariable String token) {
        List<Access> accesses = accessRepository.findByToken(token);
        
        accesses.removeIf(access -> access.isExpired());

        return ResponseEntity.ok(accesses);
        
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

    // GET lista de cerraduras de un host
    @GetMapping("/hosts/{hostId}/locks")
    public ResponseEntity<List<Lock>> listLocksByHost(@PathVariable String hostId) {
        // Buscamos el host por ID
        Optional<Host> hostOpt = hostRepository.findById(hostId);
        if (!hostOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        // Actualizamos la lista de cerraduras desde Seam
        seamLockService.syncLocksFromSeam(hostOpt.get());

        // Retornamos las cerraduras del host
        List<Lock> locks = lockRepository.findByPropietarioEmail(hostOpt.get().getEmail());
        return ResponseEntity.ok(locks);
    }

    // GET detalle de una cerradura
    @GetMapping("/locks/{lockId}")
    public ResponseEntity<Lock> getLock(@PathVariable String lockId) {

        // Actualizamos la lista de cerraduras desde Seam

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

        Optional<Lock> lockOpt = lockRepository.findById(lockId);
        if (!lockOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        // 1. Recuperas la seamApiKey del propietario
        Host host = lockOpt.get().getPropietario();

        boolean success = seamLockService.openLock(host, lockId); // Sincroniza las cerraduras del host

        //esperamos 5 segundos para que se desbloquee la puerta

        try {
            Thread.sleep(5000); // 5 seconds
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        //devolvemos objeto ResponseEntity con ok siempre, ya que la cerradura tarda en abrirse
        return ResponseEntity.ok("Operación de apertura de cerradura iniciada");
    }


    @PostMapping("/{accessId}/open")
    public ResponseEntity<Object> openLock(@PathVariable Long accessId) {
        // Find the access by ID
        Access access = accessRepository.findById(accessId).orElse(null);
        
        if (access == null) {
            return new ResponseEntity<>("Access not found", HttpStatus.NOT_FOUND);
        }
        
        // Verify if the access is currently valid
        if (!access.isValidNow()) {
            return new ResponseEntity<>("Acceso no válido en este momento", HttpStatus.FORBIDDEN);
        }
        
        // Extract the lock and host
        Lock lock = access.getCerradura();
        Host host = access.getHost();
        
        if (lock == null || host == null) {
            return new ResponseEntity<>("Cerradura o Host no encontrados", HttpStatus.BAD_REQUEST);
        }
        
        // Try to open the lock
        boolean success = seamLockService.openLock(host, lock.getId());
        
        //devolvemos objeto ResponseEntity con ok siempre, ya que la cerradura tarda en abrirse
        return ResponseEntity.ok("Operación de apertura de cerradura iniciada");
    }

    /*
     * Simulamos la llamada a Seam para la demo,
     * en la práctica usarías la librería oficial (como tu snippet).
     
    private boolean mockUnlockLockInSeam(String lockId, String seamApiKey) {
        // Lógica simulada
        System.out.println("Simulando desbloqueo en Seam, lockId = " + lockId
                + ", seamApiKey = " + seamApiKey);
        return true;
    }
    */

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
    // ESTE ENDOPOINT DEBERÍA NO SER ACCESIBLE.
    /*
     * @PostMapping("/locks")
     * public ResponseEntity<Lock> createLock(@RequestBody Lock newLock) {
     * if (newLock.getId() == null || newLock.getId().isEmpty()) {
     * return ResponseEntity.badRequest().build();
     * }
     * // Ver si ya existe
     * if (lockRepository.findById(newLock.getId()).isPresent()) {
     * return ResponseEntity.status(HttpStatus.CONFLICT).build();
     * }
     * // Verificar propietario
     * if (newLock.getPropietario() == null || newLock.getPropietario().getEmail()
     * == null) {
     * return ResponseEntity.badRequest().build();
     * }
     * Optional<Host> hostOpt =
     * hostRepository.findById(newLock.getPropietario().getEmail());
     * if (!hostOpt.isPresent()) {
     * return ResponseEntity.status(HttpStatus.BAD_REQUEST)
     * .body(null);
     * }
     * 
     * newLock.setPropietario(hostOpt.get());
     * Lock saved = lockRepository.save(newLock);
     * return ResponseEntity.status(HttpStatus.CREATED).body(saved);
     * }
     */

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

        // Generar token y guardar en sesión
        String token = UUID.randomUUID().toString();
        sessionRepository.deleteByUserEmail(email);
        Session session = new Session(token, email);
        sessionRepository.save(session);

        Map<String, Object> response = new HashMap<>();
        response.put("email", user.getEmail());
        response.put("tipo", user instanceof Host ? "host" : "user");
        response.put("token", token);

        return ResponseEntity.ok(response);
    }

    // Logout

    @PostMapping("/auth/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authHeader.substring(7);
        sessionRepository.deleteById(token);
        return ResponseEntity.ok().body("Sesión cerrada correctamente");
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
    /*
     * ===================================================================
     * 2. Endpoints Nuevos con Sesión
     * ===================================================================
     */

    // 1. GET /api/me -> Retorna un resumen del usuario logueado
    @GetMapping("/me")
    public ResponseEntity<?> getAuthenticatedUser(@RequestHeader("Authorization") String authHeader) {
        // 1) Recuperamos usuario a partir del token
        Optional<User> userOpt = getUserFromAuthHeader(authHeader);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado");
        }
        User user = userOpt.get();

        // 2) Retornamos info básica
        Map<String, Object> data = new HashMap<>();
        data.put("email", user.getEmail());
        if (user instanceof Host) {
            data.put("tipo", "host");
        } else {
            data.put("tipo", "user");
        }

        return ResponseEntity.ok(data);
    }

    // 2. GET /api/me/locks -> Retorna cerraduras del host autenticado
    @GetMapping("/me/locks")
    public ResponseEntity<?> getMyLocks(@RequestHeader("Authorization") String authHeader) {
        Optional<User> userOpt = getUserFromAuthHeader(authHeader);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado");
        }

        User user = userOpt.get();
        // Comprobamos que sea Host
        if (!(user instanceof Host)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Este endpoint es solo para hosts");
        }

        Host host = (Host) user;
        // Sincroniza las cerraduras desde Seam
        seamLockService.syncLocksFromSeam(host);

        List<Lock> locks = lockRepository.findByPropietarioEmail(host.getEmail());
        return ResponseEntity.ok(locks);
    }

    // 3. GET /api/me/accesses -> Retorna accesos del host o user autenticado
    @GetMapping("/me/accesses")
    public ResponseEntity<?> getMyAccesses(@RequestHeader("Authorization") String authHeader) {
        Optional<User> userOpt = getUserFromAuthHeader(authHeader);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado");
        }
        User user = userOpt.get();

        // Si es un Host -> devolvemos accesos que él creó (hostEmail)
        if (user instanceof Host) {
            List<Access> accesses = accessRepository.findByHostEmail(user.getEmail());
            accesses.removeIf(access -> access.isExpired());
            return ResponseEntity.ok(accesses);
        } else {
            // Si es un user normal -> devolvemos accesos donde 'usuario' sea su email
            List<Access> accesses = accessRepository.findByUsuario(user.getEmail());
            accesses.removeIf(access -> access.isExpired());
            return ResponseEntity.ok(accesses);
        }
    }

    
    /*
     * ===================================================================
     * Logica
     * ===================================================================
     */

    // Session

    // Método auxiliar que extrae y valida el token del header de autorización y
    // devuelve el usuario autenticado

    private Optional<User> getUserFromAuthHeader(String authHeader) {
        // Validar formato del header
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return Optional.empty();
        }

        // Extraer token
        String token = authHeader.substring(7);

        // Token vacio
        if (token == null) {
            return Optional.empty();
        }

        // Buscar sesión
        Optional<Session> sessionOpt = sessionRepository.findById(token);
        if (sessionOpt.isEmpty()) { // Comprueba si la sesión es válida
            return Optional.empty();
        } else if (!sessionOpt.get().isValid()) {
            sessionRepository.delete(sessionOpt.get());
            return Optional.empty();
        }
        // Buscar usuario de la sesión
        String userEmail = sessionOpt.get().getUserEmail();
        return userRepository.findById(userEmail);
    }


}
