package com.ropa.tumtumclothing.controllers;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ropa.tumtumclothing.entities.Producto;
import com.ropa.tumtumclothing.services.ProductoService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/tumtum")
public class ProductoController {

    @Autowired
    private ProductoService service;
    
    @GetMapping("/productos")
    public List<Producto> List(){
        return service.findByAll();
    }
    
    @GetMapping("/productos/{id}")
    public ResponseEntity<?> verDetalle(@PathVariable Long id){
        Optional<Producto> prodOptional = service.findById(id);
        if (prodOptional.isPresent()){
            return ResponseEntity.ok(prodOptional.orElseThrow());
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/productos")
    public ResponseEntity<Producto> crear(@RequestBody Producto unProducto){
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(unProducto));
    }
    
    @PutMapping("/productos/{id}")
    public ResponseEntity<?> modificar(@PathVariable Long id, @RequestBody Producto unProducto){
        Optional<Producto> prodOptional = service.findById(id);
        if (prodOptional.isPresent()){
            Producto prodExistente = prodOptional.get();
            prodExistente.setNombreProducto(unProducto.getNombreProducto());
            prodExistente.setCategoriaProducto(unProducto.getCategoriaProducto());
            prodExistente.setDescripcionProducto(unProducto.getDescripcionProducto());
            prodExistente.setEstadoProducto(unProducto.getEstadoProducto());
            prodExistente.setFechaCreacionProducto(unProducto.getFechaCreacionProducto());
            prodExistente.setPrecioProducto(unProducto.getPrecioProducto());
            prodExistente.setStockProducto(unProducto.getStockProducto());
            prodExistente.setImgUrlProducto(unProducto.getImgUrlProducto());
            Producto prodModificado = service.save(prodExistente);
            return ResponseEntity.ok(prodModificado);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/productos/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            service.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar producto: " + e.getMessage());
        }
    }
}