package com.educonnect.services;

import com.educonnect.dto.RegisterRequest;
import com.educonnect.dto.UserDTO;
import com.educonnect.exceptions.ResourceNotFoundException;
import com.educonnect.models.User;
import com.educonnect.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Transactional
    public UserDTO createUser(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setOrganizationName(request.getOrganizationName());
        user.setPhone(request.getPhone());
        user.setDocumentUrl(request.getDocumentUrl());
        
        // Auto-approve schools, others are pending
        if (request.getRole() == User.UserRole.SCHOOL) {
            user.setStatus(User.UserStatus.APPROVED);
        } else {
            user.setStatus(User.UserStatus.PENDING);
        }
        
        User savedUser = userRepository.save(user);
        return mapToDTO(savedUser);
    }
    
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToDTO(user);
    }
    
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public List<UserDTO> getPublishers() {
        return userRepository.findByRole(User.UserRole.PUBLISHER).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public List<UserDTO> getApprovedPublishers() {
        return userRepository.findByRoleAndStatus(User.UserRole.PUBLISHER, User.UserStatus.APPROVED)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public UserDTO updateUserStatus(Long id, User.UserStatus status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setStatus(status);
        User updatedUser = userRepository.save(user);
        return mapToDTO(updatedUser);
    }
    
    @Transactional
    public UserDTO updateProfileImage(Long id, String imageUrl) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setProfileImage(imageUrl);
        User updatedUser = userRepository.save(user);
        return mapToDTO(updatedUser);
    }
    
    private UserDTO mapToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setOrganizationName(user.getOrganizationName());
        dto.setPhone(user.getPhone());
        dto.setDocumentUrl(user.getDocumentUrl());
        dto.setProfileImage(user.getProfileImage());
        dto.setStatus(user.getStatus());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}





