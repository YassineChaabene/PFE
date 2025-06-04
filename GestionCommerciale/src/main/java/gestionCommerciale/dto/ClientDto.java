package gestionCommerciale.dto;




import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientDto {
	private String uuid;
	private Integer id;
	private Integer code;
	private String intitule;
	private String telephone;
	private String email;
	private String adresse;
	private String gouvernorat;
	
	
}