package com.personalsite.blog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.personalsite.blog.entity.PostTag;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PostTagMapper extends BaseMapper<PostTag> {

    @Delete("DELETE FROM post_tag WHERE post_id = #{postId}")
    void deleteByPostId(Long postId);

    @Insert({
        "<script>",
        "INSERT IGNORE INTO post_tag (post_id, tag_id) VALUES",
        "<foreach collection='list' item='pt' separator=','>",
        "(#{pt.postId}, #{pt.tagId})",
        "</foreach>",
        "</script>"
    })
    void insertBatch(@Param("list") List<PostTag> list);
}
