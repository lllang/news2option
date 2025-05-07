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
public class CompanyImpact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String companyName;
    
    private String stockSymbol;
    
    @Enumerated(EnumType.STRING)
    private IndustryImpact.ImpactType impactType;
    
    private Integer impactScore;
    
    @ManyToOne
    private IndustryImpact industryImpact;
}
