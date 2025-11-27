package com.ropa.tumtumclothing.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;

@Entity
@Table(name = "detalles")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DetallePedido {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle")
    private Long idDetalle;
    
    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = false)
    @JsonIgnoreProperties({"detalles", "hibernateLazyInitializer", "handler"})
    private Pedido pedidoDetalle;
    
    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Producto productoDetalle;
    
    @Column(name = "cantidad_detalle", nullable = false)
    private Integer cantidadDetalle;
    
    @Column(name = "talla")
    private String talla;

    public DetallePedido() {}

    public DetallePedido(Producto productoDetalle, Pedido pedidoDetalle, Integer cantidadDetalle, String talla) {
        this.productoDetalle = productoDetalle;
        this.pedidoDetalle = pedidoDetalle;
        this.cantidadDetalle = cantidadDetalle;
        this.talla = talla;
    }

    public Long getIdDetalle() { return idDetalle; }
    public void setIdDetalle(Long idDetalle) { this.idDetalle = idDetalle; }
    public Pedido getPedidoDetalle() { return pedidoDetalle; }
    public void setPedidoDetalle(Pedido pedidoDetalle) { this.pedidoDetalle = pedidoDetalle; }
    public Producto getProductoDetalle() { return productoDetalle; }
    public void setProductoDetalle(Producto productoDetalle) { this.productoDetalle = productoDetalle; }
    public Integer getCantidadDetalle() { return cantidadDetalle; }
    public void setCantidadDetalle(Integer cantidadDetalle) { this.cantidadDetalle = cantidadDetalle; }
    public String getTalla() { return talla; }
    public void setTalla(String talla) { this.talla = talla; }
}