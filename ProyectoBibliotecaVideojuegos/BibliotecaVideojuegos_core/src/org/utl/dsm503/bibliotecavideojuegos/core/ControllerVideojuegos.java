/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.dsm503.bibliotecavideojuegos.core;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

/**
 *
 * @author Lenovo
 */
public class ControllerVideojuegos {

    public void insertarVideojuego(String datosVideojuego) {
        MongoClient mongoClient = MongoClients.create("mongodb://localhost:27017");
        MongoDatabase database = mongoClient.getDatabase("biblioteca_videojuegos");
        MongoCollection<Document> collection = database.getCollection("videojuegos");
        Document videojuego = Document.parse(datosVideojuego);
        collection.insertOne(videojuego);
        mongoClient.close();
    }

    public void cargarVideojuegos() {
        MongoClient mongoClient = MongoClients.create("mongodb://localhost:27017");
        MongoDatabase database = mongoClient.getDatabase("biblioteca_videojuegos");
        MongoCollection<Document> collection = database.getCollection("videojuegos");
        MongoCursor<Document> cursor = collection.find().iterator();
        while (cursor.hasNext()) {
            Document doc = cursor.next();
            System.out.println(doc.toJson());
        }
        mongoClient.close();
    }

    public void actualizarVideojuego(int idVideojuego, String datosVideojuego) {
        try (MongoClient mongoClient = MongoClients.create("mongodb://localhost:27017")) {
            MongoDatabase database = mongoClient.getDatabase("biblioteca_videojuegos");
            MongoCollection<Document> collection = database.getCollection("videojuegos");
            Document filter = new Document("idVideojuego", idVideojuego);
            Document update = new Document("$set", Document.parse(datosVideojuego));
            collection.updateOne(filter, update);
        }
    }

}
