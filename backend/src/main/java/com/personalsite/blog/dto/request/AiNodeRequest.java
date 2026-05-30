package com.personalsite.blog.dto.request;

import com.personalsite.blog.entity.AiNodeResource;
import com.personalsite.blog.enums.AiNodeStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class AiNodeRequest {

    @NotBlank
    private String title;

    private String description;

    private String icon;

    private AiNodeStatus status;

    private Long parentId;

    private List<AiNodeResource> resources;

    private Integer sortOrder;
}
