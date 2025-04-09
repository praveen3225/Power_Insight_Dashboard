package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final MqttWebSocketHandler mqttWebSocketHandler;

    public WebSocketConfig(MqttWebSocketHandler mqttWebSocketHandler) {
        this.mqttWebSocketHandler = mqttWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(mqttWebSocketHandler, "/ws/mqtt")
                .setAllowedOrigins("*"); // allow all clients
    }
}
