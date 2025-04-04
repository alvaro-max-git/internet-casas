package es.upm.dit.isst.ioh_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import com.fasterxml.jackson.databind.Module;


@SpringBootApplication
public class IohApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(IohApiApplication.class, args);
	}
	 @Bean
    public Module jacksonJdk8Module() {
        return new Jdk8Module(); // ✅ Habilita Optional<T> y otras clases modernas
    }

}
