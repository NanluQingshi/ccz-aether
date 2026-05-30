package com.personalsite.blog.dto.request;

import com.personalsite.blog.enums.PostStatus;
import com.personalsite.blog.enums.PostType;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class PostCreateRequest {
    @NotBlank(message = "标题不能为空")
    private String title;
    private String slug;
    private String summary;
    @NotBlank(message = "内容不能为空")
    private String content;
    private String coverImage;
    private PostType type;
    private LocalDate eventDate;
    private Long categoryId;
    private List<Long> tagIds;
    private PostStatus status;
}
