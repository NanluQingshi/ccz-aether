package com.personalsite.blog.controller;

import com.personalsite.blog.dto.request.SiteRequest;
import com.personalsite.blog.dto.response.ApiResponse;
import com.personalsite.blog.entity.Site;
import com.personalsite.blog.service.SiteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sites")
@RequiredArgsConstructor
public class SiteController {

    private final SiteService siteService;

    @GetMapping
    public ApiResponse<List<Site>> list() {
        return ApiResponse.ok(siteService.listAll());
    }

    @PostMapping
    public ApiResponse<Site> create(@Valid @RequestBody SiteRequest req) {
        return ApiResponse.ok(siteService.create(req));
    }

    @PutMapping("/{id}")
    public ApiResponse<Site> update(@PathVariable Long id, @Valid @RequestBody SiteRequest req) {
        return ApiResponse.ok(siteService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        siteService.delete(id);
        return ApiResponse.ok();
    }
}
