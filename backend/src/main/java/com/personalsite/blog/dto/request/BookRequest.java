package com.personalsite.blog.dto.request;

import com.personalsite.blog.enums.BookStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
    private BookStatus status = BookStatus.WANT;
    @Min(value = 1, message = "评分最低为 1")
    @Max(value = 5, message = "评分最高为 5")
    private Integer rating;
    private String review;
    private String category;
    private Integer totalPages;
    private Integer readPages;
    private LocalDate startedAt;
    private LocalDate finishedAt;
}
