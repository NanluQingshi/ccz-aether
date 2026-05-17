package com.personalsite.blog.service;

import com.personalsite.blog.dto.request.BookRequest;
import com.personalsite.blog.entity.Book;

import java.util.List;

public interface BookService {

    List<Book> listAll();

    Book create(BookRequest req);

    Book update(Long id, BookRequest req);

    void delete(Long id);
}
