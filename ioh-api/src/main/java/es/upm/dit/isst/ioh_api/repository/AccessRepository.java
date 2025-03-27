package es.upm.dit.isst.ioh_api.repository;

import es.upm.dit.isst.ioh_api.model.Access;
import org.springframework.data.repository.CrudRepository;

public interface AccessRepository extends CrudRepository<Access, Long> {
    // p.ej. List<Access> findByHostEmail(String email);
}
