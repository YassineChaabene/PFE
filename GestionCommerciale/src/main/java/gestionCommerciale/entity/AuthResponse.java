package gestionCommerciale.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private String jwt;
    private String uuid;
    private String email;
    private String role;
    private String name;

}
