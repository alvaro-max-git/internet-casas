package es.upm.dit.isst.ioh_api.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil; // Utilidad para manejo de JWTs (validación, extracción de datos, etc.)

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Se obtiene el encabezado Authorization del request
        String header = request.getHeader("Authorization");

        // Verifica que el encabezado no sea nulo y comience con "Bearer "
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7); // Extrae el token quitando el prefijo "Bearer "

            // Si el token es válido, se extraen los datos y se configura la autenticación
            if (jwtUtil.validateToken(token)) {
                String username = jwtUtil.getUsernameFromToken(token); // Obtiene el usuario desde el token
                String role = jwtUtil.getRoleFromToken(token); // Obtiene el rol desde el token

                // Crea una autenticación con el nombre de usuario y su rol
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                Collections.singletonList(new SimpleGrantedAuthority(role))
                        );

                // Establece el contexto de seguridad con la autenticación creada
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        // Continúa con la cadena de filtros
        filterChain.doFilter(request, response);
    }
}
