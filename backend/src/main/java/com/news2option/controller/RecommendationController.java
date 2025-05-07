package com.news2option.controller;

import com.news2option.model.DailyInvestmentRecommendation;
import com.news2option.repository.DailyInvestmentRecommendationRepository;
import com.news2option.service.InvestmentRecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/recommendations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RecommendationController {

    private final DailyInvestmentRecommendationRepository recommendationRepository;
    private final InvestmentRecommendationService recommendationService;

    /**
     * Get all investment recommendations
     */
    @GetMapping
    public ResponseEntity<List<DailyInvestmentRecommendation>> getAllRecommendations() {
        return ResponseEntity.ok(recommendationRepository.findAll());
    }

    /**
     * Get latest investment recommendation
     */
    @GetMapping("/latest")
    public ResponseEntity<DailyInvestmentRecommendation> getLatestRecommendation() {
        try {
            return ResponseEntity.ok(recommendationService.getLatestRecommendations());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get recommendation by date
     */
    @GetMapping("/date/{date}")
    public ResponseEntity<DailyInvestmentRecommendation> getRecommendationByDate(@PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        return recommendationRepository.findByDate(localDate)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Manually trigger recommendation generation
     */
    @PostMapping("/generate")
    public ResponseEntity<String> generateRecommendations() {
        try {
            recommendationService.generateDailyRecommendations();
            return ResponseEntity.ok("Recommendations generation triggered successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error generating recommendations: " + e.getMessage());
        }
    }
}
