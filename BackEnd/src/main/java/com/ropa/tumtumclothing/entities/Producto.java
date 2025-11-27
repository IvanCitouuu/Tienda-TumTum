package com.ropa.tumtumclothing.entities;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "productos")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Producto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProducto;
    private String nombreProducto, descripcionProducto, categoriaProducto, imgUrlProducto, estadoProducto;
    private int stockProducto, precioProducto;

    @Column(name = "fecha_creacion", updatable = false, nullable = false)
    private LocalDate fechaCreacionProducto;

    @OneToMany(mappedBy = "productoDetalle", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("productoDetalle")
    private List<DetallePedido> detalles = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.fechaCreacionProducto = LocalDate.now();
    }

    public Producto() {
    }

    public Producto(Long idProducto, String nombreProducto, String descripcionProducto, String categoriaProducto,
            String imgUrlProducto, String estadoProducto, int stockProducto, int precioProducto,
            LocalDate fechaCreacionProducto) {
        this.idProducto = idProducto;
        this.nombreProducto = nombreProducto;
        this.descripcionProducto = descripcionProducto;
        this.categoriaProducto = categoriaProducto;
        this.imgUrlProducto = imgUrlProducto;
        this.estadoProducto = estadoProducto;
        this.stockProducto = stockProducto;
        this.precioProducto = precioProducto;
        this.fechaCreacionProducto = fechaCreacionProducto;
    }

    public Long getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Long idProducto) {
        this.idProducto = idProducto;
    }

    public String getNombreProducto() {
        return nombreProducto;
    }

    public void setNombreProducto(String nombreProducto) {
        this.nombreProducto = nombreProducto;
    }

    public String getDescripcionProducto() {
        return descripcionProducto;
    }

    public void setDescripcionProducto(String descripcionProducto) {
        this.descripcionProducto = descripcionProducto;
    }

    public String getCategoriaProducto() {
        return categoriaProducto;
    }

    public void setCategoriaProducto(String categoriaProducto) {
        this.categoriaProducto = categoriaProducto;
    }

    public String getImgUrlProducto() {
        return imgUrlProducto;
    }

    public void setImgUrlProducto(String imgUrlProducto) {
        this.imgUrlProducto = imgUrlProducto;
    }

    public String getEstadoProducto() {
        return estadoProducto;
    }

    public void setEstadoProducto(String estadoProducto) {
        this.estadoProducto = estadoProducto;
    }

    public int getStockProducto() {
        return stockProducto;
    }

    public void setStockProducto(int stockProducto) {
        this.stockProducto = stockProducto;
    }

    public int getPrecioProducto() {
        return precioProducto;
    }

    public void setPrecioProducto(int precioProducto) {
        this.precioProducto = precioProducto;
    }

    public LocalDate getFechaCreacionProducto() {
        return fechaCreacionProducto;
    }

    public void setFechaCreacionProducto(LocalDate fechaCreacionProducto) {
        this.fechaCreacionProducto = fechaCreacionProducto;
    }

        public List<DetallePedido> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetallePedido> detalles) {
        this.detalles = detalles;
    }
}

