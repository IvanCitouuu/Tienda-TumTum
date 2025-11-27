package com.ropa.tumtumclothing.services;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ropa.tumtumclothing.entities.Producto;
import com.ropa.tumtumclothing.repository.DetallePedidoRepository;
import com.ropa.tumtumclothing.repository.ProductoRepository;

@Service
public class ProductoServiceImpl implements ProductoService{

    @Autowired
    private ProductoRepository repository;

    @Autowired
    private DetallePedidoRepository detalleRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Producto> findByAll() {
        return (List<Producto>) repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Producto> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    @Transactional
    public Producto save(Producto unProducto) {
        return repository.save(unProducto);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        detalleRepository.deleteByProductoId(id);
        repository.deleteById(id);
    }
}