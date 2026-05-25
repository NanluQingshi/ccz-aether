package com.personalsite.blog.controller;

import com.personalsite.blog.dto.request.BookRequest;
import com.personalsite.blog.entity.Book;
import com.personalsite.blog.service.BookService;
import com.personalsite.blog.service.CrudService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController extends BaseCrudController<Book, BookRequest> {

    private final BookService bookService;

    @Override
    protected CrudService<Book, BookRequest> getService() {
        return bookService;
    }
}
