package com.educonnect.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class BookDTO {
    private Long id;
    private String title;
    private String grade;
    private String subject;
    private String author;
    private String isbn;
    private BigDecimal price;
    private Long publisherId;
    private String publisherName;
    private String description;
    private String coverImage;
    private LocalDateTime createdAt;
}





