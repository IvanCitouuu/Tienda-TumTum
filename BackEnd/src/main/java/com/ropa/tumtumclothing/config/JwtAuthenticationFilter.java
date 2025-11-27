package com.ropa.tumtumclothing.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
        HttpServletResponse response, 
        FilterChain filterChain) throws ServletException, IOException {
        String requestPath = request.getRequestURI();
        String authHeader = request.getHeader("Authorization");
        System.out.println("=== JWT FILTER START ===");
        System.out.println("Path: " + requestPath);
        System.out.println("Authorization Header: " + authHeader);
        
        if (isPublicPath(requestPath)) {
            System.out.println("Ruta pública - continuando sin autenticación");
            filterChain.doFilter(request, response);
            return;
        }
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            System.out.println("Token encontrado: " + token.substring(0, Math.min(20, token.length())) + "...");
            try {
                if (jwtUtil.validateToken(token)) {
                    String email = jwtUtil.getEmailFromToken(token);
                    String rol = jwtUtil.getRolFromToken(token);
                    System.out.println("Token válido");
                    System.out.println("Email: " + email);
                    System.out.println("Rol: " + rol);
                    UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(
                            email, 
                            null, 
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + rol))
                        );
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("Autenticación establecida en SecurityContext");
                } else {
                    System.out.println("Token inválido según JwtUtil");
                    sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Token inválido");
                    return;
                }
            } catch (Exception e) {
                System.out.println("Error procesando token: " + e.getMessage());
                e.printStackTrace();
                sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Error procesando token: " + e.getMessage());
                return;
            }
        } else {
            System.out.println("No se encontró token Bearer en el header");
            sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Token de autorización requerido");
            return;
        }
        System.out.println("=== JWT FILTER END ===");
        filterChain.doFilter(request, response);
    }
    
    private boolean isPublicPath(String path) {
        return path.contains("/usuarios/login") || 
               path.contains("/usuarios/register") ||
               path.contains("/productos") ||
               path.contains("/swagger-ui") ||
               path.contains("/v3/api-docs") ||
               path.contains("/swagger-resources");
    }
    
    private void sendErrorResponse(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"" + message + "\"}");
    }
}