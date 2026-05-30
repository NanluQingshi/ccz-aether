package com.personalsite.blog.converter;

import com.personalsite.blog.dto.response.PostDetailVO;
import com.personalsite.blog.dto.response.PostVO;
import com.personalsite.blog.dto.response.TagVO;
import com.personalsite.blog.entity.Category;
import com.personalsite.blog.entity.Post;

import java.util.Collections;
import java.util.List;

public final class PostConverter {

    public static PostVO toVO(Post post, Category category, List<TagVO> tags) {
        PostVO vo = new PostVO();
        vo.setId(post.getId());
        vo.setTitle(post.getTitle());
        vo.setSlug(post.getSlug());
        vo.setSummary(post.getSummary());
        vo.setCoverImage(post.getCoverImage());
        vo.setType(post.getType() != null ? post.getType().getCode() : null);
        vo.setEventDate(post.getEventDate());
        vo.setStatus(post.getStatus() != null ? post.getStatus().getCode() : null);
        vo.setViewCount(post.getViewCount());
        vo.setCreatedAt(post.getCreatedAt());
        vo.setPublishedAt(post.getPublishedAt());
        vo.setCategory(CategoryConverter.toVO(category));
        vo.setTags(tags != null ? tags : Collections.emptyList());
        return vo;
    }

    public static PostDetailVO toDetailVO(Post post, Category category, List<TagVO> tags) {
        PostDetailVO vo = new PostDetailVO();
        vo.setId(post.getId());
        vo.setTitle(post.getTitle());
        vo.setSlug(post.getSlug());
        vo.setSummary(post.getSummary());
        vo.setContent(post.getContent());
        vo.setCoverImage(post.getCoverImage());
        vo.setType(post.getType() != null ? post.getType().getCode() : null);
        vo.setEventDate(post.getEventDate());
        vo.setStatus(post.getStatus() != null ? post.getStatus().getCode() : null);
        vo.setViewCount(post.getViewCount());
        vo.setCreatedAt(post.getCreatedAt());
        vo.setUpdatedAt(post.getUpdatedAt());
        vo.setPublishedAt(post.getPublishedAt());
        vo.setCategory(CategoryConverter.toVO(category));
        vo.setTags(tags != null ? tags : Collections.emptyList());
        return vo;
    }

    private PostConverter() {}
}
