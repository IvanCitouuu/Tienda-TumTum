package com.ropa.tumtumclothing.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {
    private final String SECRET_STRING = "miClaveSecretaSuperSeguraParaJWTTokenDeTumTumClothing2024QueEsMuyLargaParaSerSegura123456789";
    private final SecretKey secretKey = Keys.hmacShaKeyFor(SECRET_STRING.getBytes());
    private final long expirationMs = 86400000;

    public String generateToken(String email, String rol) {
        System.out.println("Generando token para: " + email + " con rol: " + rol);
        return Jwts.builder()
                .setSubject(email)
                .claim("rol", rol)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String getEmailFromToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (Exception e) {
            System.out.println("Error extrayendo email del token: " + e.getMessage());
            return null;
        }
    }

    public String getRolFromToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .get("rol", String.class);
        } catch (Exception e) {
            System.out.println("Error extrayendo rol del token: " + e.getMessage());
            return null;
        }
    }

    public boolean validateToken(String token) {
        try {
            System.out.println("Validando token...");
            Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token);
            System.out.println("Token validado correctamente");
            return true;
        } catch (ExpiredJwtException e) {
            System.out.println("Token expirado: " + e.getMessage());
        } catch (MalformedJwtException e) {
            System.out.println("Token mal formado: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Error validando token: " + e.getMessage());
        }
        return false;
    }
}