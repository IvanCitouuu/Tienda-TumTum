package com.ropa.tumtumclothing.services;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ropa.tumtumclothing.entities.Usuario;
import com.ropa.tumtumclothing.repository.UsuarioRepository;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public List<Usuario> findByAll() {
        return (List<Usuario>) repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    @Transactional
    public Usuario save(Usuario unUsuario) {
        if (unUsuario.getContraseniaUsuario() != null && 
            !unUsuario.getContraseniaUsuario().startsWith("$2a$")) {
            String hashedPassword = passwordEncoder.encode(unUsuario.getContraseniaUsuario());
            unUsuario.setContraseniaUsuario(hashedPassword);
        }
        return repository.save(unUsuario);
    }

    @Override
    @Transactional
    public Optional<Usuario> delete(Usuario unUsuario) {
        Optional<Usuario> usOptional = repository.findById(unUsuario.getIdUsuario());
        usOptional.ifPresent(usuarioDB->{
            repository.delete(unUsuario);
        });
        return usOptional;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> findByCorreo(String correoUsuario) {
        return repository.findByCorreoUsuario(correoUsuario);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> findByRut(String rutUsuario) {
        return repository.findByRutUsuario(rutUsuario);
    }

    public boolean verificarPassword(String plainPassword, String hashedPassword) {
        return passwordEncoder.matches(plainPassword, hashedPassword);
    }
}