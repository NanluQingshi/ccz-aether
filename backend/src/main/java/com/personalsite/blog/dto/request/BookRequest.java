package com.personalsite.blog.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BookRequest {
    @NotBlank
    private String title;
    @NotBlank
    private String author;
    private String cover;
    private String status = "want";
    private Integer rating;
    private String review;
    private String category;
    private Integer totalPages;
    private Integer readPages;
    private LocalDate startedAt;
    private LocalDate finishedAt;
}
