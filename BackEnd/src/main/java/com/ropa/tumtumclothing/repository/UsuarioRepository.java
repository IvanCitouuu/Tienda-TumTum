package com.ropa.tumtumclothing.repository;

import java.util.Optional;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.ropa.tumtumclothing.entities.Usuario;

@Repository
public interface UsuarioRepository extends CrudRepository<Usuario, Long> {
    Optional<Usuario> findByCorreoUsuario(String correoUsuario);
    Optional<Usuario> findByRutUsuario(String rutUsuario);
}