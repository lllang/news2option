package com.news2option.repository;

import com.news2option.model.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    List<News> findByPublishedAtAfter(LocalDateTime date);
    List<News> findByTitleContainingIgnoreCase(String keyword);
    List<News> findTop20ByOrderByPublishedAtDesc();
}
