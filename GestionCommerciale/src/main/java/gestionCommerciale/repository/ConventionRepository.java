package gestionCommerciale.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import gestionCommerciale.entity.Convention;

public interface ConventionRepository extends JpaRepository<Convention, Long> {
    
    Optional<Convention> findByUuid(String uuid);
    long countByStatus(String status);
    List<Convention> findByApplication_Id(Long applicationId);
    List<Convention> findByClient_Id(Integer clientId);
    Optional<Convention> findByCode(String code);

    
    @Query("""
    	    SELECT MONTH(c.startDate), COUNT(c)
    	      FROM Convention c
    	     WHERE YEAR(c.startDate) = :year
    	  GROUP BY MONTH(c.startDate)
    	  ORDER BY MONTH(c.startDate)
    	  """)
    List<Object[]> countByMonthRaw(@Param("year") int year);
    
    @Query("""
    	    SELECT YEAR(c.startDate), COUNT(c)
    	    FROM Convention c
    	    GROUP BY YEAR(c.startDate)
    	    ORDER BY YEAR(c.startDate)
    	  """)
    	  List<Object[]> countByYearRaw();
    	  
    	  
    	  @Query("""
    			    SELECT YEAR(c.startDate), COUNT(c)
    			      FROM Convention c
    			     WHERE c.startDate > :today
    			       AND c.startDate <= :threshold
    			  GROUP BY YEAR(c.startDate)
    			  ORDER BY YEAR(c.startDate)
    			  """)
    			  List<Object[]> countUpcomingByYearRaw(
    			    @Param("today") LocalDate today,
    			    @Param("threshold") LocalDate threshold
    			  ); 	
    	  
   @Query("SELECT c FROM Convention c WHERE c.endDate > :now AND c.endDate <= :threshold")
   List<Convention> findExpiringBetween(LocalDate now, LocalDate threshold);
   
   @Query("SELECT c FROM Convention c WHERE c.endDate < :today")
   List<Convention> findExpiredConventions(LocalDate today);

   @Query("SELECT c.code FROM Convention c ORDER BY c.code")
   List<String> findAllCodes();

   @Query("SELECT DISTINCT c.status FROM Convention c ORDER BY c.status")
   List<String> findDistinctStatuses();
 }

 
