package es.upm.dit.isst.ioh_api;

// Importaciones necesarias para las pruebas
import static org.junit.jupiter.api.Assertions.*; // Métodos de aserción

import java.time.LocalDateTime; // Para manejar fechas y horas
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test; // Anotación para métodos de prueba
import org.springframework.beans.factory.annotation.Autowired; // Inyección de dependencias
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest; // Configuración para pruebas JPA

// Importación de clases del modelo y repositorios
import es.upm.dit.isst.ioh_api.model.Access;
import es.upm.dit.isst.ioh_api.model.Host;
import es.upm.dit.isst.ioh_api.model.Lock;
import es.upm.dit.isst.ioh_api.model.Role;
import es.upm.dit.isst.ioh_api.model.User;
import es.upm.dit.isst.ioh_api.repository.AccessRepository;
import es.upm.dit.isst.ioh_api.repository.HostRepository;
import es.upm.dit.isst.ioh_api.repository.LockRepository;
import es.upm.dit.isst.ioh_api.repository.UserRepository;

@DataJpaTest // Anotación para pruebas con repositorios JPA y una base de datos en memoria
class RepositoryTest {

    // Inyección de repositorios JPA
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HostRepository hostRepository;

    @Autowired
    private LockRepository lockRepository;

    @Autowired
    private AccessRepository accessRepository;

    @Test
    void testUserRepository() {
        // Crear y configurar un nuevo usuario
        User user = new User();
        user.setEmail("user@example.com");
        user.setPassword("password");
        user.setRole(Role.ROLE_USER);

        userRepository.save(user); // Guardar el usuario en la base de datos

        Optional<User> found = userRepository.findById("user@example.com"); // Buscar usuario por ID
        assertTrue(found.isPresent()); // Verificar que se ha encontrado
        assertEquals("user@example.com", found.get().getEmail()); // Verificar que el email coincide

        System.out.println("OK testUserRepository passed");
    }

    @Test
    void testHostRepository() {
        // Crear y configurar un nuevo host
        Host host = new Host();
        host.setEmail("host@example.com");
        host.setPassword("password");
        host.setRole(Role.ROLE_HOST);
        host.setSeamApiKey("seamApiKey123");

        hostRepository.save(host); // Guardar el host

        Optional<Host> found = hostRepository.findById("host@example.com"); // Buscar host por ID
        assertTrue(found.isPresent()); // Verificar que se ha encontrado
        assertEquals("host@example.com", found.get().getEmail()); // Comprobar el email
        assertEquals("seamApiKey123", found.get().getSeamApiKey()); // Comprobar el API key

        System.out.println("OK testHostRepository passed");
    }

    @Test
    void testLockRepository() {
        // Crear y guardar un host propietario de la cerradura
        Host host = new Host();
        host.setEmail("host@example.com");
        host.setPassword("password");
        host.setRole(Role.ROLE_HOST);
        host.setSeamApiKey("dummyApiKey123");
        hostRepository.save(host);

        // Crear y guardar una cerradura asociada al host
        Lock lock = new Lock();
        lock.setId("lock1");
        lock.setName("Front Door");
        lock.setPropietario(host);
        lockRepository.save(lock);

        // Buscar cerraduras por el email del propietario
        List<Lock> locks = lockRepository.findByPropietarioEmail("host@example.com");
        assertEquals(1, locks.size()); // Debe haber una cerradura
        assertEquals("Front Door", locks.get(0).getName()); // Verificar el nombre

        System.out.println("OK testLockRepository passed");
    }

    @Test
    void testAccessRepository() {
        // Crear y guardar un host
        Host host = new Host();
        host.setEmail("host@example.com");
        host.setPassword("password");
        host.setRole(Role.ROLE_HOST);
        host.setSeamApiKey("dummyApiKey123");
        hostRepository.save(host);

        // Crear y guardar una cerradura
        Lock lock = new Lock();
        lock.setId("lock1");
        lock.setName("Front Door");
        lock.setPropietario(host);
        lockRepository.save(lock);

        // Crear y guardar un acceso (relación entre host, cerradura y usuario)
        Access access = new Access();
        access.setHost(host);
        access.setCerradura(lock);
        access.setFechaEntrada(LocalDateTime.now());
        access.setFechaSalida(LocalDateTime.now().plusDays(1));
        access.setToken("token123");
        access.setUsuario("user@example.com");
        accessRepository.save(access);

        // Buscar accesos por usuario
        List<Access> accessesByUser = accessRepository.findByUsuario("user@example.com");
        assertEquals(1, accessesByUser.size());
        assertEquals("token123", accessesByUser.get(0).getToken()); // Verificar token

        // Buscar accesos por host
        List<Access> accessesByHost = accessRepository.findByHostEmail("host@example.com");
        assertEquals(1, accessesByHost.size());
        assertEquals("user@example.com", accessesByHost.get(0).getUsuario()); // Verificar usuario

        System.out.println("OK testAccessRepository passed");
    }
}
