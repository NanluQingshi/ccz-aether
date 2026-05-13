package com.personalsite.blog.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.personalsite.blog.dto.request.CategoryRequest;
import com.personalsite.blog.dto.response.CategoryVO;
import com.personalsite.blog.entity.Category;
import com.personalsite.blog.exception.BizException;
import com.personalsite.blog.exception.ErrorCode;
import com.personalsite.blog.mapper.CategoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryMapper categoryMapper;

    public List<CategoryVO> listAll() {
        return categoryMapper.selectWithPostCount();
    }

    public Category create(CategoryRequest request) {
        String slug = request.getSlug() != null ? request.getSlug() : toSlug(request.getName());
        if (categoryMapper.selectCount(new LambdaQueryWrapper<Category>().eq(Category::getSlug, slug)) > 0) {
            throw new BizException(ErrorCode.SLUG_ALREADY_EXISTS);
        }
        Category category = new Category();
        category.setName(request.getName());
        category.setSlug(slug);
        category.setDescription(request.getDescription());
        categoryMapper.insert(category);
        return category;
    }

    public void delete(Long id) {
        if (categoryMapper.selectById(id) == null) {
            throw new BizException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        categoryMapper.deleteById(id);
    }

    private String toSlug(String name) {
        return name.toLowerCase().replaceAll("[^a-z0-9\\u4e00-\\u9fa5]+", "-").replaceAll("^-|-$", "");
    }
}
