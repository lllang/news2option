package com.news2option.repository;

import com.news2option.model.CompanyImpact;
import com.news2option.model.IndustryImpact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CompanyImpactRepository extends JpaRepository<CompanyImpact, Long> {
    List<CompanyImpact> findByCompanyNameContainingIgnoreCase(String companyName);
    List<CompanyImpact> findByStockSymbol(String stockSymbol);
    List<CompanyImpact> findByImpactType(IndustryImpact.ImpactType impactType);
}
