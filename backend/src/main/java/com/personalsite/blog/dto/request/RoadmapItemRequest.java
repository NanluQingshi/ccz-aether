package com.personalsite.blog.dto.request;

import com.personalsite.blog.enums.RoadmapPriority;
import com.personalsite.blog.enums.RoadmapStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoadmapItemRequest {
    @NotBlank
    private String groupLabel;
    private String groupIcon;
    @NotBlank
    private String name;
    private String description;
    @NotNull
    private RoadmapStatus status;
    private RoadmapPriority priority;
    private Integer sortOrder;
}
