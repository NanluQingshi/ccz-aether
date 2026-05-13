package com.personalsite.blog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.personalsite.blog.entity.PostTag;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PostTagMapper extends BaseMapper<PostTag> {

    @Delete("DELETE FROM post_tag WHERE post_id = #{postId}")
    void deleteByPostId(Long postId);
}
