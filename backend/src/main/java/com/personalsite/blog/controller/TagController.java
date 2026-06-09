package com.personalsite.blog.controller;

import com.personalsite.blog.dto.response.ApiResponse;
import com.personalsite.blog.dto.response.TagVO;
import com.personalsite.blog.service.TagService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @GetMapping
    public ApiResponse<List<TagVO>> list(HttpServletResponse response) {
        response.setHeader("Cache-Control", "public, max-age=600, stale-while-revalidate=3600");
        return ApiResponse.ok(tagService.listAll());
    }
}
