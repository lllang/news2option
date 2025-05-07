package com.news2option.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyInvestmentRecommendation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private LocalDate date;
    
    @Column(length = 5000)
    private String summary;
    
    @Enumerated(EnumType.STRING)
    private InvestmentSentiment overallSentiment;
    
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "recommendation")
    private List<RecommendedInvestment> recommendedInvestments;
    
    public enum InvestmentSentiment {
        BULLISH, BEARISH, NEUTRAL
    }
}
