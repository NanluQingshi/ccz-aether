package com.personalsite.blog.service;

import com.personalsite.blog.dto.request.CategoryRequest;
import com.personalsite.blog.dto.response.CategoryVO;
import com.personalsite.blog.entity.Category;

import java.util.List;

public interface CategoryService {

    List<CategoryVO> listAll();

    Category create(CategoryRequest request);

    void delete(Long id);
}
