package com.personalsite.blog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.personalsite.blog.dto.request.BookRequest;
import com.personalsite.blog.entity.Book;
import com.personalsite.blog.exception.BizException;
import com.personalsite.blog.exception.ErrorCode;
import com.personalsite.blog.mapper.BookMapper;
import com.personalsite.blog.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookMapper bookMapper;

    private static final Map<String, Integer> STATUS_ORDER = Map.of(
            "reading", 0,
            "want", 1,
            "done", 2
    );

    @Override
    public List<Book> listAll() {
        List<Book> books = bookMapper.selectList(
                new LambdaQueryWrapper<Book>().orderByDesc(Book::getCreatedAt));
        books.sort(Comparator.comparingInt(b -> STATUS_ORDER.getOrDefault(b.getStatus(), 99)));
        return books;
    }

    @Override
    public Book create(BookRequest req) {
        Book book = new Book();
        applyRequest(book, req);
        bookMapper.insert(book);
        return book;
    }

    @Override
    public Book update(Long id, BookRequest req) {
        Book book = bookMapper.selectById(id);
        if (book == null) throw new BizException(ErrorCode.NOT_FOUND);
        applyRequest(book, req);
        bookMapper.updateById(book);
        return book;
    }

    @Override
    public void delete(Long id) {
        if (bookMapper.selectById(id) == null) throw new BizException(ErrorCode.NOT_FOUND);
        bookMapper.deleteById(id);
    }

    private void applyRequest(Book book, BookRequest req) {
        book.setTitle(req.getTitle());
        book.setAuthor(req.getAuthor());
        book.setCover(req.getCover());
        book.setStatus(req.getStatus() != null ? req.getStatus() : "want");
        book.setRating(req.getRating());
        book.setReview(req.getReview());
        book.setCategory(req.getCategory());
        book.setTotalPages(req.getTotalPages());
        book.setReadPages(req.getReadPages());
        book.setStartedAt(req.getStartedAt());
        book.setFinishedAt(req.getFinishedAt());
    }
}
