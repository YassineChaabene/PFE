package gestionCommerciale.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationDto {
	
	
	 private String uuid;
	    private Long id;
	    private String intitule;
	    private String description;
	    private LocalDate dateExploitation;
	    private String abreviation;
	    private ResponsableDto responsable;

}
