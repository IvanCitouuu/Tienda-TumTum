package com.ropa.tumtumclothing.entities;

import java.time.LocalDate;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuarios")
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idUsuario;
    private String nombreUsuario, contraseniaUsuario, correoUsuario, rolUsuario, estadoUsuario, direccionUsuario, apellidosUsuario, nacimientoUsuario, regionUsuario, comunaUsuario, rutUsuario;

    @Column(name = "fecha_creacion", updatable = false, nullable = false)
    private LocalDate fechaCreacionUsuario;

    @PrePersist
    protected void onCreate() {
        this.fechaCreacionUsuario = LocalDate.now();
    }

    public Usuario() {
    }

    public Usuario(long idUsuario, String nombreUsuario, String contraseniaUsuario, String correoUsuario,
            String rolUsuario, String estadoUsuario, String direccionUsuario, String apellidosUsuario,
            String nacimientoUsuario, String regionUsuario, String comunaUsuario, String rutUsuario,
            LocalDate fechaCreacionUsuario) {
        this.idUsuario = idUsuario;
        this.nombreUsuario = nombreUsuario;
        this.contraseniaUsuario = contraseniaUsuario;
        this.correoUsuario = correoUsuario;
        this.rolUsuario = rolUsuario;
        this.estadoUsuario = estadoUsuario;
        this.direccionUsuario = direccionUsuario;
        this.apellidosUsuario = apellidosUsuario;
        this.nacimientoUsuario = nacimientoUsuario;
        this.regionUsuario = regionUsuario;
        this.comunaUsuario = comunaUsuario;
        this.rutUsuario = rutUsuario;
        this.fechaCreacionUsuario = fechaCreacionUsuario;
    }

    public long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getContraseniaUsuario() {
        return contraseniaUsuario;
    }

    public void setContraseniaUsuario(String contraseniaUsuario) {
        this.contraseniaUsuario = contraseniaUsuario;
    }

    public String getCorreoUsuario() {
        return correoUsuario;
    }

    public void setCorreoUsuario(String correoUsuario) {
        this.correoUsuario = correoUsuario;
    }

    public String getRolUsuario() {
        return rolUsuario;
    }

    public void setRolUsuario(String rolUsuario) {
        this.rolUsuario = rolUsuario;
    }

    public String getEstadoUsuario() {
        return estadoUsuario;
    }

    public void setEstadoUsuario(String estadoUsuario) {
        this.estadoUsuario = estadoUsuario;
    }

    public String getDireccionUsuario() {
        return direccionUsuario;
    }

    public void setDireccionUsuario(String direccionUsuario) {
        this.direccionUsuario = direccionUsuario;
    }

    public String getApellidosUsuario() {
        return apellidosUsuario;
    }

    public void setApellidosUsuario(String apellidosUsuario) {
        this.apellidosUsuario = apellidosUsuario;
    }

    public String getNacimientoUsuario() {
        return nacimientoUsuario;
    }

    public void setNacimientoUsuario(String nacimientoUsuario) {
        this.nacimientoUsuario = nacimientoUsuario;
    }

    public String getRegionUsuario() {
        return regionUsuario;
    }

    public void setRegionUsuario(String regionUsuario) {
        this.regionUsuario = regionUsuario;
    }

    public String getComunaUsuario() {
        return comunaUsuario;
    }

    public void setComunaUsuario(String comunaUsuario) {
        this.comunaUsuario = comunaUsuario;
    }

    public String getRutUsuario() {
        return rutUsuario;
    }

    public void setRutUsuario(String rutUsuario) {
        this.rutUsuario = rutUsuario;
    }

    public LocalDate getFechaCreacionUsuario() {
        return fechaCreacionUsuario;
    }

    public void setFechaCreacionUsuario(LocalDate fechaCreacionUsuario) {
        this.fechaCreacionUsuario = fechaCreacionUsuario;
    }
}
