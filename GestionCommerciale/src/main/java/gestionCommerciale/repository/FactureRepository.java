package gestionCommerciale.repository;

import gestionCommerciale.dto.YearlyRevenueProjection;
import gestionCommerciale.entity.Facture;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.awt.print.Pageable;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface FactureRepository extends JpaRepository<Facture, Long> {
    Optional<Facture> findByUuid(String uuid);
    
    @Query("SELECT COALESCE(SUM(f.montant), 0) FROM Facture f WHERE f.status = 'PAYEE'")
    long sumAllMontants();
    
    @Query("SELECT f.status, COUNT(f) FROM Facture f GROUP BY f.status")
    List<Object[]> countByStatusRaw();
    

    // 2. Monthly revenue over the last N months
    @Query(
    	    value = ""
    	      + "SELECT to_char(date_emission, 'YYYY-MM') AS month, SUM(montant) "
    	      + "FROM factures "
    	      + "WHERE date_emission >= :start "
    	      + "GROUP BY 1 "
    	      + "ORDER BY 1",
    	    nativeQuery = true
    	  )
    	  List<Object[]> sumMonthlyRevenue(@Param("start") LocalDate start);
    
    List<Facture> findAllByOrderByDateEmissionDesc(PageRequest pageRequest);
    
    @Query(
    	      value = 
    	        "SELECT EXTRACT(YEAR FROM date_emission)::int AS year, " +
    	        "       SUM(montant)         AS total " +
    	        "  FROM factures " +
    	        " GROUP BY EXTRACT(YEAR FROM date_emission) " +
    	        " ORDER BY year",
    	      nativeQuery = true
    	    )
    	    List<YearlyRevenueProjection> findAnnualRevenues();
    @Query("""
    		  SELECT FUNCTION('to_char', f.dateEmission, 'YYYY-MM') AS month,
    		         SUM(f.montant)
    		    FROM Facture f
    		   GROUP BY FUNCTION('to_char', f.dateEmission, 'YYYY-MM')
    		   ORDER BY month
    		""")
    		List<Object[]> sumMonthlyRevenueAll();
}

