package es.upm.dit.isst.ioh_api.repository;

import es.upm.dit.isst.ioh_api.model.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, String> {
    // Métodos de consulta extra si necesitas, p.ej. findByEmail
}

