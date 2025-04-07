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

import com.seam.api.Seam;

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

import com.seam.api.resources.events.requests.EventsListRequest;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

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
     * Endpoints de Access
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

    // Abre la cerradura asociada a un acceso
    // Es el endpoint que hay que usar para abrir la cerradura, no el de la
    // cerradura.
    @PostMapping("/accesses/{accessId}/open")
    public ResponseEntity<Object> openLock(@PathVariable Long accessId) {
        // Find the access by ID
        Access access = accessRepository.findById(accessId).orElse(null);

        if (access == null) {
            return new ResponseEntity<>("Access not found", HttpStatus.NOT_FOUND);
        }

        // Verifica que el acceso sea válido
        if (!access.isValidNow()) {
            return new ResponseEntity<>("Acceso no válido en este momento", HttpStatus.FORBIDDEN);
        }

        // Sacamos la Lock y el Host
        Lock lock = access.getCerradura();
        Host host = access.getHost();

        if (lock == null || host == null) {
            return new ResponseEntity<>("Cerradura o Host no encontrados", HttpStatus.BAD_REQUEST);
        }

        // Try to open the lock
        boolean success = seamLockService.openLock(host, lock.getId());

        // devolvemos objeto ResponseEntity con ok siempre, ya que la cerradura tarda en
        // abrirse
        return ResponseEntity.ok("Operación de apertura de cerradura iniciada");
    }

    /*
     * ===================================================================
     * Endpoints de Lock (Cerradura)
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
    // IMPORTANTE: Este endpoint no debería ser accesible desde el exterior, solo
    // para pruebas.
    @PostMapping("/locks/{lockId}/open")
    public ResponseEntity<?> openLock(@PathVariable String lockId) {

        Optional<Lock> lockOpt = lockRepository.findById(lockId);
        if (!lockOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        // 1. Recuperas la seamApiKey del propietario
        Host host = lockOpt.get().getPropietario();

        // No usamos el booleano, puesto que el servicio de apertura de Seam devuelve
        // "false", tarda un rato.
        boolean success = seamLockService.openLock(host, lockId); // Sincroniza las cerraduras del host

        // esperamos 5 segundos para que se desbloquee la puerta

        try {
            Thread.sleep(5000); // 5 seconds
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // devolvemos objeto ResponseEntity con ok siempre, ya que la cerradura tarda en
        // abrirse
        return ResponseEntity.ok("Operación de apertura de cerradura iniciada");
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
    // ESTE ENDOPOINT DEBERÍA NO SER ACCESIBLE, las cerraduras las gestiona Seam.
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
     * Endpoints de Autenticación
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
        newUser.setPassword(passwordEncoder.encode(password));
        User saved = userRepository.save(newUser);
    
        // ✅ Crear sesión automática
        String token = UUID.randomUUID().toString();
        sessionRepository.deleteByUserEmail(email);
        Session session = new Session(token, email);
        sessionRepository.save(session);
    
        Map<String, Object> response = new HashMap<>();
        response.put("email", saved.getEmail());
        response.put("tipo", "user");
        response.put("token", token);
    
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
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
            // Manejo opcional
        }
    
        // ✅ Crear sesión automática
        String token = UUID.randomUUID().toString();
        sessionRepository.deleteByUserEmail(email);
        Session session = new Session(token, email);
        sessionRepository.save(session);
    
        Map<String, Object> response = new HashMap<>();
        response.put("email", saved.getEmail());
        response.put("tipo", "host");
        response.put("token", token);
    
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /*
     * ===================================================================
     * Endpoints de Sesión
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

    /*
     * ===================================================================
     * Endpoints de Calendar
     * ===================================================================
     */
    // Guardar el token de Google
    @PutMapping("/me/google-token")
    public ResponseEntity<?> saveGoogleToken(@RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body) {
        Optional<User> userOpt = getUserFromAuthHeader(authHeader);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado");
        }

        User user = userOpt.get();

        if (!(user instanceof Host)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Solo los hosts pueden guardar el token de Google");
        }

        String token = body.get("googleAccessToken");
        if (token == null || token.isEmpty()) {
            return ResponseEntity.badRequest().body("Token de Google vacío");
        }

        Host host = (Host) user;
        host.setGoogleAccessToken(token);
        userRepository.save(host); // O hostRepository si lo tienes separado

        return ResponseEntity.ok("Token de Google guardado correctamente");
    }

    // GET /api/me/google-token
    @GetMapping("/me/google-token")
    public ResponseEntity<?> getGoogleToken(@RequestHeader("Authorization") String authHeader) {
        Optional<User> userOpt = getUserFromAuthHeader(authHeader);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado");
        }

        User user = userOpt.get();
        if (!(user instanceof Host host)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Solo los hosts pueden tener Google Token");
        }

        Map<String, String> response = new HashMap<>();
        response.put("googleAccessToken", host.getGoogleAccessToken());
        return ResponseEntity.ok(response);
    }

    // DELETE /api/me/google-token
    @DeleteMapping("/me/google-token")
    public ResponseEntity<?> deleteGoogleToken(@RequestHeader("Authorization") String authHeader) {
        Optional<User> userOpt = getUserFromAuthHeader(authHeader);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado");
        }

        User user = userOpt.get();
        if (!(user instanceof Host host)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Solo los hosts pueden tener Google Token");
        }

        host.setGoogleAccessToken(null);
        userRepository.save(host);

        return ResponseEntity.ok("Token de Google eliminado");
    }

    /*
     * ===================================================================
     * ENDPOINT DE REGISTROS DE APERTURA DE CERRADURAS
     * ===================================================================
     */

    // GET /api/me/lock-events
    // GET /api/me/lock-events
    @GetMapping("/me/lock-events")
    public ResponseEntity<?> getLockEvents(@RequestHeader("Authorization") String authHeader) {
        Optional<User> userOpt = getUserFromAuthHeader(authHeader);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado");
        }

        User user = userOpt.get();
        if (!(user instanceof Host host)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Solo los hosts pueden acceder a eventos de cerraduras");
        }

        try {
            System.out.println("🔍 Obteniendo eventos para host: " + host.getEmail());
            System.out.println("🔑 API Key: " + host.getSeamApiKey());

            Seam seam = Seam.builder().apiKey(host.getSeamApiKey()).build();

            OffsetDateTime since = OffsetDateTime.now(ZoneOffset.UTC).minusDays(7);

            List<com.seam.api.types.Event> events = seam.events().list(
                    EventsListRequest.builder().since(Optional.of(since.toString())).build());

            System.out.println("✅ Total eventos recibidos: " + events.size());

            // Formato deseado: "2025-04-04 18:12"
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

            List<Map<String, Object>> filtered = events.stream()
                    .filter(e -> e.getEventType().equals("lock.locked") || e.getEventType().equals("lock.unlocked"))
                    .map(e -> {
                        Map<String, Object> simplified = new HashMap<>();
                        simplified.put("event_type", e.getEventType());
                        simplified.put("device_id", e.getDeviceId().orElse("desconocido"));

                        // 👇 Formateamos la fecha (si existe)
                        OffsetDateTime createdAt = e.getCreatedAt();
                        if (createdAt != null) {
                            simplified.put("created_at", createdAt.format(formatter));
                        } else {
                            simplified.put("created_at", "desconocido");
                        }

                        return simplified;
                    })
                    .toList();

            System.out.println("📌 Eventos filtrados: " + filtered.size());

            return ResponseEntity.ok(filtered);

        } catch (Exception e) {
            System.err.println("❌ Error al obtener eventos de Seam:");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al obtener eventos");
        }
    }

}
