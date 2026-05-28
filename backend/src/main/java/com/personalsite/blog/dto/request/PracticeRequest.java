package com.personalsite.blog.dto.request;

import com.personalsite.blog.entity.PracticeLink;
import com.personalsite.blog.enums.PracticeStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class PracticeRequest {
    @NotBlank
    private String category;
    private String categoryIcon;
    @NotBlank
    private String name;
    private String description;
    private List<PracticeLink> links;
    private PracticeStatus status;
    private Integer sortOrder;
}
