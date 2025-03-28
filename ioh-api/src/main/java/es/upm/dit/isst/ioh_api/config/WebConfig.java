package es.upm.dit.isst.ioh_api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // rutas a las que se aplica
                .allowedOrigins("http://localhost:5173") // frontend local
                .allowedOrigins("https://internet-casas.netlify.app") // frontend en netlify
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}