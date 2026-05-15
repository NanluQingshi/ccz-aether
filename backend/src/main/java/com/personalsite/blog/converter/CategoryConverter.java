package com.personalsite.blog.converter;

import com.personalsite.blog.dto.response.CategoryVO;
import com.personalsite.blog.entity.Category;

public final class CategoryConverter {

    public static CategoryVO toVO(Category category) {
        if (category == null) return null;
        CategoryVO vo = new CategoryVO();
        vo.setId(category.getId());
        vo.setName(category.getName());
        vo.setSlug(category.getSlug());
        vo.setDescription(category.getDescription());
        return vo;
    }

    private CategoryConverter() {}
}
