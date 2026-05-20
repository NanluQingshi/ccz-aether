package com.personalsite.blog.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class MusingRequest {
    @NotBlank
    private String content;
    @Pattern(regexp = "idea|todo", message = "类型只能是 idea 或 todo")
    private String type = "idea";
}
