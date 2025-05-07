package com.news2option.controller;

import com.news2option.model.News;
import com.news2option.repository.NewsRepository;
import com.news2option.service.NewsCollectorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/news")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NewsController {

    private final NewsRepository newsRepository;
    private final NewsCollectorService newsCollectorService;

    /**
     * Get all news articles
     */
    @GetMapping
    public ResponseEntity<List<News>> getAllNews() {
        return ResponseEntity.ok(newsRepository.findAll());
    }

    /**
     * Get recent news articles
     */
    @GetMapping("/recent")
    public ResponseEntity<List<News>> getRecentNews() {
        return ResponseEntity.ok(newsRepository.findTop20ByOrderByPublishedAtDesc());
    }

    /**
     * Get news by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<News> getNewsById(@PathVariable Long id) {
        return newsRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Search news by title
     */
    @GetMapping("/search")
    public ResponseEntity<List<News>> searchNews(@RequestParam String query) {
        return ResponseEntity.ok(newsRepository.findByTitleContainingIgnoreCase(query));
    }

    /**
     * Manually trigger news collection
     */
    @PostMapping("/collect")
    public ResponseEntity<List<News>> collectNews() {
        List<News> collectedNews = newsCollectorService.collectNews();
        return ResponseEntity.ok(collectedNews);
    }
}
