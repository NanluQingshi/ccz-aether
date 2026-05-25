package com.personalsite.blog.controller;

import com.personalsite.blog.dto.response.ApiResponse;
import com.personalsite.blog.service.CrudService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public abstract class BaseCrudController<T, Req> {

    protected abstract CrudService<T, Req> getService();

    @GetMapping
    public ApiResponse<List<T>> list() {
        return ApiResponse.ok(getService().listAll());
    }

    @PostMapping
    public ApiResponse<T> create(@Valid @RequestBody Req req) {
        return ApiResponse.ok(getService().create(req));
    }

    @PutMapping("/{id}")
    public ApiResponse<T> update(@PathVariable Long id, @Valid @RequestBody Req req) {
        return ApiResponse.ok(getService().update(id, req));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        getService().delete(id);
        return ApiResponse.ok();
    }
}
