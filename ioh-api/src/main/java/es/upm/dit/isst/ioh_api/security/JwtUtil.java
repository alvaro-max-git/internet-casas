package es.upm.dit.isst.ioh_api.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // Clave secreta para firmar el token (debería almacenarse de forma segura)
    private final String jwtSecret = "cambiaEstaClavePorUnaMuyLargaYSegura12345678901234567890";

    // Duración del token en milisegundos (1 día)
    private final long jwtExpirationMs = 86400000;

    // Devuelve la clave de firma usando el secreto
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    // Genera un JWT con el nombre de usuario y el rol
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username) // Usuario
                .claim("role", role)  // Rol incluido como claim personalizado
                .setIssuedAt(new Date()) // Fecha de emisión
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs)) // Fecha de expiración
                .signWith(getSigningKey()) // Firma con clave secreta
                .compact(); // Compacta el JWT
    }

    // Extrae el nombre de usuario (subject) del token
    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    // Extrae el rol del token desde los claims
    public String getRoleFromToken(String token) {
        return (String) Jwts.parserBuilder().setSigningKey(getSigningKey()).build()
                .parseClaimsJws(token).getBody().get("role");
    }

    // Valida la integridad y validez del token
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
            return true; // Si no lanza excepción, es válido
        } catch (JwtException | IllegalArgumentException e) {
            return false; // Token mal formado, inválido o expirado
        }
    }
}
