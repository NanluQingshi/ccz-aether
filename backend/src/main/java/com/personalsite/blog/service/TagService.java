package com.personalsite.blog.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.personalsite.blog.dto.request.TagRequest;
import com.personalsite.blog.dto.response.TagVO;
import com.personalsite.blog.entity.Tag;
import com.personalsite.blog.exception.BizException;
import com.personalsite.blog.exception.ErrorCode;
import com.personalsite.blog.mapper.TagMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagMapper tagMapper;

    public List<TagVO> listAll() {
        return tagMapper.selectWithPostCount();
    }

    public Tag create(TagRequest request) {
        String slug = request.getSlug() != null ? request.getSlug() : toSlug(request.getName());
        if (tagMapper.selectCount(new LambdaQueryWrapper<Tag>().eq(Tag::getSlug, slug)) > 0) {
            throw new BizException(ErrorCode.SLUG_ALREADY_EXISTS);
        }
        Tag tag = new Tag();
        tag.setName(request.getName());
        tag.setSlug(slug);
        tagMapper.insert(tag);
        return tag;
    }

    public void delete(Long id) {
        if (tagMapper.selectById(id) == null) {
            throw new BizException(ErrorCode.TAG_NOT_FOUND);
        }
        tagMapper.deleteById(id);
    }

    private String toSlug(String name) {
        return name.toLowerCase().replaceAll("[^a-z0-9\\u4e00-\\u9fa5]+", "-").replaceAll("^-|-$", "");
    }
}
