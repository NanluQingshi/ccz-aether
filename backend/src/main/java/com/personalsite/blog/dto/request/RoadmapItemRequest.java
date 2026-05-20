package com.personalsite.blog.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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
    @Pattern(regexp = "done|planned", message = "状态只能是 done 或 planned")
    private String status;
    @Pattern(regexp = "high|medium|low", message = "优先级只能是 high、medium 或 low")
    private String priority;
    private Integer sortOrder;
}
