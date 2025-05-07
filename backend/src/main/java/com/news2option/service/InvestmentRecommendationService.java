package com.news2option.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.news2option.model.*;
import com.news2option.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class InvestmentRecommendationService {

    private final NewsAnalysisRepository newsAnalysisRepository;
    private final DailyInvestmentRecommendationRepository recommendationRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    /**
     * Generate daily investment recommendations at 5 PM every day
     */
    @Scheduled(cron = "0 0 17 * * ?")
    public void generateDailyRecommendations() {
        try {
            log.info("Generating daily investment recommendations");
            
            LocalDate today = LocalDate.now();
            
            if (recommendationRepository.findByDate(today).isPresent()) {
                log.info("Recommendations for today already exist");
                return;
            }
            
            LocalDateTime yesterday = LocalDateTime.now().minusDays(1);
            List<NewsAnalysis> recentAnalyses = newsAnalysisRepository.findByAnalyzedAtAfter(yesterday);
            
            if (recentAnalyses.isEmpty()) {
                log.info("No recent news analyses found");
                return;
            }
            
            String recommendations = generateRecommendations(recentAnalyses);
            
            saveRecommendations(today, recommendations);
        } catch (Exception e) {
            log.error("Error generating daily recommendations: {}", e.getMessage(), e);
        }
    }

    /**
     * Get the latest investment recommendations
     */
    public DailyInvestmentRecommendation getLatestRecommendations() {
        return recommendationRepository.findTopByOrderByDateDesc()
                .orElseThrow(() -> new RuntimeException("No recommendations found"));
    }

    /**
     * Generate investment recommendations using Gemini
     */
    private String generateRecommendations(List<NewsAnalysis> analyses) throws Exception {
        String prompt = buildRecommendationPrompt(analyses);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> contents = new HashMap<>();
        Map<String, Object> parts = new HashMap<>();
        
        parts.put("text", prompt);
        contents.put("parts", List.of(parts));
        requestBody.put("contents", List.of(contents));
        
        String url = geminiApiUrl + "?key=" + geminiApiKey;
        
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
        String response = restTemplate.postForObject(url, request, String.class);
        
        JsonNode responseJson = objectMapper.readTree(response);
        return responseJson.path("candidates").path(0).path("content").path("parts").path(0).path("text").asText();
    }

    /**
     * Build prompt for Gemini API
     */
    private String buildRecommendationPrompt(List<NewsAnalysis> analyses) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Based on the following news analyses, provide investment recommendations:\n\n");
        
        for (NewsAnalysis analysis : analyses) {
            prompt.append("News Title: ").append(analysis.getNews().getTitle()).append("\n");
            prompt.append("Analysis: ").append(analysis.getAnalysisContent()).append("\n");
            
            prompt.append("Industry Impacts:\n");
            for (IndustryImpact impact : analysis.getIndustryImpacts()) {
                prompt.append("- ").append(impact.getIndustryName())
                      .append(" (").append(impact.getImpactType())
                      .append(", Score: ").append(impact.getImpactScore())
                      .append(")\n");
                
                prompt.append("  Companies:\n");
                for (CompanyImpact company : impact.getCompanyImpacts()) {
                    prompt.append("  - ").append(company.getCompanyName())
                          .append(" (").append(company.getStockSymbol())
                          .append(", ").append(company.getImpactType())
                          .append(", Score: ").append(company.getImpactScore())
                          .append(")\n");
                }
            }
            prompt.append("\n");
        }
        
        prompt.append("Please provide a comprehensive investment recommendation in JSON format:\n");
        prompt.append("{\n");
        prompt.append("  \"summary\": \"Overall market summary and investment outlook\",\n");
        prompt.append("  \"overallSentiment\": \"BULLISH/BEARISH/NEUTRAL\",\n");
        prompt.append("  \"recommendedInvestments\": [\n");
        prompt.append("    {\n");
        prompt.append("      \"industryName\": \"Industry name\",\n");
        prompt.append("      \"companyName\": \"Company name\",\n");
        prompt.append("      \"stockSymbol\": \"Stock symbol\",\n");
        prompt.append("      \"recommendationType\": \"BUY/SELL/HOLD\",\n");
        prompt.append("      \"confidenceScore\": 1-10,\n");
        prompt.append("      \"rationale\": \"Explanation for this recommendation\"\n");
        prompt.append("    }\n");
        prompt.append("  ]\n");
        prompt.append("}\n");
        
        return prompt.toString();
    }

    /**
     * Save recommendations to database
     */
    private void saveRecommendations(LocalDate date, String recommendationsJson) throws Exception {
        JsonNode root = objectMapper.readTree(recommendationsJson);
        
        DailyInvestmentRecommendation recommendation = DailyInvestmentRecommendation.builder()
                .date(date)
                .summary(root.path("summary").asText())
                .overallSentiment(DailyInvestmentRecommendation.InvestmentSentiment.valueOf(root.path("overallSentiment").asText()))
                .recommendedInvestments(new ArrayList<>())
                .build();
        
        DailyInvestmentRecommendation savedRecommendation = recommendationRepository.save(recommendation);
        
        JsonNode investmentsNode = root.path("recommendedInvestments");
        for (JsonNode investmentNode : investmentsNode) {
            RecommendedInvestment investment = RecommendedInvestment.builder()
                    .industryName(investmentNode.path("industryName").asText())
                    .companyName(investmentNode.path("companyName").asText())
                    .stockSymbol(investmentNode.path("stockSymbol").asText())
                    .recommendationType(RecommendedInvestment.RecommendationType.valueOf(investmentNode.path("recommendationType").asText()))
                    .confidenceScore(investmentNode.path("confidenceScore").asInt())
                    .rationale(investmentNode.path("rationale").asText())
                    .recommendation(savedRecommendation)
                    .build();
            
            savedRecommendation.getRecommendedInvestments().add(investment);
        }
        
        recommendationRepository.save(savedRecommendation);
    }
}
