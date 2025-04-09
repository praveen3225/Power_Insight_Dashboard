package com.example.demo.controller;

import com.example.demo.model.MqttMessage;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.web.bind.annotation.*;
import com.mongodb.BasicDBObject;
import org.bson.Document;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.BasicQuery;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/history")
public class MqttMessageController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping("/{deviceId}")
    public List<MqttMessage> getLatestMessagesForDevice(@PathVariable String deviceId) {
        String regex = ".*\\/" + deviceId + "\\/.*";

        Document filter = new Document("input", new Document("$objectToArray", "$params"))
                .append("as", "item")
                .append("cond", new Document("$regexMatch", new Document()
                        .append("input", "$$item.k")
                        .append("regex", regex)));

        Document expr = new Document("$gt", List.of(
                new Document("$size", new Document("$filter", filter)),
                0
        ));

        Document queryDoc = new Document("$expr", expr);

        BasicQuery query = new BasicQuery(queryDoc);
        query.with(Sort.by(Sort.Direction.DESC, "ts")).limit(100);

        List<MqttMessage> results = mongoTemplate.find(query, MqttMessage.class, "mqtt_messages");

        // Optional: return oldest to newest
        results.sort((a, b) -> a.getTs().compareTo(b.getTs()));

        return results;
    }


}
