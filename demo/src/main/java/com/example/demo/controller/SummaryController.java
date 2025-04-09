package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.SummaryResponse;
import com.example.demo.services.SummaryService;

@RestController
@CrossOrigin(origins="http://localhost:5173")
@RequestMapping("/api/summary")
public class SummaryController {

    @Autowired
    private SummaryService summaryService;

    @GetMapping("/{deviceId}")
    public ResponseEntity<SummaryResponse> getSummary(@PathVariable String deviceId) {
        SummaryResponse summary = summaryService.getDeviceSummary(deviceId);
        return ResponseEntity.ok(summary);
    }
}
