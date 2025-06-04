
package gestionCommerciale.service;

import gestionCommerciale.entity.AuthRequest;
import gestionCommerciale.entity.AuthResponse;
import gestionCommerciale.entity.User;
import gestionCommerciale.repository.UserRepo;
import gestionCommerciale.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired private AuthenticationManager authManager;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private UserDetailsService userDetailsService;
    @Autowired private UserRepo userRepo;

    public AuthResponse login(AuthRequest request) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(
                request.getEmail(), request.getPassword()));

        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String jwt = jwtUtil.generateToken(userDetails, user.getName() ,user.getEmail());

        return new AuthResponse(
                jwt,
                user.getUuid(),
                user.getEmail(),
                user.getRole().name(),
                user.getName()
        );
    }
}
