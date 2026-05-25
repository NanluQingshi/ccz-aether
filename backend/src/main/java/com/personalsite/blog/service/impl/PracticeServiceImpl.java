package com.personalsite.blog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.personalsite.blog.dto.request.PracticeRequest;
import com.personalsite.blog.entity.Practice;
import com.personalsite.blog.mapper.PracticeMapper;
import com.personalsite.blog.service.PracticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PracticeServiceImpl extends BaseCrudService<Practice, PracticeRequest> implements PracticeService {

    private final PracticeMapper practiceMapper;

    @Override
    public List<Practice> listAll() {
        return practiceMapper.selectList(
                new LambdaQueryWrapper<Practice>()
                        .orderByAsc(Practice::getCategory)
                        .orderByAsc(Practice::getSortOrder));
    }

    @Override
    protected BaseMapper<Practice> getMapper() {
        return practiceMapper;
    }

    @Override
    protected Practice newEntity() {
        return new Practice();
    }

    @Override
    protected void applyRequest(Practice practice, PracticeRequest req) {
        practice.setCategory(req.getCategory());
        practice.setCategoryIcon(req.getCategoryIcon());
        practice.setName(req.getName());
        practice.setDescription(req.getDescription());
        practice.setLinks(req.getLinks() != null ? req.getLinks() : Collections.emptyList());
        if (req.getStatus() != null) practice.setStatus(req.getStatus());
        if (req.getSortOrder() != null) practice.setSortOrder(req.getSortOrder());
    }

    @Override
    protected void initEntity(Practice practice, PracticeRequest req) {
        if (practice.getStatus() == null) practice.setStatus("todo");
        if (practice.getSortOrder() == null) practice.setSortOrder(0);
    }
}
