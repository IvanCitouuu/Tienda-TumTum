package com.ropa.tumtumclothing.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.ropa.tumtumclothing.entities.Pedido;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByCorreoClientePedido(String correoClientePedido);
    List<Pedido> findByCorreoClientePedidoOrderByFechaCreacionPedidoDesc(String correoClientePedido);
    
    @Query("SELECT DISTINCT p FROM Pedido p " +
           "LEFT JOIN FETCH p.detalles d " +
           "LEFT JOIN FETCH d.productoDetalle " +
           "WHERE p.correoClientePedido = :correo " +
           "ORDER BY p.fechaCreacionPedido DESC")
    List<Pedido> findByCorreoClienteWithDetails(@Param("correo") String correo);
}