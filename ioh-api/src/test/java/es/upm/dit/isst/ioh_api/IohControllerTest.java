package es.upm.dit.isst.ioh_api;

// Importaciones necesarias para pruebas unitarias y mocks
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

// Importación de clases del proyecto
import es.upm.dit.isst.ioh_api.controller.IohController;
import es.upm.dit.isst.ioh_api.model.Host;
import es.upm.dit.isst.ioh_api.model.Lock;
import es.upm.dit.isst.ioh_api.model.Role;
import es.upm.dit.isst.ioh_api.model.User;
import es.upm.dit.isst.ioh_api.repository.AccessRepository;
import es.upm.dit.isst.ioh_api.repository.HostRepository;
import es.upm.dit.isst.ioh_api.repository.LockRepository;
import es.upm.dit.isst.ioh_api.repository.UserRepository;
import es.upm.dit.isst.ioh_api.security.JwtUtil;
import es.upm.dit.isst.ioh_api.service.SeamLockService;

// Clase de prueba para IohController usando Mockito
@ExtendWith(MockitoExtension.class)
class IohControllerTest {

    // Simulación de dependencias del controlador
    @Mock private UserRepository userRepository;
    @Mock private HostRepository hostRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;
    @Mock private SeamLockService seamLockService;
    @Mock private LockRepository lockRepository;
    @Mock private AccessRepository accessRepository;

    // Instancia del controlador con dependencias inyectadas
    @InjectMocks
    private IohController iohController;

    // Limpiar el contexto de seguridad antes de cada prueba
    @BeforeEach
    void setUp() {
        SecurityContextHolder.clearContext();
    }

    // Prueba: registrar un nuevo usuario correctamente
    @Test
    void registerUser_ShouldReturnCreated_WhenNewUser() {
        Map<String, String> payload = Map.of(
            "email", "test@example.com",
            "password", "password"
        );

        // Simula que el usuario no existe
        when(userRepository.existsById("test@example.com")).thenReturn(false);
        // Simula codificación de contraseña
        when(passwordEncoder.encode("password")).thenReturn("encoded");
        // Simula guardado del usuario
        when(userRepository.save(any(User.class)))
            .thenAnswer(inv -> inv.getArgument(0, User.class));
        // Simula generación de token JWT
        when(jwtUtil.generateToken("test@example.com", Role.ROLE_USER.name()))
            .thenReturn("jwt");

        // Llama al método del controlador
        ResponseEntity<?> response = iohController.registerUser(payload);

        // Verifica la respuesta
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        Map<?,?> body = (Map<?,?>) response.getBody();
        assertEquals("test@example.com", body.get("email"));
        assertEquals("user", body.get("tipo"));
        assertEquals("jwt", body.get("token"));

        System.out.println("registerUser_ShouldReturnCreated: OK");
    }

    // Prueba: registrar un nuevo host correctamente
    @Test
    void registerHost_ShouldReturnCreated_WhenNewHost() {
        Map<String, String> payload = Map.of(
            "email", "host@example.com",
            "password", "password",
            "seamApiKey", "apikey123"
        );

        // Simula que el host no existe
        when(hostRepository.existsById("host@example.com")).thenReturn(false);
        // Simula codificación de contraseña
        when(passwordEncoder.encode("password")).thenReturn("encoded");
        // Simula guardado del host
        when(hostRepository.save(any(Host.class)))
            .thenAnswer(inv -> inv.getArgument(0, Host.class));
        // Simula sincronización de cerraduras
        doNothing().when(seamLockService).syncLocksFromSeam(any(Host.class));
        // Simula generación de token
        when(jwtUtil.generateToken("host@example.com", Role.ROLE_HOST.name()))
            .thenReturn("jwt");

        // Llama al método del controlador
        ResponseEntity<?> response = iohController.registerHost(payload);

        // Verifica la respuesta
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        Map<?,?> body = (Map<?,?>) response.getBody();
        assertEquals("host@example.com", body.get("email"));
        assertEquals("host", body.get("tipo"));
        assertEquals("jwt", body.get("token"));

        // Verifica que se llamó a la sincronización
        verify(seamLockService).syncLocksFromSeam(any(Host.class));

        System.out.println("registerHost_ShouldReturnCreated: OK");
    }

    // Prueba: login exitoso con credenciales válidas
    @Test
    void login_ShouldReturnOk_WhenCredentialsValid() {
        Map<String, String> payload = Map.of(
            "email", "user@example.com",
            "password", "pass"
        );

        // Crea un usuario simulado
        User user = new User();
        user.setEmail("user@example.com");
        user.setPassword("hashed");
        user.setRole(Role.ROLE_USER);

        // Simula recuperación de usuario y verificación de contraseña
        when(userRepository.findById("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("pass", "hashed")).thenReturn(true);
        when(jwtUtil.generateToken("user@example.com", Role.ROLE_USER.name()))
            .thenReturn("jwt");

        // Llama al login
        ResponseEntity<?> response = iohController.login(payload);

        // Verifica respuesta
        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<?,?> body = (Map<?,?>) response.getBody();
        assertEquals("user@example.com", body.get("email"));
        assertEquals("user", body.get("tipo"));
        assertEquals("jwt", body.get("token"));

        System.out.println("login_ShouldReturnOk: OK");
    }

    // Prueba: recuperar datos del usuario autenticado
    @Test
    void getAuthenticatedUser_ShouldReturnUserInfo_WhenUserExists() {
        String email = "test@example.com";
        User user = new User();
        user.setEmail(email);
        user.setRole(Role.ROLE_USER);

        // Simula autenticación con SecurityContext
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn(email);
        SecurityContextHolder.getContext().setAuthentication(auth);

        // Simula búsqueda del usuario
        when(userRepository.findById(email)).thenReturn(Optional.of(user));

        // Llama al método del controlador
        ResponseEntity<?> response = iohController.getAuthenticatedUser("Bearer token");

        // Verifica respuesta
        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<?,?> body = (Map<?,?>) response.getBody();
        assertEquals(email, body.get("email"));
        assertEquals("user", body.get("tipo"));

        System.out.println("getAuthenticatedUser_ShouldReturnUserInfo: OK");
    }

    // Prueba: obtener cerraduras del host autenticado
    @Test
    void getMyLocks_ShouldReturnLocks_WhenHostHasLocks() {
        String email = "host@example.com";
        Host host = new Host();
        host.setEmail(email);
        host.setRole(Role.ROLE_HOST);

        // Simula autenticación
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn(email);
        SecurityContextHolder.getContext().setAuthentication(auth);

        // Simula recuperación del host
        when(userRepository.findById(email)).thenReturn(Optional.of(host));
        doNothing().when(seamLockService).syncLocksFromSeam(host);

        // Simula cerraduras asociadas
        Lock lock1 = new Lock(); lock1.setId("lock1");
        Lock lock2 = new Lock(); lock2.setId("lock2");
        when(lockRepository.findByPropietarioEmail(email))
            .thenReturn(List.of(lock1, lock2));

        // Llama al método del controlador
        ResponseEntity<?> response = iohController.getMyLocks("Bearer token");

        // Verifica respuesta
        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<?> locks = (List<?>) response.getBody();
        assertEquals(2, locks.size());
        assertEquals("lock1", ((Lock)locks.get(0)).getId());
        assertEquals("lock2", ((Lock)locks.get(1)).getId());
        verify(seamLockService).syncLocksFromSeam(host);

        System.out.println("getMyLocks_ShouldReturnLocks: OK");
    }
}
