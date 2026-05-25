package com.personalsite.blog.controller;

import com.personalsite.blog.dto.request.IssueRequest;
import com.personalsite.blog.dto.response.ApiResponse;
import com.personalsite.blog.entity.Issue;
import com.personalsite.blog.service.CrudService;
import com.personalsite.blog.service.IssueService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
public class IssueController extends BaseCrudController<Issue, IssueRequest> {

    private final IssueService issueService;

    @Override
    protected CrudService<Issue, IssueRequest> getService() {
        return issueService;
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<Issue> updateStatus(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        return ApiResponse.ok(issueService.updateStatus(id, body.get("status")));
    }
}
