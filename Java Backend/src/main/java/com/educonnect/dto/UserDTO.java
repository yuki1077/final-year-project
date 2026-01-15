package com.educonnect.dto;

import com.educonnect.models.User;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private User.UserRole role;
    private String organizationName;
    private String phone;
    private String documentUrl;
    private String profileImage;
    private User.UserStatus status;
    private LocalDateTime createdAt;
}





