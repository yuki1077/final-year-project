package com.educonnect.controllers;

import com.educonnect.dto.ApiResponse;
import com.educonnect.dto.BookDTO;
import com.educonnect.dto.CreateBookRequest;
import com.educonnect.models.User;
import com.educonnect.services.BookService;
import com.educonnect.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {
    
    private final BookService bookService;
    private final UserService userService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<BookDTO>>> getAllBooks() {
        List<BookDTO> books = bookService.getAllBooks();
        return ResponseEntity.ok(ApiResponse.success(books));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookDTO>> getBookById(@PathVariable Long id) {
        try {
            BookDTO book = bookService.getBookById(id);
            return ResponseEntity.ok(ApiResponse.success(book));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Book not found"));
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<BookDTO>>> searchBooks(@RequestParam String keyword) {
        List<BookDTO> books = bookService.searchBooks(keyword);
        return ResponseEntity.ok(ApiResponse.success(books));
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('PUBLISHER', 'ADMIN')")
    public ResponseEntity<ApiResponse<BookDTO>> createBook(
            @Valid @RequestBody CreateBookRequest request,
            Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            BookDTO book = bookService.createBook(request, user);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Book created successfully", book));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('PUBLISHER', 'ADMIN')")
    public ResponseEntity<ApiResponse<BookDTO>> updateBook(
            @PathVariable Long id,
            @Valid @RequestBody CreateBookRequest request,
            Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName());
            BookDTO book = bookService.updateBook(id, request, user);
            return ResponseEntity.ok(ApiResponse.success("Book updated successfully", book));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteBook(@PathVariable Long id) {
        try {
            bookService.deleteBook(id);
            return ResponseEntity.ok(ApiResponse.success("Book deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Book not found"));
        }
    }
    
    @GetMapping("/publisher/{publisherId}")
    @PreAuthorize("hasAnyRole('PUBLISHER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<BookDTO>>> getPublisherBooks(@PathVariable Long publisherId) {
        List<BookDTO> books = bookService.getBooksByPublisher(publisherId);
        return ResponseEntity.ok(ApiResponse.success(books));
    }
}





