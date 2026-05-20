package com.personalsite.blog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.personalsite.blog.dto.request.PracticeRequest;
import com.personalsite.blog.entity.Practice;
import com.personalsite.blog.exception.BizException;
import com.personalsite.blog.exception.ErrorCode;
import com.personalsite.blog.mapper.PracticeMapper;
import com.personalsite.blog.service.PracticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PracticeServiceImpl implements PracticeService {

    private final PracticeMapper practiceMapper;

    @Override
    public List<Practice> listAll() {
        return practiceMapper.selectList(
                new LambdaQueryWrapper<Practice>()
                        .orderByAsc(Practice::getCategory)
                        .orderByAsc(Practice::getSortOrder));
    }

    @Override
    public Practice create(PracticeRequest req) {
        Practice practice = new Practice();
        practice.setCategory(req.getCategory());
        practice.setCategoryIcon(req.getCategoryIcon());
        practice.setName(req.getName());
        practice.setDescription(req.getDescription());
        practice.setLinks(req.getLinks() != null ? req.getLinks() : Collections.emptyList());
        practice.setStatus(req.getStatus() != null ? req.getStatus() : "todo");
        practice.setSortOrder(req.getSortOrder() != null ? req.getSortOrder() : 0);
        practiceMapper.insert(practice);
        return practice;
    }

    @Override
    public Practice update(Long id, PracticeRequest req) {
        Practice practice = practiceMapper.selectById(id);
        if (practice == null) throw new BizException(ErrorCode.NOT_FOUND);
        practice.setCategory(req.getCategory());
        practice.setCategoryIcon(req.getCategoryIcon());
        practice.setName(req.getName());
        practice.setDescription(req.getDescription());
        practice.setLinks(req.getLinks() != null ? req.getLinks() : Collections.emptyList());
        if (req.getStatus() != null) practice.setStatus(req.getStatus());
        if (req.getSortOrder() != null) practice.setSortOrder(req.getSortOrder());
        practiceMapper.updateById(practice);
        return practice;
    }

    @Override
    public void delete(Long id) {
        if (practiceMapper.selectById(id) == null) throw new BizException(ErrorCode.NOT_FOUND);
        practiceMapper.deleteById(id);
    }
}
