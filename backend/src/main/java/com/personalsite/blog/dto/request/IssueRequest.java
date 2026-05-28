package com.personalsite.blog.dto.request;

import com.personalsite.blog.enums.IssuePriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class IssueRequest {
    @NotBlank
    private String title;
    private String description;
    @NotNull
    private IssuePriority priority;
}
