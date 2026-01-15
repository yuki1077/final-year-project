package com.educonnect.repositories;

import com.educonnect.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<User> findByRole(User.UserRole role);
    
    List<User> findByRoleAndStatus(User.UserRole role, User.UserStatus status);
    
    List<User> findByStatus(User.UserStatus status);
    
    long countByRole(User.UserRole role);
}





