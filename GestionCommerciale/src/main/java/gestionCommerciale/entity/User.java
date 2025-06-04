package gestionCommerciale.entity;

import gestionCommerciale.common.UserRole;
import jakarta.persistence.*;
import lombok.*;

@Builder
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;
    
    @Column(nullable = true)
    private String name;
    
    @Enumerated(EnumType.STRING)
    private UserRole role;
    
    @Column(unique = true, nullable = false, updatable = false)
    private String uuid; // Publicly exposed unique identifier
    
    @PrePersist
    public void generateUUID() {
        if (uuid == null) {
            uuid = java.util.UUID.randomUUID().toString();
        }
      
    }
    
    
}
