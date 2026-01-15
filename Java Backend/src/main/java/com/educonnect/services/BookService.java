package com.educonnect.services;

import com.educonnect.dto.BookDTO;
import com.educonnect.dto.CreateBookRequest;
import com.educonnect.exceptions.ResourceNotFoundException;
import com.educonnect.models.Book;
import com.educonnect.models.User;
import com.educonnect.repositories.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {
    
    private final BookRepository bookRepository;
    
    @Transactional
    public BookDTO createBook(CreateBookRequest request, User publisher) {
        // Check if ISBN already exists
        if (bookRepository.findByIsbn(request.getIsbn()).isPresent()) {
            throw new IllegalArgumentException("Book with this ISBN already exists");
        }
        
        Book book = new Book();
        book.setTitle(request.getTitle());
        book.setGrade(request.getGrade());
        book.setSubject(request.getSubject());
        book.setAuthor(request.getAuthor());
        book.setIsbn(request.getIsbn());
        book.setPrice(request.getPrice());
        book.setPublisherId(publisher.getId());
        book.setPublisherName(publisher.getOrganizationName() != null ? 
                publisher.getOrganizationName() : publisher.getName());
        book.setDescription(request.getDescription());
        book.setCoverImage(request.getCoverImage());
        
        Book savedBook = bookRepository.save(book);
        return mapToDTO(savedBook);
    }
    
    public List<BookDTO> getAllBooks() {
        return bookRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public BookDTO getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));
        return mapToDTO(book);
    }
    
    public List<BookDTO> getBooksByPublisher(Long publisherId) {
        return bookRepository.findByPublisherId(publisherId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public List<BookDTO> searchBooks(String keyword) {
        return bookRepository.searchBooks(keyword).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public BookDTO updateBook(Long id, CreateBookRequest request, User publisher) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));
        
        // Ensure publisher owns this book
        if (!book.getPublisherId().equals(publisher.getId()) && 
            publisher.getRole() != User.UserRole.ADMIN) {
            throw new IllegalArgumentException("Unauthorized to update this book");
        }
        
        book.setTitle(request.getTitle());
        book.setGrade(request.getGrade());
        book.setSubject(request.getSubject());
        book.setAuthor(request.getAuthor());
        book.setPrice(request.getPrice());
        book.setDescription(request.getDescription());
        if (request.getCoverImage() != null) {
            book.setCoverImage(request.getCoverImage());
        }
        
        Book updatedBook = bookRepository.save(book);
        return mapToDTO(updatedBook);
    }
    
    @Transactional
    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new ResourceNotFoundException("Book not found");
        }
        bookRepository.deleteById(id);
    }
    
    private BookDTO mapToDTO(Book book) {
        BookDTO dto = new BookDTO();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setGrade(book.getGrade());
        dto.setSubject(book.getSubject());
        dto.setAuthor(book.getAuthor());
        dto.setIsbn(book.getIsbn());
        dto.setPrice(book.getPrice());
        dto.setPublisherId(book.getPublisherId());
        dto.setPublisherName(book.getPublisherName());
        dto.setDescription(book.getDescription());
        dto.setCoverImage(book.getCoverImage());
        dto.setCreatedAt(book.getCreatedAt());
        return dto;
    }
}





