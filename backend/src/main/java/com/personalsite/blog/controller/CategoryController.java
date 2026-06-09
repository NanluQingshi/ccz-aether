package com.personalsite.blog.controller;

import com.personalsite.blog.dto.response.ApiResponse;
import com.personalsite.blog.dto.response.CategoryVO;
import com.personalsite.blog.service.CategoryService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ApiResponse<List<CategoryVO>> list(HttpServletResponse response) {
        response.setHeader("Cache-Control", "public, max-age=600, stale-while-revalidate=3600");
        return ApiResponse.ok(categoryService.listAll());
    }
}
