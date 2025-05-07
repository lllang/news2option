package com.news2option.repository;

import com.news2option.model.NewsAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NewsAnalysisRepository extends JpaRepository<NewsAnalysis, Long> {
    List<NewsAnalysis> findByAnalyzedAtAfter(LocalDateTime date);
    List<NewsAnalysis> findTop20ByOrderByAnalyzedAtDesc();
}
