package com.ropa.tumtumclothing.services;

import java.util.List;
import java.util.Optional;
import com.ropa.tumtumclothing.entities.Producto;

public interface ProductoService {
    List<Producto> findByAll();
    Optional<Producto> findById(Long id);
    Producto save(Producto producto);
    void deleteById(Long id);
}