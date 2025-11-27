package com.ropa.tumtumclothing.services;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ropa.tumtumclothing.entities.DetallePedido;
import com.ropa.tumtumclothing.entities.Pedido;
import com.ropa.tumtumclothing.entities.Producto;
import com.ropa.tumtumclothing.repository.PedidoRepository;
import com.ropa.tumtumclothing.repository.ProductoRepository;

@Service
public class PedidoServiceImpl implements PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Override
    @Transactional
    public Pedido save(Pedido pedido) {
        if (pedido.getDetalles() == null || pedido.getDetalles().isEmpty()) {
            throw new IllegalArgumentException("El pedido debe contener al menos un producto");
        }
        for (DetallePedido detalle : pedido.getDetalles()) {
            Producto producto = productoRepository.findById(
                detalle.getProductoDetalle().getIdProducto()
            ).orElseThrow(() -> new RuntimeException(
                "Producto no encontrado con ID: " + detalle.getProductoDetalle().getIdProducto()
            ));
            detalle.setProductoDetalle(producto);
            detalle.setPedidoDetalle(pedido);
        }
        System.out.println("[SERVICE] Total del pedido antes de guardar: " + pedido.getTotalPedido());
        System.out.println("[SERVICE] Cantidad de detalles: " + pedido.getDetalles().size());
        Pedido pedidoGuardado = pedidoRepository.save(pedido);
        System.out.println("[SERVICE] Total del pedido después de guardar: " + pedidoGuardado.getTotalPedido());
        return pedidoGuardado;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Pedido> findByAll() {
        return pedidoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Pedido> findById(Long id) {
        return pedidoRepository.findById(id);
    }

    @Override
    @Transactional
    public Optional<Pedido> delete(Pedido pedido) {
        pedidoRepository.delete(pedido);
        return Optional.of(pedido);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Pedido> findByCorreoCliente(String correoCliente) {
        return pedidoRepository.findByCorreoClientePedido(correoCliente);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Pedido> findByCorreoClienteOrderByFechaDesc(String correoCliente) {
        return pedidoRepository.findByCorreoClientePedidoOrderByFechaCreacionPedidoDesc(correoCliente);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Pedido> findByCorreoClienteWithDetails(String correo) {
        List<Pedido> pedidos = pedidoRepository.findByCorreoClienteWithDetails(correo);
        for (Pedido pedido : pedidos) {
            if (pedido.getDetalles() != null) {
                pedido.getDetalles().size();
                for (DetallePedido detalle : pedido.getDetalles()) {
                    if (detalle.getProductoDetalle() != null) {
                        detalle.getProductoDetalle().getNombreProducto();
                        detalle.getProductoDetalle().getPrecioProducto();
                        detalle.getProductoDetalle().getIdProducto();
                    }
                }
            }
        }
        System.out.println("Pedidos cargados con detalles: " + pedidos.size());
        return pedidos;
    }

    @Override
    @Transactional
    public Pedido actualizarEstado(Long id, String nuevoEstado) {
        Optional<Pedido> pedidoOptional = pedidoRepository.findById(id);
        if (pedidoOptional.isPresent()) {
            Pedido pedido = pedidoOptional.get();
            pedido.setEstadoPedido(nuevoEstado);
            return pedidoRepository.save(pedido);
        } else {
            throw new RuntimeException("Pedido no encontrado con ID: " + id);
        }
    }
}