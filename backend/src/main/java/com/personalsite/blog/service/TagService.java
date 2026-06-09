package com.personalsite.blog.service;

import com.personalsite.blog.dto.request.TagRequest;
import com.personalsite.blog.dto.response.TagVO;
import com.personalsite.blog.entity.Tag;

import java.util.List;

public interface TagService {

    List<TagVO> listAll();

    Tag create(TagRequest request);

    Tag update(Long id, TagRequest request);

    void delete(Long id);
}
