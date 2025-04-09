package com.example.demo.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.demo.model.MqttMessage;

public interface MqttMessageRepository extends MongoRepository<MqttMessage, String> {
	 
}

