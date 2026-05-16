package com.personalsite.blog.controller;

import com.personalsite.blog.dto.request.BookRequest;
import com.personalsite.blog.dto.response.ApiResponse;
import com.personalsite.blog.entity.Book;
import com.personalsite.blog.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public ApiResponse<List<Book>> list() {
        return ApiResponse.ok(bookService.listAll());
    }

    @PostMapping
    public ApiResponse<Book> create(@Valid @RequestBody BookRequest req) {
        return ApiResponse.ok(bookService.create(req));
    }

    @PutMapping("/{id}")
    public ApiResponse<Book> update(@PathVariable Long id, @Valid @RequestBody BookRequest req) {
        return ApiResponse.ok(bookService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        bookService.delete(id);
        return ApiResponse.ok();
    }
}
