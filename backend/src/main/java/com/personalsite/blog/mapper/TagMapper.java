package com.personalsite.blog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.personalsite.blog.entity.Tag;
import com.personalsite.blog.dto.response.TagVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TagMapper extends BaseMapper<Tag> {

    List<TagVO> selectWithPostCount();

    List<TagVO> selectByPostId(@Param("postId") Long postId);

    List<TagVO> selectByPostIds(@Param("postIds") List<Long> postIds);
}
