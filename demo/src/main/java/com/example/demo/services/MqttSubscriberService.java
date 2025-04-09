package com.example.demo.services;

import com.example.demo.config.MqttWebSocketHandler;
import com.example.demo.model.MqttMessage;
import com.example.demo.repository.MqttMessageRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.eclipse.paho.client.mqttv3.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TimeZone;
import java.util.stream.Collectors;

@Service
public class MqttSubscriberService {

    private static final String MQTT_BROKER = "tcp://clouddata.jupiterbrothers.com:1883";
    private static final String MQTT_TOPIC = "sample_data";

    private MqttClient client;

    @Autowired
    private MqttMessageRepository repository;
    
    @Autowired
    private MqttWebSocketHandler mqttWebSocketHandler;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostConstruct
    public void init() {
        try {
            client = new MqttClient(MQTT_BROKER, MqttClient.generateClientId());
            client.connect();

            client.subscribe(MQTT_TOPIC, new IMqttMessageListener() {
                @Override
                public void messageArrived(String topic, org.eclipse.paho.client.mqttv3.MqttMessage message) {
                    handleMessage(topic, message);
                }
            });

            System.out.println("✅ Subscribed to topic: " + MQTT_TOPIC);

        } catch (MqttException e) {
            e.printStackTrace();
        }
    }

    private void handleMessage(String topic, org.eclipse.paho.client.mqttv3.MqttMessage message) {
        try {
            String payload = new String(message.getPayload());
            System.out.println("Received message: " + payload);

            // Deserialize JSON
            MqttMessage data = objectMapper.readValue(payload, MqttMessage.class);

            // Manually parse ts string into Date
            String timestampStr = (String) objectMapper.readTree(payload).get("ts").asText();
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            formatter.setTimeZone(TimeZone.getTimeZone("Asia/Kolkata")); // ✅ Parse as IST
            Date timestamp = formatter.parse(timestampStr);
            data.setTs(timestamp);
;

            // Filter out WM entries
            Map<String, Object> filteredParams = data.getParams()
                .entrySet()
                .stream()
                .filter(entry -> !entry.getKey().contains("WM"))
                .collect(Collectors.toMap(
                    Map.Entry::getKey,
                    Map.Entry::getValue,
                    (oldValue, newValue) -> oldValue,
                    LinkedHashMap::new
                ));

            data.setParams(filteredParams);

            // Save to MongoDB
            repository.save(data);

            String json = objectMapper.writeValueAsString(data);
            mqttWebSocketHandler.sendMessage(json);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
