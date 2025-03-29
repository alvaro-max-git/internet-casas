package es.upm.dit.isst.ioh_api.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import es.upm.dit.isst.ioh_api.model.Access;

public interface AccessRepository extends CrudRepository<Access, Long> {
    List<Access> findByUsuario(String email); //identificar el usuario asociasdo al acceso
    List<Access> findByHostEmail(String email); //identificar el host asociado al acceso (el que lo configura)
    List<Access> findByToken(String token); //identificar el acceso por el token así podemos acceder al usuario

}
