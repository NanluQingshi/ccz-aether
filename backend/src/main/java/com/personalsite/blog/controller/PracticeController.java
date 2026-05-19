package com.personalsite.blog.controller;

import com.personalsite.blog.dto.request.PracticeRequest;
import com.personalsite.blog.dto.response.ApiResponse;
import com.personalsite.blog.entity.Practice;
import com.personalsite.blog.service.PracticeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/practice")
@RequiredArgsConstructor
public class PracticeController {

    private final PracticeService practiceService;

    @GetMapping
    public ApiResponse<List<Practice>> list() {
        return ApiResponse.ok(practiceService.listAll());
    }

    @PostMapping
    public ApiResponse<Practice> create(@Valid @RequestBody PracticeRequest req) {
        return ApiResponse.ok(practiceService.create(req));
    }

    @PutMapping("/{id}")
    public ApiResponse<Practice> update(@PathVariable Long id,
                                        @Valid @RequestBody PracticeRequest req) {
        return ApiResponse.ok(practiceService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        practiceService.delete(id);
        return ApiResponse.ok();
    }
}
