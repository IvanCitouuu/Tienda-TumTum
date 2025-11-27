package com.ropa.tumtumclothing.entities;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "pedidos")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido")
    private Long idPedido;

    @Column(name = "correo_cliente_pedido")
    private String correoClientePedido;
    
    @Column(name = "estado_pedido")
    private String estadoPedido;
    
    @Column(name = "nombre_cliente_pedido")
    private String nombreClientePedido;
    
    @Column(name = "subtotal_pedido")
    private Double subtotalPedido;
    
    @Column(name = "iva_pedido")
    private Double ivaPedido;
    
    @Column(name = "total_pedido")
    private Double totalPedido;

    @Column(name = "fecha_creacion", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaCreacionPedido;

    @OneToMany(mappedBy = "pedidoDetalle", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonIgnoreProperties("pedidoDetalle")
    private List<DetallePedido> detalles = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (this.fechaCreacionPedido == null) {
            this.fechaCreacionPedido = LocalDate.now();
        }

        if (this.subtotalPedido != null && this.ivaPedido == null) {
            this.ivaPedido = this.subtotalPedido * 0.19;
        }
 
        if (this.subtotalPedido != null && this.ivaPedido != null && this.totalPedido == null) {
            this.totalPedido = this.subtotalPedido + this.ivaPedido;
        }
        
        System.out.println("[ENTITY] Pedido creado - ID: " + idPedido + 
                         ", Subtotal: " + subtotalPedido + 
                         ", IVA: " + ivaPedido + 
                         ", Total: " + totalPedido + 
                         ", Fecha: " + fechaCreacionPedido);
    }

    public Pedido() {
    }

    public Long getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(Long idPedido) {
        this.idPedido = idPedido;
    }

    public String getCorreoClientePedido() {
        return correoClientePedido;
    }

    public void setCorreoClientePedido(String correoClientePedido) {
        this.correoClientePedido = correoClientePedido;
    }

    public String getEstadoPedido() {
        return estadoPedido;
    }

    public void setEstadoPedido(String estadoPedido) {
        this.estadoPedido = estadoPedido;
    }

    public String getNombreClientePedido() {
        return nombreClientePedido;
    }

    public void setNombreClientePedido(String nombreClientePedido) {
        this.nombreClientePedido = nombreClientePedido;
    }

    public Double getSubtotalPedido() {
        return subtotalPedido;
    }

    public void setSubtotalPedido(Double subtotalPedido) {
        this.subtotalPedido = subtotalPedido;
    }

    public Double getIvaPedido() {
        return ivaPedido;
    }

    public void setIvaPedido(Double ivaPedido) {
        this.ivaPedido = ivaPedido;
    }

    public Double getTotalPedido() {
        return totalPedido;
    }

    public void setTotalPedido(Double totalPedido) {
        this.totalPedido = totalPedido;
    }

    public LocalDate getFechaCreacionPedido() {
        return fechaCreacionPedido;
    }

    public void setFechaCreacionPedido(LocalDate fechaCreacionPedido) {
        this.fechaCreacionPedido = fechaCreacionPedido;
    }

    public List<DetallePedido> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetallePedido> detalles) {
        this.detalles = detalles;
    }

    @Override
    public String toString() {
        return "Pedido{" +
                "idPedido=" + idPedido +
                ", correoClientePedido='" + correoClientePedido + '\'' +
                ", estadoPedido='" + estadoPedido + '\'' +
                ", nombreClientePedido='" + nombreClientePedido + '\'' +
                ", subtotalPedido=" + subtotalPedido +
                ", ivaPedido=" + ivaPedido +
                ", totalPedido=" + totalPedido +
                ", fechaCreacionPedido=" + fechaCreacionPedido +
                ", detalles=" + (detalles != null ? detalles.size() : 0) +
                '}';
    }
}