package es.upm.dit.isst.ioh_api.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import es.upm.dit.isst.ioh_api.model.Access;

public interface AccessRepository extends CrudRepository<Access, Long> {
    List<Access> findByUsuario(String email);
}
