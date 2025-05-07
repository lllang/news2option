package com.news2option.repository;

import com.news2option.model.DailyInvestmentRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface DailyInvestmentRecommendationRepository extends JpaRepository<DailyInvestmentRecommendation, Long> {
    Optional<DailyInvestmentRecommendation> findByDate(LocalDate date);
    Optional<DailyInvestmentRecommendation> findTopByOrderByDateDesc();
}
