package es.upm.dit.isst.ioh_api.repository;

import es.upm.dit.isst.ioh_api.model.Host;
import org.springframework.data.repository.CrudRepository;

public interface HostRepository extends CrudRepository<Host, String> {
    // Opcional, si quieres métodos específicos de Host
}
