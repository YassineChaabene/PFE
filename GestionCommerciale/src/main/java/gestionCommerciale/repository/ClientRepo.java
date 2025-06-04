package gestionCommerciale.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import gestionCommerciale.entity.Client;



@Repository
public interface ClientRepo extends JpaRepository<Client , Integer> {
	Optional<Client> findByUuid(String uuid);
	boolean existsByCode(Integer code);
	
	 @Query("SELECT c.gouvernorat, COUNT(c) FROM Client c GROUP BY c.gouvernorat ORDER BY COUNT(c) DESC")
	  List<Object[]> countByGouvernoratRaw();
	
	  @Query("SELECT c.intitule FROM Client c ORDER BY c.intitule")
	  List<String> findAllIntitules();

}
