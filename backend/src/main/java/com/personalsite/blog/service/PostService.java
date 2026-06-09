package com.personalsite.blog.service;

import com.personalsite.blog.dto.request.PostCreateRequest;
import com.personalsite.blog.dto.request.PostUpdateRequest;
import com.personalsite.blog.dto.response.*;

import java.util.List;

public interface PostService {

    PageResult<PostVO> listPublished(int page, int size, String tagSlug, String categorySlug, String keyword);

    PostDetailVO getBySlug(String slug);

    List<PostVO> listAiTimeline();

    PageResult<PostVO> adminListAll(int page, int size, String keyword, Long categoryId);

    PostDetailVO adminGetById(Long id);

    PostDetailVO create(PostCreateRequest req);

    PostDetailVO update(Long id, PostUpdateRequest req);

    void delete(Long id);

    PostVO togglePublish(Long id);

    StatsVO getStats();

    ChartVO getChartData();
}
