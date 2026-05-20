package com.personalsite.blog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.personalsite.blog.entity.Post;
import com.personalsite.blog.dto.response.ChartVO;
import com.personalsite.blog.dto.response.PostVO;
import com.personalsite.blog.dto.response.StatsVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface PostMapper extends BaseMapper<Post> {

    @Update("UPDATE post SET view_count = view_count + 1 WHERE id = #{id}")
    void incrementViewCount(Long id);

    IPage<PostVO> selectPublishedPage(Page<PostVO> page,
                                      @Param("tagSlug") String tagSlug,
                                      @Param("categorySlug") String categorySlug,
                                      @Param("keyword") String keyword);

    List<PostVO> selectAiTimeline();

    List<ChartVO.MonthStat> selectMonthlyTrend();

    List<ChartVO.NameValue> selectCategoryStats();

    List<ChartVO.NameValue> selectTagStats();

    StatsVO selectStats();
}
