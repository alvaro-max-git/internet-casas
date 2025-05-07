package es.upm.dit.isst.ioh_api;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import es.upm.dit.isst.ioh_api.model.Access;
import es.upm.dit.isst.ioh_api.model.Host;
import es.upm.dit.isst.ioh_api.model.Lock;
import es.upm.dit.isst.ioh_api.model.Role;
import es.upm.dit.isst.ioh_api.model.User;
import es.upm.dit.isst.ioh_api.repository.AccessRepository;
import es.upm.dit.isst.ioh_api.repository.HostRepository;
import es.upm.dit.isst.ioh_api.repository.LockRepository;
import es.upm.dit.isst.ioh_api.repository.UserRepository;

@DataJpaTest
class RepositoryTest {

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
        User user = new User();
        user.setEmail("user@example.com");
        user.setPassword("password");
        user.setRole(Role.ROLE_USER);

        userRepository.save(user);

        Optional<User> found = userRepository.findById("user@example.com");
        assertTrue(found.isPresent());
        assertEquals("user@example.com", found.get().getEmail());

        System.out.println("OK testUserRepository passed");
    }

    @Test
    void testHostRepository() {
        Host host = new Host();
        host.setEmail("host@example.com");
        host.setPassword("password");
        host.setRole(Role.ROLE_HOST);
        host.setSeamApiKey("seamApiKey123");

        hostRepository.save(host);

        Optional<Host> found = hostRepository.findById("host@example.com");
        assertTrue(found.isPresent());
        assertEquals("host@example.com", found.get().getEmail());
        assertEquals("seamApiKey123", found.get().getSeamApiKey());

        System.out.println("OK testHostRepository passed");
    }

    @Test
    void testLockRepository() {
        Host host = new Host();
        host.setEmail("host@example.com");
        host.setPassword("password");
        host.setRole(Role.ROLE_HOST);
        host.setSeamApiKey("dummyApiKey123");
        hostRepository.save(host);

        Lock lock = new Lock();
        lock.setId("lock1");
        lock.setName("Front Door");
        lock.setPropietario(host);
        lockRepository.save(lock);

        List<Lock> locks = lockRepository.findByPropietarioEmail("host@example.com");
        assertEquals(1, locks.size());
        assertEquals("Front Door", locks.get(0).getName());

        System.out.println("OK testLockRepository passed");
    }

    @Test
    void testAccessRepository() {
        Host host = new Host();
        host.setEmail("host@example.com");
        host.setPassword("password");
        host.setRole(Role.ROLE_HOST);
        host.setSeamApiKey("dummyApiKey123");
        hostRepository.save(host);

        Lock lock = new Lock();
        lock.setId("lock1");
        lock.setName("Front Door");
        lock.setPropietario(host);
        lockRepository.save(lock);

        Access access = new Access();
        access.setHost(host);
        access.setCerradura(lock);
        access.setFechaEntrada(LocalDateTime.now());
        access.setFechaSalida(LocalDateTime.now().plusDays(1));
        access.setToken("token123");
        access.setUsuario("user@example.com");
        accessRepository.save(access);

        List<Access> accessesByUser = accessRepository.findByUsuario("user@example.com");
        assertEquals(1, accessesByUser.size());
        assertEquals("token123", accessesByUser.get(0).getToken());

        List<Access> accessesByHost = accessRepository.findByHostEmail("host@example.com");
        assertEquals(1, accessesByHost.size());
        assertEquals("user@example.com", accessesByHost.get(0).getUsuario());

        System.out.println("OK testAccessRepository passed");
    }
}
