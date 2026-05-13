package com.personalsite.blog.dto.response;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostVO {
    private Long id;
    private String title;
    private String slug;
    private String summary;
    private String coverImage;
    private String type;
    private LocalDate eventDate;
    private Integer status;
    private Integer viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime publishedAt;
    private CategoryVO category;
    private List<TagVO> tags;
}
