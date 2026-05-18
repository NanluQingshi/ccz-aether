package com.personalsite.blog.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RoadmapItemRequest {
    @NotBlank
    private String groupLabel;
    private String groupIcon;
    @NotBlank
    private String name;
    private String description;
    @NotBlank
    private String status;
    private String priority;
    private Integer sortOrder;
}
