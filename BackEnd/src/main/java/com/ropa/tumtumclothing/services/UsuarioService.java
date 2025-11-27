package com.ropa.tumtumclothing.services;

import java.util.List;
import java.util.Optional;
import com.ropa.tumtumclothing.entities.Usuario;

public interface UsuarioService {
    List<Usuario> findByAll();
    Optional<Usuario> findById(Long id);
    Usuario save( Usuario unUsuario);
    Optional<Usuario> delete(Usuario unUsuario);
    Optional<Usuario> findByCorreo(String correoUsuario);
    Optional<Usuario> findByRut(String rutUsuario);
}