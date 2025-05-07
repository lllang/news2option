package com.news2option.service;

import com.news2option.model.News;
import com.news2option.repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NewsCollectorService {

    private final NewsRepository newsRepository;
    private final NewsAnalysisService newsAnalysisService;

    private final List<String> financialNewsSources = List.of(
            "https://finance.yahoo.com",
            "https://www.cnbc.com/finance/",
            "https://www.bloomberg.com/markets",
            "https://www.reuters.com/business/",
            "https://www.ft.com"
    );

    /**
     * Scheduled task to collect news every hour
     */
    @Scheduled(fixedRate = 3600000) // Run every hour
    public void collectNewsScheduled() {
        try {
            List<News> collectedNews = collectNews();
            log.info("Collected {} news articles", collectedNews.size());
            
            collectedNews.forEach(newsAnalysisService::analyzeNews);
        } catch (Exception e) {
            log.error("Error collecting news: {}", e.getMessage(), e);
        }
    }

    /**
     * Collect news from various financial sources
     */
    public List<News> collectNews() {
        List<News> collectedNews = new ArrayList<>();
        
        for (String source : financialNewsSources) {
            try {
                List<News> newsFromSource = scrapeNewsFromSource(source);
                collectedNews.addAll(newsFromSource);
            } catch (Exception e) {
                log.error("Error collecting news from {}: {}", source, e.getMessage(), e);
            }
        }
        
        return collectedNews;
    }

    /**
     * Scrape news from a specific source
     */
    private List<News> scrapeNewsFromSource(String sourceUrl) throws IOException {
        List<News> newsList = new ArrayList<>();
        Document doc = Jsoup.connect(sourceUrl).get();
        
        String sourceName = sourceUrl.replaceAll("https?://(?:www\\.)?([^/]+).*", "$1");
        
        Elements newsElements;
        if (sourceUrl.contains("yahoo")) {
            newsElements = doc.select("h3 a");
        } else if (sourceUrl.contains("cnbc")) {
            newsElements = doc.select("a.Card-title");
        } else if (sourceUrl.contains("bloomberg")) {
            newsElements = doc.select("article h3 a");
        } else if (sourceUrl.contains("reuters")) {
            newsElements = doc.select("a.text-story__title__link");
        } else if (sourceUrl.contains("ft.com")) {
            newsElements = doc.select("a.js-teaser-heading-link");
        } else {
            newsElements = doc.select("article h2 a, article h3 a");
        }
        
        for (Element element : newsElements) {
            try {
                String title = element.text().trim();
                String url = element.absUrl("href");
                
                if (title.isEmpty() || url.isEmpty()) {
                    continue;
                }
                
                if (newsRepository.findByTitleContainingIgnoreCase(title).stream()
                        .anyMatch(n -> n.getUrl().equals(url))) {
                    continue;
                }
                
                Document newsDoc = Jsoup.connect(url).get();
                String content = extractContent(newsDoc, sourceUrl);
                
                News news = News.builder()
                        .title(title)
                        .content(content)
                        .source(sourceName)
                        .url(url)
                        .publishedAt(LocalDateTime.now()) // Ideally extract from page
                        .collectedAt(LocalDateTime.now())
                        .build();
                
                News savedNews = newsRepository.save(news);
                newsList.add(savedNews);
                
                if (newsList.size() >= 5) {
                    break;
                }
            } catch (Exception e) {
                log.error("Error processing news element: {}", e.getMessage(), e);
            }
        }
        
        return newsList;
    }

    /**
     * Extract content from news page based on source
     */
    private String extractContent(Document doc, String sourceUrl) {
        String content;
        
        if (sourceUrl.contains("yahoo")) {
            content = doc.select("div.caas-body p").text();
        } else if (sourceUrl.contains("cnbc")) {
            content = doc.select("div.ArticleBody-articleBody p").text();
        } else if (sourceUrl.contains("bloomberg")) {
            content = doc.select("div.body-content p").text();
        } else if (sourceUrl.contains("reuters")) {
            content = doc.select("div.article-body__content p").text();
        } else if (sourceUrl.contains("ft.com")) {
            content = doc.select("div.article__content p").text();
        } else {
            content = doc.select("article p").text();
        }
        
        if (content.length() > 1990) {
            content = content.substring(0, 1990) + "...";
        }
        
        return content;
    }
}
