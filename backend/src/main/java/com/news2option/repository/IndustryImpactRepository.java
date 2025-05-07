package com.news2option.repository;

import com.news2option.model.IndustryImpact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IndustryImpactRepository extends JpaRepository<IndustryImpact, Long> {
    List<IndustryImpact> findByIndustryNameContainingIgnoreCase(String industryName);
    List<IndustryImpact> findByImpactType(IndustryImpact.ImpactType impactType);
}
