package com.educonnect.controllers;

import com.educonnect.dto.ApiResponse;
import com.educonnect.dto.UserDTO;
import com.educonnect.models.User;
import com.educonnect.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserDTO>> getUserById(@PathVariable Long id) {
        try {
            UserDTO user = userService.getUserById(id);
            return ResponseEntity.ok(ApiResponse.success(user));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("User not found"));
        }
    }
    
    @GetMapping("/publishers")
    @PreAuthorize("hasAnyRole('ADMIN', 'SCHOOL')")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getPublishers() {
        List<UserDTO> publishers = userService.getApprovedPublishers();
        return ResponseEntity.ok(ApiResponse.success(publishers));
    }
    
    @GetMapping("/publishers/public")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getPublishersPublic() {
        List<UserDTO> publishers = userService.getApprovedPublishers();
        return ResponseEntity.ok(ApiResponse.success(publishers));
    }
    
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserDTO>> updateUserStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            String statusStr = request.get("status");
            User.UserStatus status = User.UserStatus.valueOf(statusStr.toUpperCase());
            UserDTO user = userService.updateUserStatus(id, status);
            return ResponseEntity.ok(ApiResponse.success("User status updated successfully", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/{id}/profile-image")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserDTO>> updateProfileImage(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            String imageUrl = request.get("imageUrl");
            UserDTO user = userService.updateProfileImage(id, imageUrl);
            return ResponseEntity.ok(ApiResponse.success("Profile image updated successfully", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}





