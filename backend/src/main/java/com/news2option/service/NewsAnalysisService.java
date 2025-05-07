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
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class NewsAnalysisService {

    private final NewsAnalysisRepository newsAnalysisRepository;
    private final IndustryImpactRepository industryImpactRepository;
    private final CompanyImpactRepository companyImpactRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    /**
     * Analyze a news article using Gemini API
     */
    public NewsAnalysis analyzeNews(News news) {
        try {
            log.info("Analyzing news: {}", news.getTitle());
            
            String prompt = buildAnalysisPrompt(news);
            
            String analysisJson = callGeminiApi(prompt);
            
            return processAnalysisResponse(news, analysisJson);
        } catch (Exception e) {
            log.error("Error analyzing news: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * Build prompt for Gemini API
     */
    private String buildAnalysisPrompt(News news) {
        return "Analyze the following financial news article and provide a structured JSON response:\n\n" +
                "Title: " + news.getTitle() + "\n\n" +
                "Content: " + news.getContent() + "\n\n" +
                "Please identify:\n" +
                "1. Which industries are affected by this news\n" +
                "2. For each industry, determine if the impact is positive, negative, or neutral\n" +
                "3. Assign an impact score from 1-10 for each industry (10 being highest impact)\n" +
                "4. List specific companies in each industry that would be affected\n" +
                "5. For each company, determine if the impact is positive, negative, or neutral\n" +
                "6. Assign an impact score from 1-10 for each company\n\n" +
                "Respond with a JSON object in the following format:\n" +
                "{\n" +
                "  \"analysis\": \"Your overall analysis of the news article\",\n" +
                "  \"industries\": [\n" +
                "    {\n" +
                "      \"name\": \"Industry name\",\n" +
                "      \"impactType\": \"POSITIVE/NEGATIVE/NEUTRAL\",\n" +
                "      \"impactScore\": 1-10,\n" +
                "      \"companies\": [\n" +
                "        {\n" +
                "          \"name\": \"Company name\",\n" +
                "          \"stockSymbol\": \"Stock symbol if available\",\n" +
                "          \"impactType\": \"POSITIVE/NEGATIVE/NEUTRAL\",\n" +
                "          \"impactScore\": 1-10\n" +
                "        }\n" +
                "      ]\n" +
                "    }\n" +
                "  ]\n" +
                "}";
    }

    /**
     * Call Gemini API
     */
    private String callGeminiApi(String prompt) throws Exception {
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
     * Process the analysis response from Gemini
     */
    private NewsAnalysis processAnalysisResponse(News news, String analysisJson) throws Exception {
        JsonNode root = objectMapper.readTree(analysisJson);
        
        NewsAnalysis newsAnalysis = NewsAnalysis.builder()
                .news(news)
                .analysisContent(root.path("analysis").asText())
                .analyzedAt(LocalDateTime.now())
                .industryImpacts(new ArrayList<>())
                .build();
        
        NewsAnalysis savedAnalysis = newsAnalysisRepository.save(newsAnalysis);
        
        JsonNode industriesNode = root.path("industries");
        for (JsonNode industryNode : industriesNode) {
            IndustryImpact industryImpact = IndustryImpact.builder()
                    .industryName(industryNode.path("name").asText())
                    .impactType(IndustryImpact.ImpactType.valueOf(industryNode.path("impactType").asText()))
                    .impactScore(industryNode.path("impactScore").asInt())
                    .newsAnalysis(savedAnalysis)
                    .companyImpacts(new ArrayList<>())
                    .build();
            
            IndustryImpact savedIndustry = industryImpactRepository.save(industryImpact);
            
            JsonNode companiesNode = industryNode.path("companies");
            for (JsonNode companyNode : companiesNode) {
                CompanyImpact companyImpact = CompanyImpact.builder()
                        .companyName(companyNode.path("name").asText())
                        .stockSymbol(companyNode.path("stockSymbol").asText())
                        .impactType(IndustryImpact.ImpactType.valueOf(companyNode.path("impactType").asText()))
                        .impactScore(companyNode.path("impactScore").asInt())
                        .industryImpact(savedIndustry)
                        .build();
                
                companyImpactRepository.save(companyImpact);
                savedIndustry.getCompanyImpacts().add(companyImpact);
            }
            
            savedAnalysis.getIndustryImpacts().add(savedIndustry);
        }
        
        return newsAnalysisRepository.save(savedAnalysis);
    }
}
