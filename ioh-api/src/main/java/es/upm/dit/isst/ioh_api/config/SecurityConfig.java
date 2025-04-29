package es.upm.dit.isst.ioh_api.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import es.upm.dit.isst.ioh_api.security.JwtAuthFilter;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer.FrameOptionsConfig;
import org.springframework.security.core.userdetails.UserDetailsService;
import javax.sql.DataSource;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService jdbcUserDetailsService(DataSource dataSource) {
        String usersByUsernameQuery = "select email as username, password, true as enabled from usuario where email = ?";
        String authsByUserQuery = "select email as username, role as authority from usuario where email = ?";
        
        JdbcUserDetailsManager users = new JdbcUserDetailsManager(dataSource);
        users.setUsersByUsernameQuery(usersByUsernameQuery);
        users.setAuthoritiesByUsernameQuery(authsByUserQuery);
        return users;
    }

    @Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
        .cors(Customizer.withDefaults())    // Habilitar CORS para todas las peticiones
        .authorizeHttpRequests(auth -> auth
          // Ejemplos:
          .requestMatchers("/api/auth/**").permitAll()  // El registro y login es libre
          .requestMatchers("/api/accesses/by-token/**").permitAll() // Permitir acceso libre si se tiene token
          .requestMatchers("/h2-console/**").permitAll() // Permitir H2 Console (SOLO EN DESARROLLO)

          .requestMatchers(HttpMethod.POST, "/api/accesses").hasRole("HOST")
          .requestMatchers(HttpMethod.PUT, "/api/accesses/{id}").hasAnyRole("HOST", "USER")
          .requestMatchers(HttpMethod.PUT, "/api/accesses/{id}/carpeta").hasRole("USER")
          .requestMatchers(HttpMethod.DELETE, "/api/accesses/{id}").hasRole("HOST")
          .requestMatchers(HttpMethod.GET, "/api/accesses/{id}").hasAnyRole("HOST", "USER") // Review if needed
          .requestMatchers(HttpMethod.POST, "/api/accesses/{accessId}/open").authenticated()

          .requestMatchers("/api/me/locks").hasRole("HOST")
          .requestMatchers("/api/me/google-token/**").hasRole("HOST")
          .requestMatchers("/api/me/lock-events").hasRole("HOST")
          .requestMatchers("/api/me/**").authenticated() // Filtro general

          .requestMatchers(HttpMethod.GET, "/api/locks/{lockId}").hasAnyRole("HOST", "USER")
          .requestMatchers(HttpMethod.POST, "/api/locks/{lockId}/block").hasRole("HOST")
          .requestMatchers(HttpMethod.POST, "/api/locks/{lockId}/unblock").hasRole("HOST")
          .anyRequest().denyAll() // O .authenticated(), según tu preferencia
        )
        // Desactivamos CSRF si estás haciendo llamadas AJAX desde React
        .csrf(csrf -> csrf.disable())
        // No necesitas formLogin si tu login es por JSON:
        .formLogin(form -> form.disable())
        // O si prefieres permitir Basic Auth:
        //.httpBasic(Customizer.withDefaults()); //Esto no es necesario si mandamos el login por JSON
        .headers(headers -> headers.frameOptions(FrameOptionsConfig::disable))
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
      
        return http.build();
    }

}