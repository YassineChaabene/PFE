package gestionCommerciale.repository;


import gestionCommerciale.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUuid(String uuid);



}
