/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Main.java to edit this template
 */
package org.utl.dsm503.bibliotecavideojuegos.core;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import org.bson.Document;

/**
 *
 * @author Lenovo
 */
public class MongoTest {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        ControllerVideojuegos cvj = new ControllerVideojuegos();
        try {
            cvj.cargarVideojuegos();
        } catch (Exception e) {
            e.printStackTrace();
        }
        
    }
    
}
