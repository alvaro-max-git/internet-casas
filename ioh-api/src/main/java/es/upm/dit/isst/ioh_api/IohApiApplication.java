package es.upm.dit.isst.ioh_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import com.fasterxml.jackson.databind.Module;
import io.github.cdimascio.dotenv.Dotenv;


@SpringBootApplication
public class IohApiApplication {

	public static void main(String[] args) {
		// Cargamos las variables del .env ANTES de arrancar Spring Boot
        Dotenv dotenv = Dotenv.configure()
                .directory("./") // Busca .env en la carpeta actual (ioh-api)
                .ignoreIfMissing() // No falla si .env no existe
				.systemProperties() // Carga las variables en System.getenv()
                .load();

		SpringApplication.run(IohApiApplication.class, args);
	}
	
	 @Bean
    public Module jacksonJdk8Module() {
        return new Jdk8Module(); // ✅ Habilita Optional<T> y otras clases modernas
    }

}
