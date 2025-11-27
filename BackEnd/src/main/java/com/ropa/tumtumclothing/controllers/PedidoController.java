package com.ropa.tumtumclothing.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ropa.tumtumclothing.entities.DetallePedido;
import com.ropa.tumtumclothing.entities.Pedido;
import com.ropa.tumtumclothing.entities.Producto;
import com.ropa.tumtumclothing.repository.ProductoRepository;
import com.ropa.tumtumclothing.repository.PedidoRepository;
import com.ropa.tumtumclothing.services.PedidoService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/tumtum/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private PedidoRepository pedidoRepository;  

    @Autowired
    private ProductoRepository productoRepository;

    @GetMapping
    public List<Pedido> listarPedidos() {
        return pedidoService.findByAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> verPedido(@PathVariable Long id) {
        Optional<Pedido> pedido = pedidoService.findById(id);
        if (pedido.isPresent()) {
            return ResponseEntity.ok(pedido.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pedido no encontrado");
        }
    }

    @GetMapping("/usuario/{correo}")
    public ResponseEntity<?> obtenerPedidosPorUsuario(@PathVariable String correo) {
        try {
            List<Pedido> pedidos = pedidoService.findByCorreoClienteWithDetails(correo);
            return ResponseEntity.ok(pedidos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener pedidos: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> crearPedido(@RequestBody Map<String, Object> requestBody) {
        try {
            System.out.println("[CONTROLLER] === INICIANDO CREACIÓN DE PEDIDO CON IVA ===");
            System.out.println("[CONTROLLER] JSON recibido: " + requestBody.toString());

            if (!requestBody.containsKey("estadoPedido") || !requestBody.containsKey("correoClientePedido") || 
                !requestBody.containsKey("nombreClientePedido") || !requestBody.containsKey("totalPedido") ||
                !requestBody.containsKey("detalles")) {
                return ResponseEntity.badRequest().body("Faltan campos obligatorios en el pedido");
            }
            
            Pedido pedido = new Pedido();
            pedido.setEstadoPedido((String) requestBody.get("estadoPedido"));
            pedido.setCorreoClientePedido((String) requestBody.get("correoClientePedido"));
            pedido.setNombreClientePedido((String) requestBody.get("nombreClientePedido"));

            Object subtotalObj = requestBody.get("subtotalPedido");
            Object ivaObj = requestBody.get("ivaPedido");
            Object totalObj = requestBody.get("totalPedido");
            
            Double subtotal = subtotalObj != null ? Double.valueOf(subtotalObj.toString()) : 0.0;
            Double iva = ivaObj != null ? Double.valueOf(ivaObj.toString()) : 0.0;
            Double total = totalObj != null ? Double.valueOf(totalObj.toString()) : 0.0;

            if (subtotal > 0 && iva == 0.0) {
                iva = subtotal * 0.19;
                System.out.println("[CONTROLLER] IVA calculado automáticamente: " + iva);
            }

            if (subtotal > 0 && iva > 0 && total == 0.0) {
                total = subtotal + iva;
                System.out.println("[CONTROLLER] Total calculado automáticamente: " + total);
            }
            
            pedido.setSubtotalPedido(subtotal);
            pedido.setIvaPedido(iva);
            pedido.setTotalPedido(total);
            
            System.out.println("[CONTROLLER] Subtotal: " + subtotal);
            System.out.println("[CONTROLLER] IVA (19%): " + iva);
            System.out.println("[CONTROLLER] Total con IVA: " + total);
            Object detallesObj = requestBody.get("detalles");
            List<Map<String, Object>> detallesRaw = new ArrayList<>();
            if (detallesObj instanceof List) {
                for (Object item : (List<?>) detallesObj) {
                    if (item instanceof Map) {
                        @SuppressWarnings("unchecked")
                        Map<String, Object> detalleMap = (Map<String, Object>) item;
                        detallesRaw.add(detalleMap);
                    }
                }
            } else {
                return ResponseEntity.badRequest().body("El campo 'detalles' debe ser una lista válida");
            }           
                      
            System.out.println("[CONTROLLER] Procesando " + detallesRaw.size() + " detalles...");
            List<DetallePedido> detalles = new ArrayList<>();
            for (Map<String, Object> detalleRaw : detallesRaw) {
                if (!detalleRaw.containsKey("idProducto") || !detalleRaw.containsKey("cantidadDetalle") || !detalleRaw.containsKey("talla")) {
                    return ResponseEntity.badRequest().body("Faltan campos en el detalle del pedido");
                }
                Long idProducto = Long.valueOf(detalleRaw.get("idProducto").toString());
                Integer cantidad = Integer.valueOf(detalleRaw.get("cantidadDetalle").toString());
                String talla = (String) detalleRaw.get("talla");
                System.out.println("[CONTROLLER] Buscando producto ID: " + idProducto);
                Producto producto = productoRepository.findById(idProducto)
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + idProducto));            
                System.out.println("[CONTROLLER] Producto encontrado: " + producto.getNombreProducto() + " - Precio: " + producto.getPrecioProducto());
                DetallePedido detalle = new DetallePedido();
                detalle.setProductoDetalle(producto);
                detalle.setPedidoDetalle(pedido);
                detalle.setCantidadDetalle(cantidad);
                detalle.setTalla(talla);
                detalles.add(detalle);
                System.out.println("[CONTROLLER] Detalle creado: " + producto.getNombreProducto() + " - Talla: " + talla + " - Cantidad: " + cantidad);
            }      
            pedido.setDetalles(detalles);
            System.out.println("[CONTROLLER] Guardando pedido en la base de datos...");
            Pedido pedidoGuardado = pedidoService.save(pedido);
            System.out.println("[CONTROLLER] Pedido guardado exitosamente con ID: " + pedidoGuardado.getIdPedido());
            System.out.println("[CONTROLLER] Subtotal final: " + pedidoGuardado.getSubtotalPedido());
            System.out.println("[CONTROLLER] IVA final: " + pedidoGuardado.getIvaPedido());
            System.out.println("[CONTROLLER] Total final: " + pedidoGuardado.getTotalPedido());
            System.out.println("[CONTROLLER] === PEDIDO CON IVA CREADO EXITOSAMENTE ===");
            
            return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of(
                    "mensaje", "Pedido registrado correctamente",
                    "idPedido", pedidoGuardado.getIdPedido(),
                    "subtotal", pedidoGuardado.getSubtotalPedido(),
                    "iva", pedidoGuardado.getIvaPedido(),
                    "total", pedidoGuardado.getTotalPedido()
                )
            );
        } catch (Exception e) {
            System.err.println("[CONTROLLER] Error al registrar el pedido: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error al registrar el pedido: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> modificarPedido(@PathVariable Long id, @RequestBody Pedido pedidoActualizado) {
        Optional<Pedido> pedidoOptional = pedidoService.findById(id);
        if (pedidoOptional.isPresent()) {
            Pedido pedidoExistente = pedidoOptional.get();
            pedidoExistente.setCorreoClientePedido(pedidoActualizado.getCorreoClientePedido());
            pedidoExistente.setNombreClientePedido(pedidoActualizado.getNombreClientePedido());
            pedidoExistente.setEstadoPedido(pedidoActualizado.getEstadoPedido());
            pedidoExistente.setFechaCreacionPedido(pedidoActualizado.getFechaCreacionPedido());
            pedidoExistente.setSubtotalPedido(pedidoActualizado.getSubtotalPedido());
            pedidoExistente.setIvaPedido(pedidoActualizado.getIvaPedido());
            pedidoExistente.setTotalPedido(pedidoActualizado.getTotalPedido());
            pedidoExistente.setDetalles(pedidoActualizado.getDetalles());
            Pedido pedidoModificado = pedidoService.save(pedidoExistente);
            return ResponseEntity.ok(pedidoModificado);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pedido no encontrado");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarPedido(@PathVariable Long id) {
        try {
            Pedido pedido = new Pedido();
            pedido.setIdPedido(id);
            pedidoRepository.delete(pedido);
            return ResponseEntity.ok("Pedido eliminado correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    } 

    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstadoPedido(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            System.out.println("Actualizando estado del pedido " + id);
            String nuevoEstado = request.get("estado");     
            System.out.println("Nuevo estado: " + nuevoEstado);
            if (nuevoEstado == null || nuevoEstado.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El estado no puede estar vacío");
            }
            Pedido pedidoActualizado = pedidoService.actualizarEstado(id, nuevoEstado);
            System.out.println("Estado actualizado exitosamente a: " + pedidoActualizado.getEstadoPedido());
            return ResponseEntity.ok(pedidoActualizado);
        } catch (IllegalArgumentException e) {
            System.err.println("Error de validación: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            System.err.println("Pedido no encontrado: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Error actualizando estado: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error actualizando estado: " + e.getMessage());
        }
    }
}