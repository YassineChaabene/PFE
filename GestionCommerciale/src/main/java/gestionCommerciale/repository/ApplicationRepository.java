package gestionCommerciale.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import gestionCommerciale.entity.Application;

@Repository
public interface ApplicationRepository extends JpaRepository<Application , Long> {
	Optional<Application> findByUuid(String uuid);
	
	@Query("SELECT a.intitule FROM Application a ORDER BY a.intitule")
	  List<String> findAllIntitules();

	

}
