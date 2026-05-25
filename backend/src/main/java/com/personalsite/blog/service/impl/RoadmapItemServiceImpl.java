package com.personalsite.blog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.personalsite.blog.dto.request.RoadmapItemRequest;
import com.personalsite.blog.entity.RoadmapItem;
import com.personalsite.blog.mapper.RoadmapItemMapper;
import com.personalsite.blog.service.RoadmapItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoadmapItemServiceImpl extends BaseCrudService<RoadmapItem, RoadmapItemRequest> implements RoadmapItemService {

    private final RoadmapItemMapper roadmapItemMapper;

    @Override
    public List<RoadmapItem> listAll() {
        return roadmapItemMapper.selectList(
            new LambdaQueryWrapper<RoadmapItem>()
                .orderByAsc(RoadmapItem::getSortOrder)
                .orderByAsc(RoadmapItem::getCreatedAt)
        );
    }

    @Override
    protected BaseMapper<RoadmapItem> getMapper() {
        return roadmapItemMapper;
    }

    @Override
    protected RoadmapItem newEntity() {
        return new RoadmapItem();
    }

    @Override
    protected void applyRequest(RoadmapItem item, RoadmapItemRequest req) {
        item.setGroupLabel(req.getGroupLabel());
        item.setGroupIcon(req.getGroupIcon());
        item.setName(req.getName());
        item.setDescription(req.getDescription());
        item.setStatus(req.getStatus());
        item.setPriority(req.getPriority());
        item.setSortOrder(req.getSortOrder());
    }
}
