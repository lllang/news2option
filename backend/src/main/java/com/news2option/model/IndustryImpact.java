package com.news2option.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IndustryImpact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String industryName;
    
    @Enumerated(EnumType.STRING)
    private ImpactType impactType;
    
    private Integer impactScore;
    
    @ManyToOne
    private NewsAnalysis newsAnalysis;
    
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "industryImpact")
    private List<CompanyImpact> companyImpacts;
    
    public enum ImpactType {
        POSITIVE, NEGATIVE, NEUTRAL
    }
}
