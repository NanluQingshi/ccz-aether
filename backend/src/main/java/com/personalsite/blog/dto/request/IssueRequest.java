package com.personalsite.blog.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class IssueRequest {
    @NotBlank
    private String title;
    private String description;
    @NotNull
    @Min(value = 0, message = "优先级最小为 0（低）")
    @Max(value = 2, message = "优先级最大为 2（高）")
    private Integer priority;
}
