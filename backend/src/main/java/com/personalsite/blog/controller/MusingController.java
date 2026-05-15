package com.personalsite.blog.controller;

import com.personalsite.blog.dto.request.MusingRequest;
import com.personalsite.blog.dto.response.ApiResponse;
import com.personalsite.blog.entity.Musing;
import com.personalsite.blog.service.MusingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/musings")
@RequiredArgsConstructor
public class MusingController {

    private final MusingService musingService;

    @GetMapping
    public ApiResponse<List<Musing>> list() {
        return ApiResponse.ok(musingService.listAll());
    }

    @PostMapping
    public ApiResponse<Musing> create(@Valid @RequestBody MusingRequest req) {
        return ApiResponse.ok(musingService.create(req));
    }

    @PutMapping("/{id}")
    public ApiResponse<Musing> update(@PathVariable Long id, @Valid @RequestBody MusingRequest req) {
        return ApiResponse.ok(musingService.update(id, req));
    }

    @PatchMapping("/{id}/toggle")
    public ApiResponse<Musing> toggleDone(@PathVariable Long id) {
        return ApiResponse.ok(musingService.toggleDone(id));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        musingService.delete(id);
        return ApiResponse.ok();
    }
}
