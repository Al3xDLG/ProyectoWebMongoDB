/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.dsm503.bibliotecavideojuegos.model;

/**
 *
 * @author Lenovo
 */
public class Videojuego {
    private int idVideojuego;
    private String titulo;
    private Desarrolladora desarrolladora;
    private String fechaPublicacion;

    public Videojuego() {
    }

    public Videojuego(int idVideojuego, String titulo, Desarrolladora desarrolladora, String fechaPublicacion) {
        this.idVideojuego = idVideojuego;
        this.titulo = titulo;
        this.desarrolladora = desarrolladora;
        this.fechaPublicacion = fechaPublicacion;
    }

    public int getIdVideojuego() {
        return idVideojuego;
    }

    public void setIdVideojuego(int idVideojuego) {
        this.idVideojuego = idVideojuego;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public Desarrolladora getDesarrolladora() {
        return desarrolladora;
    }

    public void setDesarrolladora(Desarrolladora desarrolladora) {
        this.desarrolladora = desarrolladora;
    }

    public String getFechaPublicacion() {
        return fechaPublicacion;
    }

    public void setFechaPublicacion(String fechaPublicacion) {
        this.fechaPublicacion = fechaPublicacion;
    }
    
    
}
