package com.educonnect.services;

import com.educonnect.dto.AuthResponse;
import com.educonnect.dto.LoginRequest;
import com.educonnect.dto.RegisterRequest;
import com.educonnect.dto.UserDTO;
import com.educonnect.models.User;
import com.educonnect.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    
    public AuthResponse register(RegisterRequest request) {
        UserDTO user = userService.createUser(request);
        String token = jwtTokenProvider.generateToken(user.getEmail());
        return new AuthResponse(token, user);
    }
    
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        User user = userService.findByEmail(request.getEmail());
        
        // Check if user is approved
        if (user.getStatus() != User.UserStatus.APPROVED) {
            throw new IllegalStateException("Account is not approved yet");
        }
        
        String token = jwtTokenProvider.generateToken(authentication.getName());
        
        // Map to UserDTO
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());
        userDTO.setRole(user.getRole());
        userDTO.setOrganizationName(user.getOrganizationName());
        userDTO.setStatus(user.getStatus());
        userDTO.setProfileImage(user.getProfileImage());
        
        return new AuthResponse(token, userDTO);
    }
}





