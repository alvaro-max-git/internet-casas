package es.upm.dit.isst.ioh_api.repository;

import es.upm.dit.isst.ioh_api.model.Lock;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

public interface LockRepository extends CrudRepository<Lock, String> {
    // p.ej. List<Lock> findByPropietarioEmail(String email);

    //hacer findByPropietario para obtener los locks de un usuario

    List<Lock> findByPropietarioEmail(String email);
    
}
