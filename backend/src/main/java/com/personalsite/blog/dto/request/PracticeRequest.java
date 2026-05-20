package com.personalsite.blog.dto.request;

import com.personalsite.blog.entity.PracticeLink;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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
    @Pattern(regexp = "todo|in_progress|mastered", message = "状态只能是 todo、in_progress 或 mastered")
    private String status;
    private Integer sortOrder;
}
