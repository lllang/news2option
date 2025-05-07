package com.news2option.controller;

import com.news2option.model.NewsAnalysis;
import com.news2option.repository.NewsAnalysisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/analysis")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AnalysisController {

    private final NewsAnalysisRepository newsAnalysisRepository;

    /**
     * Get all news analyses
     */
    @GetMapping
    public ResponseEntity<List<NewsAnalysis>> getAllAnalyses() {
        return ResponseEntity.ok(newsAnalysisRepository.findAll());
    }

    /**
     * Get recent news analyses
     */
    @GetMapping("/recent")
    public ResponseEntity<List<NewsAnalysis>> getRecentAnalyses() {
        return ResponseEntity.ok(newsAnalysisRepository.findTop20ByOrderByAnalyzedAtDesc());
    }

    /**
     * Get analysis by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<NewsAnalysis> getAnalysisById(@PathVariable Long id) {
        return newsAnalysisRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
