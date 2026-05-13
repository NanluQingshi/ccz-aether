package com.personalsite.blog.controller;

import com.personalsite.blog.dto.response.ApiResponse;
import com.personalsite.blog.dto.response.PageResult;
import com.personalsite.blog.dto.response.PostDetailVO;
import com.personalsite.blog.dto.response.PostVO;
import com.personalsite.blog.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public ApiResponse<PageResult<PostVO>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String tagSlug,
            @RequestParam(required = false) String categorySlug,
            @RequestParam(required = false) String keyword) {
        return ApiResponse.ok(postService.listPublished(page, size, tagSlug, categorySlug, keyword));
    }

    @GetMapping("/ai-timeline")
    public ApiResponse<List<PostVO>> aiTimeline() {
        return ApiResponse.ok(postService.listAiTimeline());
    }

    @GetMapping("/{slug}")
    public ApiResponse<PostDetailVO> detail(@PathVariable String slug) {
        return ApiResponse.ok(postService.getBySlug(slug));
    }
}
