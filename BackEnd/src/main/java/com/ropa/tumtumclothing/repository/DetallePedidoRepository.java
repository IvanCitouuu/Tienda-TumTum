package com.ropa.tumtumclothing.repository;

import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import com.ropa.tumtumclothing.entities.DetallePedido;
import com.ropa.tumtumclothing.entities.Producto;

public interface DetallePedidoRepository extends CrudRepository<DetallePedido,Long> {
    List<DetallePedido> findByProductoDetalle(Producto producto);

    @Modifying
    @Query("DELETE FROM DetallePedido d WHERE d.productoDetalle.idProducto = :productoId")
    void deleteByProductoId(@Param("productoId") Long productoId);
}