package com.personalsite.blog.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("book")
public class Book extends BaseEntity {
    private String title;
    private String author;
    private String cover;
    // want | reading | done
    private String status;
    // 1-5
    private Integer rating;
    private String review;
    private String category;
    private Integer totalPages;
    private Integer readPages;
    private LocalDate startedAt;
    private LocalDate finishedAt;
}
