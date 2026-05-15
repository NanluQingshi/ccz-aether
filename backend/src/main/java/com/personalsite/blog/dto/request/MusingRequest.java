package com.personalsite.blog.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MusingRequest {
    @NotBlank
    private String content;
    private String type = "idea";
}
