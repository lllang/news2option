package com.news2option.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewsAnalysis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    private News news;
    
    @Column(length = 5000)
    private String analysisContent;
    
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "newsAnalysis")
    private List<IndustryImpact> industryImpacts;
    
    private LocalDateTime analyzedAt;
}
