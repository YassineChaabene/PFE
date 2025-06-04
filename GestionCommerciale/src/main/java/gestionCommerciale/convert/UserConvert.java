package gestionCommerciale.convert;

import gestionCommerciale.dto.ClientDto;
import gestionCommerciale.dto.UserDto;
import gestionCommerciale.entity.Client;
import gestionCommerciale.entity.User;

public class UserConvert {
	
	//Convert User entity to UserDto
	public static UserDto toDto(User entity) {
		if (entity == null) {
            return null;
        }
		return UserDto.builder()
				.name(entity.getName())
                .id(entity.getId())
                .uuid(entity.getUuid())
                .email(entity.getEmail())
                .password(entity.getPassword())
                .role(entity.getRole())
                .build();
	}
	
	
	//Convert UserDto to entity
	 public static User toEntity(UserDto userDto) {
		 if (userDto == null) {
			 return null;
	     }
	     return User.builder()
	    		 .name(userDto.getName())
	    		 .id(userDto.getId())
	             .uuid(userDto.getUuid())
	             .email(userDto.getEmail())
	             .password(userDto.getPassword())
	             .role(userDto.getRole())
	             .build();
	    }

}
