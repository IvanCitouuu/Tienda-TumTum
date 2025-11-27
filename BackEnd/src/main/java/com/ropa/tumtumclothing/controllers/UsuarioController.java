package com.ropa.tumtumclothing.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ropa.tumtumclothing.config.JwtUtil;
import com.ropa.tumtumclothing.entities.Usuario;
import com.ropa.tumtumclothing.services.UsuarioService;
import com.ropa.tumtumclothing.services.UsuarioServiceImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/tumtum/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService service;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public List<Usuario> List(){
        return service.findByAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> verDetalle(@PathVariable Long id){
        Optional<Usuario> usuarioOptional = service.findById(id);
        if(usuarioOptional.isPresent()){
            return ResponseEntity.ok(usuarioOptional.orElseThrow());
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping
    public ResponseEntity<Usuario> crear(@RequestBody Usuario unUsuario){
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(unUsuario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> modificar(@PathVariable Long id, @RequestBody Usuario unUsuario){
        System.out.println("=== RECIBIENDO ACTUALIZACIÓN ===");
        System.out.println("ID: " + id);
        System.out.println("Datos recibidos: " + unUsuario);
        Optional<Usuario> usOptional = service.findById(id);
        if(usOptional.isPresent()){
            Usuario usExistente = usOptional.get();
            System.out.println("Usuario existente: " + usExistente.getNombreUsuario());
            if (unUsuario.getApellidosUsuario() != null) {
                usExistente.setApellidosUsuario(unUsuario.getApellidosUsuario());
            }
            if (unUsuario.getComunaUsuario() != null) {
                usExistente.setComunaUsuario(unUsuario.getComunaUsuario());
            }
            if (unUsuario.getCorreoUsuario() != null) {
                usExistente.setCorreoUsuario(unUsuario.getCorreoUsuario());
            }
            if (unUsuario.getDireccionUsuario() != null) {
                usExistente.setDireccionUsuario(unUsuario.getDireccionUsuario());
            }
            if (unUsuario.getEstadoUsuario() != null) {
                usExistente.setEstadoUsuario(unUsuario.getEstadoUsuario());
            }
            if (unUsuario.getNacimientoUsuario() != null) {
                usExistente.setNacimientoUsuario(unUsuario.getNacimientoUsuario());
            }
            if (unUsuario.getNombreUsuario() != null) {
                usExistente.setNombreUsuario(unUsuario.getNombreUsuario());
            }
            if (unUsuario.getRegionUsuario() != null) {
                usExistente.setRegionUsuario(unUsuario.getRegionUsuario());
            }
            if (unUsuario.getRolUsuario() != null) {
                usExistente.setRolUsuario(unUsuario.getRolUsuario());
                System.out.println("Nuevo rol asignado: " + unUsuario.getRolUsuario());
            }
            if (unUsuario.getRutUsuario() != null) {
                usExistente.setRutUsuario(unUsuario.getRutUsuario());
            }
            Usuario usModificado = service.save(usExistente);
            System.out.println("Usuario actualizado exitosamente");
            return ResponseEntity.ok(usModificado);
        }
        System.out.println("Usuario no encontrado");
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/actualizar")
    public ResponseEntity<?> actualizarUsuario(@RequestBody Usuario unUsuario) {
        try {
            Optional<Usuario> usuarioOptional = service.findByRut(unUsuario.getRutUsuario());
            if (usuarioOptional.isPresent()) {
                Usuario usExistente = usuarioOptional.get();
                if (!usExistente.getCorreoUsuario().equals(unUsuario.getCorreoUsuario())) {
                    Optional<Usuario> usuarioConMismoCorreo = service.findByCorreo(unUsuario.getCorreoUsuario());
                    if (usuarioConMismoCorreo.isPresent() && 
                        !usuarioConMismoCorreo.get().getRutUsuario().equals(usExistente.getRutUsuario())) {
                        return ResponseEntity.status(HttpStatus.CONFLICT).body("El correo ya está en uso por otro usuario");
                    }
                }
                usExistente.setNombreUsuario(unUsuario.getNombreUsuario());
                usExistente.setApellidosUsuario(unUsuario.getApellidosUsuario());
                usExistente.setCorreoUsuario(unUsuario.getCorreoUsuario());
                usExistente.setNacimientoUsuario(unUsuario.getNacimientoUsuario());
                usExistente.setRegionUsuario(unUsuario.getRegionUsuario());
                usExistente.setComunaUsuario(unUsuario.getComunaUsuario());
                usExistente.setDireccionUsuario(unUsuario.getDireccionUsuario());
                Usuario usModificado = service.save(usExistente);
                return ResponseEntity.ok(usModificado);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar el usuario: " + e.getMessage());
        }
    }

    @PutMapping("/cambiar-password")
    public ResponseEntity<?> cambiarPassword(@RequestBody Map<String, String> datos) {
        try {
            String rutUsuario = datos.get("rutUsuario");
            String nuevaPassword = datos.get("contraseniaUsuario");
            Optional<Usuario> usuarioOptional = service.findByRut(rutUsuario);
            if (usuarioOptional.isPresent()) {
                Usuario usuario = usuarioOptional.get();
                usuario.setContraseniaUsuario(nuevaPassword);
                service.save(usuario);
                return ResponseEntity.ok("Contraseña actualizada correctamente");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");      
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al cambiar la contraseña: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id){
        Usuario unUsuario = new Usuario();
        unUsuario.setIdUsuario(id);
        Optional<Usuario> usuarioOptional = service.delete(unUsuario);
        if(usuarioOptional.isPresent()){
            return ResponseEntity.ok(usuarioOptional.orElseThrow());
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody Usuario unUsuario) {
        Optional<Usuario> existente = service.findByCorreo(unUsuario.getCorreoUsuario());
        if (existente.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Correo ya registrado");
        }
        Usuario nuevo = service.save(unUsuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> datos) {
        String correo = datos.get("correoUsuario");
        String contrasenia = datos.get("contraseniaUsuario");
        Optional<Usuario> usuarioOptional = service.findByCorreo(correo);
        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();
            if (((UsuarioServiceImpl) service).verificarPassword(contrasenia, usuario.getContraseniaUsuario())) {
                String token = jwtUtil.generateToken(usuario.getCorreoUsuario(), usuario.getRolUsuario());
                Map<String, Object> response = new HashMap<>();
                response.put("usuario", usuario);
                response.put("token", token);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña incorrecta");
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
    }
    
    @GetMapping("/activo")
    public ResponseEntity<?> obtenerUsuarioActivo() {
        Optional<Usuario> usuarioOptional = service.findById(2L);
        if (usuarioOptional.isPresent()) {
            return ResponseEntity.ok(usuarioOptional.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario activo no encontrado");
    }

    @PatchMapping("/{id}/rol")
    public ResponseEntity<?> cambiarRol(@PathVariable Long id, @RequestBody Map<String, String> datos) {
        try {
            Optional<Usuario> usOptional = service.findById(id);
            if(usOptional.isPresent()){
                Usuario usExistente = usOptional.get();
                String nuevoRol = datos.get("rolUsuario");
                usExistente.setRolUsuario(nuevoRol);
                
                Usuario usModificado = service.save(usExistente);
                return ResponseEntity.ok(usModificado);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al cambiar el rol: " + e.getMessage());
        }
    }
}