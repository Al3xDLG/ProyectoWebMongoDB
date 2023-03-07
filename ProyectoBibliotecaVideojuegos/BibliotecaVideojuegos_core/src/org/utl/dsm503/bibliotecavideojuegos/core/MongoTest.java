/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Main.java to edit this template
 */
package org.utl.dsm503.bibliotecavideojuegos.core;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
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
        String connectionString = "mongodb://localhost:27017";
        String dbName = "biblioteca_videojuegos";
        String collectionName = "desarrolladoras";
        try (var mongoClient = MongoClients.create(connectionString)) {
            MongoDatabase database = mongoClient.getDatabase(dbName);
            MongoCollection<Document> collection = database.getCollection(collectionName);

            // Obtener todos los documentos de la colección
            List<Document> desarrolladoras = collection.find().into(new ArrayList<>());
            for (Document desarrolladora : desarrolladoras) {
                System.out.println(desarrolladora.toJson());
            }
            System.out.println(Arrays.toString(desarrolladoras.toArray()));
        
    }
    
}
}
