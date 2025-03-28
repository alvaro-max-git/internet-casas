package es.upm.dit.isst.ioh_api.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import es.upm.dit.isst.ioh_api.model.Session;

public interface SessionRepository extends CrudRepository<Session, String>{
    Optional<Session> findByUserEmail(String userEmail);
    void deleteByUserEmail(String userEmail);
}
