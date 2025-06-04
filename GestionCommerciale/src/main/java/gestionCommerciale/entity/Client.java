package gestionCommerciale.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name ="clients")
@Builder
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Client {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id")
	private Integer id;
	@Column(name="code" , unique =true)
	private Integer code;
	@Column(name="intitule")
	private String intitule;
	@Column(name="telephone")
	private String telephone;
	@Column(name="email")
	private String email;
	@Column(name="adresse")
	private String adresse;
	@Column(name="gouvernorat")
	private String gouvernorat;
    @Column(unique = true, nullable = false, updatable = false)
    private String uuid;
    
    @PrePersist
    public void generateUUID() {
        if (uuid == null) {
            uuid = java.util.UUID.randomUUID().toString();
        }
    }
    
    
}