package com.personalsite.blog.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PracticeRequest {
    @NotBlank
    private String category;
    private String categoryIcon;
    @NotBlank
    private String name;
    private String description;
    private String status;
    private Integer sortOrder;
}
