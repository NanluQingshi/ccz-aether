package com.personalsite.blog.controller;

import com.personalsite.blog.dto.request.RoadmapItemRequest;
import com.personalsite.blog.dto.response.ApiResponse;
import com.personalsite.blog.entity.RoadmapItem;
import com.personalsite.blog.service.RoadmapItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roadmap")
@RequiredArgsConstructor
public class RoadmapController {

    private final RoadmapItemService roadmapItemService;

    @GetMapping
    public ApiResponse<List<RoadmapItem>> list() {
        return ApiResponse.ok(roadmapItemService.listAll());
    }

    @PostMapping
    public ApiResponse<RoadmapItem> create(@Valid @RequestBody RoadmapItemRequest req) {
        return ApiResponse.ok(roadmapItemService.create(req));
    }

    @PutMapping("/{id}")
    public ApiResponse<RoadmapItem> update(@PathVariable Long id, @Valid @RequestBody RoadmapItemRequest req) {
        return ApiResponse.ok(roadmapItemService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        roadmapItemService.delete(id);
        return ApiResponse.ok();
    }
}
