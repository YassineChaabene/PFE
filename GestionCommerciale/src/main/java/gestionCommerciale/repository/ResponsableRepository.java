package gestionCommerciale.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import gestionCommerciale.entity.Responsable;


@Repository
public interface ResponsableRepository extends JpaRepository<Responsable, Long> {
	 @Query("SELECT r.nom FROM Responsable r")
	 List<String> findAllNames();
}
