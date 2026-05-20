package com.personalsite.blog.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

@Data
public class TagVO {
    private Long id;
    private String name;
    private String slug;
    private Long postCount;
    /** 批量查询时用于归并，不序列化到 API 响应 */
    @JsonIgnore
    private Long postId;
}
