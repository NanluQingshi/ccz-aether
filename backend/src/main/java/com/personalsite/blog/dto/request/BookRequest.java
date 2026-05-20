package com.personalsite.blog.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BookRequest {
    @NotBlank
    private String title;
    @NotBlank
    private String author;
    private String cover;
    @Pattern(regexp = "want|reading|done", message = "状态只能是 want、reading 或 done")
    private String status = "want";
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
