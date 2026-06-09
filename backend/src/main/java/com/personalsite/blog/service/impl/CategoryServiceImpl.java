package com.personalsite.blog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.personalsite.blog.dto.request.CategoryRequest;
import com.personalsite.blog.dto.response.CategoryVO;
import com.personalsite.blog.entity.Category;
import com.personalsite.blog.exception.BizException;
import com.personalsite.blog.exception.ErrorCode;
import com.personalsite.blog.mapper.CategoryMapper;
import com.personalsite.blog.service.CategoryService;
import com.personalsite.blog.util.SlugUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryMapper categoryMapper;

    @Override
    public List<CategoryVO> listAll() {
        return categoryMapper.selectWithPostCount();
    }

    @Override
    public Category create(CategoryRequest request) {
        String slug = request.getSlug() != null ? request.getSlug() : SlugUtils.toSlug(request.getName());
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

    @Override
    public Category update(Long id, CategoryRequest request) {
        Category category = categoryMapper.selectById(id);
        if (category == null) {
            throw new BizException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        String slug = request.getSlug() != null ? request.getSlug() : SlugUtils.toSlug(request.getName());
        if (categoryMapper.selectCount(
                new LambdaQueryWrapper<Category>().eq(Category::getSlug, slug).ne(Category::getId, id)) > 0) {
            throw new BizException(ErrorCode.SLUG_ALREADY_EXISTS);
        }
        category.setName(request.getName());
        category.setSlug(slug);
        category.setDescription(request.getDescription());
        categoryMapper.updateById(category);
        return category;
    }

    @Override
    public void delete(Long id) {
        if (categoryMapper.selectById(id) == null) {
            throw new BizException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        categoryMapper.deleteById(id);
    }
}
