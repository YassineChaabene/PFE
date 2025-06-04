package gestionCommerciale.controller;
import gestionCommerciale.convert.UserConvert;
import gestionCommerciale.dto.UserDto;
import gestionCommerciale.entity.User;
import gestionCommerciale.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")

public class UserController {
    private final UserService userService;

    public UserController(UserService authService) {
        this.userService = authService;
    }

    
    @GetMapping("/get-all-users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        if (!users.isEmpty()) {
            return ResponseEntity.ok(users);
        } else {
            return ResponseEntity.noContent().build();
        }
    }
    
    
    @GetMapping("/get-user")
    public ResponseEntity<UserDto> getUser(@RequestParam Integer id) {
        User user = userService.getUser(id);
        if (user != null) {
            return ResponseEntity.ok(UserConvert.toDto(user));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/get-user-by-uuid")
    public ResponseEntity<UserDto> getUserByUuid(@RequestParam String uuid) {
        try {
            UserDto userDto = userService.getUserByUuid(uuid);
            return ResponseEntity.ok(userDto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    
    @PostMapping("/save-user")
    public ResponseEntity<UserDto> save(@RequestBody UserDto userDto) {
        UserDto savedUser = userService.saveUser(userDto);
        return ResponseEntity.ok(savedUser);
    }
    
    
    @GetMapping("/delete-user")
    public ResponseEntity<Void> delete(@RequestParam String uuid) {
        userService.deleteUser(uuid);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/update-user")
    public ResponseEntity<UserDto> update(@RequestBody UserDto userDto) {
        UserDto updatedUser = userService.updateUser(userDto);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
  
}
