package gestionCommerciale.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data 
@NoArgsConstructor 
@AllArgsConstructor 
public class AuthRequest {
    private String email;
    private String password;
    
}
