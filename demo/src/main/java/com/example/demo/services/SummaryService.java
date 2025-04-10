package com.example.demo.services;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.example.demo.model.SummaryResponse;

@Service
public class SummaryService {

    @Autowired
    private MongoTemplate mongoTemplate;

    private static final double COST_PER_UNIT = 8.25;
    private static final double GHG_FACTOR = 0.00058;

    public SummaryResponse getDeviceSummary(String deviceId) {
        SummaryResponse response = new SummaryResponse();

        // Define time windows
        Instant now = Instant.now();
        ZoneId zoneId = ZoneId.of("Asia/Kolkata");
        ZonedDateTime todayStart = now.atZone(zoneId).toLocalDate().atStartOfDay(zoneId);
        ZonedDateTime monthStart = now.atZone(zoneId).withDayOfMonth(1).toLocalDate().atStartOfDay(zoneId);
        ZonedDateTime yearStart = now.atZone(zoneId).withDayOfYear(1).toLocalDate().atStartOfDay(zoneId);

        // Today
        double energyToday = getDeltaEnergy(deviceId, Date.from(todayStart.toInstant()), Date.from(now));
        response.setEnergyToday(energyToday);
        response.setPriceToday(energyToday * COST_PER_UNIT);
        response.setGhgToday(energyToday * GHG_FACTOR);

        // This Month
        double energyMonth = getDeltaEnergy(deviceId, Date.from(monthStart.toInstant()), Date.from(now));
        response.setEnergyThisMonth(energyMonth);
        response.setPriceThisMonth(energyMonth * COST_PER_UNIT);
        response.setGhgThisMonth(energyMonth * GHG_FACTOR);

        // This Year
        double energyYear = getDeltaEnergy(deviceId, Date.from(yearStart.toInstant()), Date.from(now));
        response.setEnergyThisYear(energyYear);
        response.setPriceThisYear(energyYear * COST_PER_UNIT);
        response.setGhgThisYear(energyYear * GHG_FACTOR);

        return response;
    }

    private double getDeltaEnergy(String deviceId, Date from, Date to) {
        Query query = new Query();
        query.addCriteria(Criteria.where("ts").gte(from).lte(to));
        query.with(Sort.by(Sort.Direction.ASC, "ts"));
        query.fields().include("ts").include("params");

        List<Document> docs = mongoTemplate.find(query, Document.class, "mqtt_messages");
        if (docs.isEmpty()) return 0.0;

        Double first = null;
        Double last = null;

        // Find the first non-null energy value
        for (Document doc : docs) {
            first = extractEnergy(doc, deviceId);
            if (first != null) break;
        }

        // Find the last non-null energy value (traverse from end)
        for (int i = docs.size() - 1; i >= 0; i--) {
            last = extractEnergy(docs.get(i), deviceId);
            if (last != null) break;
        }

        return (first != null && last != null) ? last - first : 0.0;
    }


    private Double extractEnergy(Document doc, String deviceId) {
        Document params = (Document) doc.get("params");
        
        // Find the correct key that matches deviceId and energy
        String matchedKey = params.keySet().stream()
            .filter(key -> key.contains("/" + deviceId + "/") && key.contains("energy_consumption"))
            .findFirst()
            .orElse(null);

        if (matchedKey == null) return null;

        Object value = params.get(matchedKey);
        return value instanceof Number ? ((Number) value).doubleValue() : null;
    }

}
