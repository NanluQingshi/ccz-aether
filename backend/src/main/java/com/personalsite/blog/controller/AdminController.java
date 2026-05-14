package com.personalsite.blog.controller;

import com.personalsite.blog.dto.request.CategoryRequest;
import com.personalsite.blog.dto.request.PostCreateRequest;
import com.personalsite.blog.dto.request.PostUpdateRequest;
import com.personalsite.blog.dto.request.TagRequest;
import com.personalsite.blog.dto.response.*;
import com.personalsite.blog.entity.Category;
import com.personalsite.blog.entity.Tag;
import com.personalsite.blog.service.CategoryService;
import com.personalsite.blog.service.PostService;
import com.personalsite.blog.service.TagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final PostService postService;
    private final TagService tagService;
    private final CategoryService categoryService;

    // ===== Posts =====

    @GetMapping("/posts")
    public ApiResponse<PageResult<PostVO>> adminPosts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(postService.adminListAll(page, size));
    }

    @PostMapping("/posts")
    public ApiResponse<PostDetailVO> createPost(@Valid @RequestBody PostCreateRequest request) {
        return ApiResponse.ok(postService.create(request));
    }

    @PutMapping("/posts/{id}")
    public ApiResponse<PostDetailVO> updatePost(@PathVariable Long id,
                                                 @Valid @RequestBody PostUpdateRequest request) {
        return ApiResponse.ok(postService.update(id, request));
    }

    @DeleteMapping("/posts/{id}")
    public ApiResponse<Void> deletePost(@PathVariable Long id) {
        postService.delete(id);
        return ApiResponse.ok();
    }

    @PatchMapping("/posts/{id}/publish")
    public ApiResponse<PostVO> togglePublish(@PathVariable Long id) {
        return ApiResponse.ok(postService.togglePublish(id));
    }

    // ===== Tags =====

    @PostMapping("/tags")
    public ApiResponse<Tag> createTag(@Valid @RequestBody TagRequest request) {
        return ApiResponse.ok(tagService.create(request));
    }

    @DeleteMapping("/tags/{id}")
    public ApiResponse<Void> deleteTag(@PathVariable Long id) {
        tagService.delete(id);
        return ApiResponse.ok();
    }

    // ===== Categories =====

    @PostMapping("/categories")
    public ApiResponse<Category> createCategory(@Valid @RequestBody CategoryRequest request) {
        return ApiResponse.ok(categoryService.create(request));
    }

    @DeleteMapping("/categories/{id}")
    public ApiResponse<Void> deleteCategory(@PathVariable Long id) {
        categoryService.delete(id);
        return ApiResponse.ok();
    }

    // ===== Stats =====

    @GetMapping("/stats")
    public ApiResponse<StatsVO> stats() {
        return ApiResponse.ok(postService.getStats());
    }

    @GetMapping("/charts")
    public ApiResponse<ChartVO> charts() {
        return ApiResponse.ok(postService.getChartData());
    }
}
