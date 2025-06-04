package gestionCommerciale.dto;

import gestionCommerciale.common.UserRole;
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
public class UserDto {

	private Integer id;
	private String uuid;
	private String email;
	private String name;
	private String password;
	private UserRole role;
	 
	    
}
