package com.news2option.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendedInvestment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String industryName;
    
    private String companyName;
    
    private String stockSymbol;
    
    @Enumerated(EnumType.STRING)
    private RecommendationType recommendationType;
    
    private Integer confidenceScore;
    
    @Column(length = 1000)
    private String rationale;
    
    @ManyToOne
    private DailyInvestmentRecommendation recommendation;
    
    public enum RecommendationType {
        BUY, SELL, HOLD
    }
}
