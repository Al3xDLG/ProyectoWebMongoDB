/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.dsm503.bibliotecavideojuegos.model;

/**
 *
 * @author Lenovo
 */
public class Desarrolladora {
    private int idDesarrolladora;
    private String nombre;
    private String fechaFundacion;

    public Desarrolladora() {
    }

    public Desarrolladora(int idDesarrolladora, String nombre, String fechaFundacion) {
        this.idDesarrolladora = idDesarrolladora;
        this.nombre = nombre;
        this.fechaFundacion = fechaFundacion;
    }

    public int getIdDesarrolladora() {
        return idDesarrolladora;
    }

    public void setIdDesarrolladora(int idDesarrolladora) {
        this.idDesarrolladora = idDesarrolladora;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getFechaFundacion() {
        return fechaFundacion;
    }

    public void setFechaFundacion(String fechaFundacion) {
        this.fechaFundacion = fechaFundacion;
    }
    
    
}
