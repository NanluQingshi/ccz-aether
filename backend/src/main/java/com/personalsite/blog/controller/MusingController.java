package com.personalsite.blog.controller;

import com.personalsite.blog.dto.request.MusingRequest;
import com.personalsite.blog.dto.response.ApiResponse;
import com.personalsite.blog.entity.Musing;
import com.personalsite.blog.service.CrudService;
import com.personalsite.blog.service.MusingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/musings")
@RequiredArgsConstructor
public class MusingController extends BaseCrudController<Musing, MusingRequest> {

    private final MusingService musingService;

    @Override
    protected CrudService<Musing, MusingRequest> getService() {
        return musingService;
    }

    @PatchMapping("/{id}/toggle")
    public ApiResponse<Musing> toggleDone(@PathVariable Long id) {
        return ApiResponse.ok(musingService.toggleDone(id));
    }
}
