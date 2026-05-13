package com.personalsite.blog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.personalsite.blog.entity.Category;
import com.personalsite.blog.dto.response.CategoryVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CategoryMapper extends BaseMapper<Category> {

    List<CategoryVO> selectWithPostCount();
}
