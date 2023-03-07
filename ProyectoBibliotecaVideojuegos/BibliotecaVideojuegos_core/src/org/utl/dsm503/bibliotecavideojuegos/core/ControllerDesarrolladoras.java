/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.dsm503.bibliotecavideojuegos.core;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

/**
 *
 * @author Lenovo
 */
public class ControllerDesarrolladoras {
    public void insertarDesarrolladora(String datosDesarrolladora) {
        MongoClient mongoClient = MongoClients.create("mongodb://localhost:27017");
        MongoDatabase database = mongoClient.getDatabase("biblioteca_videojuegos");
        MongoCollection<Document> collection = database.getCollection("desarrolladoras");
        Document desarrolladora = Document.parse(datosDesarrolladora);
        collection.insertOne(desarrolladora);
        mongoClient.close();
    }

    public void cargarDesarrolladoras() {
        try (MongoClient mongoClient = MongoClients.create("mongodb://localhost:27017")) {
            MongoDatabase database = mongoClient.getDatabase("biblioteca_videojuegos");
            MongoCollection<Document> collection = database.getCollection("desarrolladoras");
            MongoCursor<Document> cursor = collection.find().iterator();
            while (cursor.hasNext()) {
                Document doc = cursor.next();
                System.out.println(doc);
            }
        }
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
