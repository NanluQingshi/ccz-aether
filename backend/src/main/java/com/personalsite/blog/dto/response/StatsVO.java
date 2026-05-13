package com.personalsite.blog.dto.response;

import lombok.Data;

@Data
public class StatsVO {
    private long totalPosts;
    private long publishedPosts;
    private long draftPosts;
    private long totalViews;
    private long totalTags;
    private long totalCategories;
}
