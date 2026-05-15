package com.personalsite.blog.controller;

import com.personalsite.blog.dto.request.IssueRequest;
import com.personalsite.blog.dto.response.ApiResponse;
import com.personalsite.blog.entity.Issue;
import com.personalsite.blog.service.IssueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
public class IssueController {

    private final IssueService issueService;

    @GetMapping
    public ApiResponse<List<Issue>> list() {
        return ApiResponse.ok(issueService.listAll());
    }

    @PostMapping
    public ApiResponse<Issue> create(@Valid @RequestBody IssueRequest req) {
        return ApiResponse.ok(issueService.create(req));
    }

    @PutMapping("/{id}")
    public ApiResponse<Issue> update(@PathVariable Long id, @Valid @RequestBody IssueRequest req) {
        return ApiResponse.ok(issueService.update(id, req));
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<Issue> updateStatus(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        return ApiResponse.ok(issueService.updateStatus(id, body.get("status")));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        issueService.delete(id);
        return ApiResponse.ok();
    }
}
