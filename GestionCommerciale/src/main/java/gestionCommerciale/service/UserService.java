package gestionCommerciale.service;

import gestionCommerciale.convert.UserConvert;
import org.springframework.security.crypto.password.PasswordEncoder;
import gestionCommerciale.dto.UserDto;
import gestionCommerciale.entity.User;
import gestionCommerciale.repository.UserRepo;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final PasswordEncoder passwordEncoder;

    private final UserRepo userRepository;

    public UserService(UserRepo userRepository,PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
  
    public User getUser(Integer id) {
        return userRepository.findById(id).orElse(null);
    }
    public UserDto getUserByUuid(String uuid) {
        logger.info("Fetching user with UUID: {}", uuid);
        return userRepository.findByUuid(uuid)
                .map(UserConvert::toDto)
                .orElseThrow(() -> {
                    logger.warn("User not found with UUID: {}", uuid);
                    return new RuntimeException("User not found with UUID: " + uuid);
                });
    }

    
    public List<User> getAllUsers() {
    	logger.info("Fetching all users");
    	List<User> users =userRepository.findAll();
    	logger.info("Total users found: {}", users.size());
        return users;	
    }
    
    public UserDto saveUser(UserDto userDto) {
    	logger.info("Saving new user: {}", userDto); 
    	User user = UserConvert.toEntity(userDto);
    	user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        return UserConvert.toDto(savedUser);  
    }

    public void deleteUser(String uuid) {
        logger.warn("Deleting user with UUID: {}", uuid);

        userRepository.findByUuid(uuid).ifPresentOrElse(user -> {
            userRepository.deleteById(user.getId());
            logger.info("User with UUID {} deleted successfully", uuid);
        }, () -> {
            logger.error("User not found with UUID: {}", uuid);
            throw new RuntimeException("User not found with UUID: " + uuid);
        });
    }

    
    public UserDto updateUser(UserDto userDto) {
        logger.info("Updating user: {}", userDto);
        Optional<User> userOpt = userRepository.findByUuid(userDto.getUuid());

        if (userOpt.isPresent()) {
            User existingUser = userOpt.get();
            User updatedUser = UserConvert.toEntity(userDto);
            
            updatedUser.setId(existingUser.getId());
            updatedUser.setUuid(existingUser.getUuid());
            
            User savedUser = userRepository.save(updatedUser);
            logger.info("User updated successfully: {}", savedUser);
            return UserConvert.toDto(savedUser);
        } else {
            logger.error("User not found with ID: {}", userDto.getId());
            throw new RuntimeException("User not found with Id: " + userDto.getId());
        }
    }
}