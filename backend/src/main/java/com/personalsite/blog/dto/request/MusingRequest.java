package com.personalsite.blog.dto.request;

import com.personalsite.blog.enums.MusingType;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MusingRequest {
    @NotBlank
    private String content;
    private MusingType type = MusingType.IDEA;
}
