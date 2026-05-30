package com.personalsite.blog.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SiteRequest {
    @NotBlank
    private String name;
    @NotBlank
    private String url;
    @NotBlank
    private String category;
    private Integer sortOrder;
}
