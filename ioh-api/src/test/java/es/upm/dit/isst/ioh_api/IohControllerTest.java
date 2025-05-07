package es.upm.dit.isst.ioh_api;

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

@ExtendWith(MockitoExtension.class)
class IohControllerTest {

    @Mock private UserRepository userRepository;
    @Mock private HostRepository hostRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;
    @Mock private SeamLockService seamLockService;
    @Mock private LockRepository lockRepository;
    @Mock private AccessRepository accessRepository;

    @InjectMocks
    private IohController iohController;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void registerUser_ShouldReturnCreated_WhenNewUser() {
        Map<String, String> payload = Map.of(
            "email", "test@example.com",
            "password", "password"
        );

        when(userRepository.existsById("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encoded");
        when(userRepository.save(any(User.class)))
            .thenAnswer(inv -> inv.getArgument(0, User.class));
        when(jwtUtil.generateToken("test@example.com", Role.ROLE_USER.name()))
            .thenReturn("jwt");

        ResponseEntity<?> response = iohController.registerUser(payload);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        Map<?,?> body = (Map<?,?>) response.getBody();
        assertEquals("test@example.com", body.get("email"));
        assertEquals("user", body.get("tipo"));
        assertEquals("jwt", body.get("token"));

        System.out.println("registerUser_ShouldReturnCreated: OK");
    }

    @Test
    void registerHost_ShouldReturnCreated_WhenNewHost() {
        Map<String, String> payload = Map.of(
            "email", "host@example.com",
            "password", "password",
            "seamApiKey", "apikey123"
        );

        when(hostRepository.existsById("host@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encoded");
        when(hostRepository.save(any(Host.class)))
            .thenAnswer(inv -> inv.getArgument(0, Host.class));
        doNothing().when(seamLockService).syncLocksFromSeam(any(Host.class));
        when(jwtUtil.generateToken("host@example.com", Role.ROLE_HOST.name()))
            .thenReturn("jwt");

        ResponseEntity<?> response = iohController.registerHost(payload);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        Map<?,?> body = (Map<?,?>) response.getBody();
        assertEquals("host@example.com", body.get("email"));
        assertEquals("host", body.get("tipo"));
        assertEquals("jwt", body.get("token"));

        System.out.println("registerHost_ShouldReturnCreated: OK");
        verify(seamLockService).syncLocksFromSeam(any(Host.class));
    }

    @Test
    void login_ShouldReturnOk_WhenCredentialsValid() {
        Map<String, String> payload = Map.of(
            "email", "user@example.com",
            "password", "pass"
        );

        User user = new User();
        user.setEmail("user@example.com");
        user.setPassword("hashed");
        user.setRole(Role.ROLE_USER);

        when(userRepository.findById("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("pass", "hashed")).thenReturn(true);
        when(jwtUtil.generateToken("user@example.com", Role.ROLE_USER.name()))
            .thenReturn("jwt");

        ResponseEntity<?> response = iohController.login(payload);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<?,?> body = (Map<?,?>) response.getBody();
        assertEquals("user@example.com", body.get("email"));
        assertEquals("user", body.get("tipo"));
        assertEquals("jwt", body.get("token"));

        System.out.println("login_ShouldReturnOk: OK");
    }

    @Test
    void getAuthenticatedUser_ShouldReturnUserInfo_WhenUserExists() {
        String email = "test@example.com";
        User user = new User();
        user.setEmail(email);
        user.setRole(Role.ROLE_USER);

        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn(email);
        SecurityContextHolder.getContext().setAuthentication(auth);

        when(userRepository.findById(email)).thenReturn(Optional.of(user));

        ResponseEntity<?> response = iohController.getAuthenticatedUser("Bearer token");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<?,?> body = (Map<?,?>) response.getBody();
        assertEquals(email, body.get("email"));
        assertEquals("user", body.get("tipo"));

        System.out.println("getAuthenticatedUser_ShouldReturnUserInfo: OK");
    }

    @Test
    void getMyLocks_ShouldReturnLocks_WhenHostHasLocks() {
        String email = "host@example.com";
        Host host = new Host();
        host.setEmail(email);
        host.setRole(Role.ROLE_HOST);

        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn(email);
        SecurityContextHolder.getContext().setAuthentication(auth);

        when(userRepository.findById(email)).thenReturn(Optional.of(host));
        doNothing().when(seamLockService).syncLocksFromSeam(host);

        Lock lock1 = new Lock(); lock1.setId("lock1");
        Lock lock2 = new Lock(); lock2.setId("lock2");
        when(lockRepository.findByPropietarioEmail(email))
            .thenReturn(List.of(lock1, lock2));

        ResponseEntity<?> response = iohController.getMyLocks("Bearer token");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<?> locks = (List<?>) response.getBody();
        assertEquals(2, locks.size());
        assertEquals("lock1", ((Lock)locks.get(0)).getId());
        assertEquals("lock2", ((Lock)locks.get(1)).getId());

        System.out.println("getMyLocks_ShouldReturnLocks: OK");
        verify(seamLockService).syncLocksFromSeam(host);
    }
}
