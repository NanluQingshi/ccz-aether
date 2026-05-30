package com.personalsite.blog.controller;

import com.personalsite.blog.dto.request.AiNodeRequest;
import com.personalsite.blog.dto.response.ApiResponse;
import com.personalsite.blog.entity.AiNode;
import com.personalsite.blog.service.AiNodeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai-nodes")
@RequiredArgsConstructor
public class AiNodeController {

    private final AiNodeService aiNodeService;

    @GetMapping
    public ApiResponse<List<AiNode>> list() {
        return ApiResponse.ok(aiNodeService.listAll());
    }

    @PostMapping
    public ApiResponse<AiNode> create(@Valid @RequestBody AiNodeRequest req) {
        return ApiResponse.ok(aiNodeService.create(req));
    }

    @PutMapping("/{id}")
    public ApiResponse<AiNode> update(@PathVariable Long id,
                                      @Valid @RequestBody AiNodeRequest req) {
        return ApiResponse.ok(aiNodeService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        aiNodeService.delete(id);
        return ApiResponse.ok();
    }
}
