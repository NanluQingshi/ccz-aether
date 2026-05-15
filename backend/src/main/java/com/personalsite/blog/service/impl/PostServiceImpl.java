package com.personalsite.blog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.personalsite.blog.converter.PostConverter;
import com.personalsite.blog.dto.request.PostCreateRequest;
import com.personalsite.blog.dto.request.PostUpdateRequest;
import com.personalsite.blog.dto.response.*;
import com.personalsite.blog.entity.Category;
import com.personalsite.blog.entity.Post;
import com.personalsite.blog.entity.PostTag;
import com.personalsite.blog.exception.BizException;
import com.personalsite.blog.exception.ErrorCode;
import com.personalsite.blog.mapper.CategoryMapper;
import com.personalsite.blog.mapper.PostMapper;
import com.personalsite.blog.mapper.PostTagMapper;
import com.personalsite.blog.mapper.TagMapper;
import com.personalsite.blog.service.PostService;
import com.personalsite.blog.util.SlugUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostMapper postMapper;
    private final PostTagMapper postTagMapper;
    private final TagMapper tagMapper;
    private final CategoryMapper categoryMapper;

    @Override
    public PageResult<PostVO> listPublished(int page, int size, String tagSlug, String categorySlug, String keyword) {
        Page<PostVO> pageParam = new Page<>(page, size);
        postMapper.selectPublishedPage(pageParam,
                blankToNull(tagSlug), blankToNull(categorySlug), blankToNull(keyword));
        pageParam.getRecords().forEach(vo -> {
            List<TagVO> tags = tagMapper.selectByPostId(vo.getId());
            vo.setTags(tags != null ? tags : Collections.emptyList());
        });
        return PageResult.of(pageParam);
    }

    @Override
    public PostDetailVO getBySlug(String slug) {
        Post post = postMapper.selectOne(
                new LambdaQueryWrapper<Post>().eq(Post::getSlug, slug).eq(Post::getStatus, 1));
        if (post == null) throw new BizException(ErrorCode.POST_NOT_FOUND);
        postMapper.incrementViewCount(post.getId());
        return buildDetailVO(post);
    }

    @Override
    public PageResult<PostVO> adminListAll(int page, int size) {
        Page<Post> pageParam = new Page<>(page, size);
        postMapper.selectPage(pageParam,
                new LambdaQueryWrapper<Post>().orderByDesc(Post::getCreatedAt));
        List<PostVO> vos = pageParam.getRecords().stream()
                .map(this::buildVO)
                .collect(Collectors.toList());
        Page<PostVO> result = new Page<>(pageParam.getCurrent(), pageParam.getSize(), pageParam.getTotal());
        result.setRecords(vos);
        return PageResult.of(result);
    }

    @Override
    @Transactional
    public PostDetailVO create(PostCreateRequest req) {
        String slug = req.getSlug() != null && !req.getSlug().isBlank()
                ? req.getSlug() : SlugUtils.toSlug(req.getTitle());
        checkSlugUnique(slug, null);
        Post post = new Post();
        post.setTitle(req.getTitle());
        post.setSlug(slug);
        post.setSummary(req.getSummary());
        post.setContent(req.getContent());
        post.setCoverImage(req.getCoverImage());
        post.setType(req.getType() != null ? req.getType() : "blog");
        post.setEventDate(req.getEventDate());
        post.setCategoryId(req.getCategoryId());
        post.setStatus(req.getStatus() != null ? req.getStatus() : 0);
        post.setViewCount(0);
        if (post.getStatus() == 1) post.setPublishedAt(LocalDateTime.now());
        postMapper.insert(post);
        savePostTags(post.getId(), req.getTagIds());
        return buildDetailVO(post);
    }

    @Override
    @Transactional
    public PostDetailVO update(Long id, PostUpdateRequest req) {
        Post post = postMapper.selectById(id);
        if (post == null) throw new BizException(ErrorCode.POST_NOT_FOUND);
        String slug = req.getSlug() != null && !req.getSlug().isBlank()
                ? req.getSlug() : SlugUtils.toSlug(req.getTitle());
        checkSlugUnique(slug, id);
        post.setTitle(req.getTitle());
        post.setSlug(slug);
        post.setSummary(req.getSummary());
        post.setContent(req.getContent());
        post.setCoverImage(req.getCoverImage());
        if (req.getType() != null) post.setType(req.getType());
        post.setEventDate(req.getEventDate());
        post.setCategoryId(req.getCategoryId());
        if (req.getStatus() != null) {
            if (req.getStatus() == 1 && post.getStatus() != 1) {
                post.setPublishedAt(LocalDateTime.now());
            }
            post.setStatus(req.getStatus());
        }
        postMapper.updateById(post);
        postTagMapper.deleteByPostId(id);
        savePostTags(id, req.getTagIds());
        return buildDetailVO(post);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (postMapper.selectById(id) == null) throw new BizException(ErrorCode.POST_NOT_FOUND);
        postMapper.deleteById(id);
        postTagMapper.deleteByPostId(id);
    }

    @Override
    @Transactional
    public PostVO togglePublish(Long id) {
        Post post = postMapper.selectById(id);
        if (post == null) throw new BizException(ErrorCode.POST_NOT_FOUND);
        if (post.getStatus() == 1) {
            post.setStatus(0);
        } else {
            post.setStatus(1);
            post.setPublishedAt(LocalDateTime.now());
        }
        postMapper.updateById(post);
        return buildVO(post);
    }

    @Override
    public ChartVO getChartData() {
        ChartVO chart = new ChartVO();
        chart.setMonthlyTrend(postMapper.selectMonthlyTrend());
        chart.setCategoryStats(postMapper.selectCategoryStats());
        chart.setTagStats(postMapper.selectTagStats());
        return chart;
    }

    @Override
    public StatsVO getStats() {
        StatsVO stats = new StatsVO();
        stats.setTotalPosts(postMapper.selectCount(new LambdaQueryWrapper<Post>()));
        stats.setPublishedPosts(postMapper.selectCount(new LambdaQueryWrapper<Post>().eq(Post::getStatus, 1)));
        stats.setDraftPosts(postMapper.selectCount(new LambdaQueryWrapper<Post>().eq(Post::getStatus, 0)));
        stats.setTotalViews(postMapper.selectList(new LambdaQueryWrapper<Post>())
                .stream().mapToLong(p -> p.getViewCount() == null ? 0 : p.getViewCount()).sum());
        stats.setTotalTags(tagMapper.selectCount(null));
        stats.setTotalCategories(categoryMapper.selectCount(null));
        return stats;
    }

    @Override
    public List<PostVO> listAiTimeline() {
        List<PostVO> list = postMapper.selectAiTimeline();
        list.forEach(vo -> {
            List<TagVO> tags = tagMapper.selectByPostId(vo.getId());
            vo.setTags(tags != null ? tags : Collections.emptyList());
        });
        return list;
    }

    private PostVO buildVO(Post post) {
        Category category = post.getCategoryId() != null
                ? categoryMapper.selectById(post.getCategoryId()) : null;
        List<TagVO> tags = tagMapper.selectByPostId(post.getId());
        return PostConverter.toVO(post, category, tags);
    }

    private PostDetailVO buildDetailVO(Post post) {
        Category category = post.getCategoryId() != null
                ? categoryMapper.selectById(post.getCategoryId()) : null;
        List<TagVO> tags = tagMapper.selectByPostId(post.getId());
        return PostConverter.toDetailVO(post, category, tags);
    }

    private void savePostTags(Long postId, List<Long> tagIds) {
        if (tagIds == null || tagIds.isEmpty()) return;
        tagIds.forEach(tagId -> postTagMapper.insert(new PostTag(postId, tagId)));
    }

    private void checkSlugUnique(String slug, Long excludeId) {
        LambdaQueryWrapper<Post> wrapper = new LambdaQueryWrapper<Post>().eq(Post::getSlug, slug);
        if (excludeId != null) wrapper.ne(Post::getId, excludeId);
        if (postMapper.selectCount(wrapper) > 0) throw new BizException(ErrorCode.SLUG_ALREADY_EXISTS);
    }

    private String blankToNull(String s) {
        return (s == null || s.isBlank()) ? null : s;
    }
}
