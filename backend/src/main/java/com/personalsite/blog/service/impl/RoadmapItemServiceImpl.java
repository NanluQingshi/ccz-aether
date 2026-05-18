package com.personalsite.blog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.personalsite.blog.dto.request.RoadmapItemRequest;
import com.personalsite.blog.entity.RoadmapItem;
import com.personalsite.blog.exception.BizException;
import com.personalsite.blog.exception.ErrorCode;
import com.personalsite.blog.mapper.RoadmapItemMapper;
import com.personalsite.blog.service.RoadmapItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoadmapItemServiceImpl implements RoadmapItemService {

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
    public RoadmapItem create(RoadmapItemRequest req) {
        RoadmapItem item = new RoadmapItem();
        copyFields(item, req);
        roadmapItemMapper.insert(item);
        return item;
    }

    @Override
    public RoadmapItem update(Long id, RoadmapItemRequest req) {
        RoadmapItem item = roadmapItemMapper.selectById(id);
        if (item == null) throw new BizException(ErrorCode.NOT_FOUND);
        copyFields(item, req);
        roadmapItemMapper.updateById(item);
        return item;
    }

    @Override
    public void delete(Long id) {
        roadmapItemMapper.deleteById(id);
    }

    private void copyFields(RoadmapItem item, RoadmapItemRequest req) {
        item.setGroupLabel(req.getGroupLabel());
        item.setGroupIcon(req.getGroupIcon());
        item.setName(req.getName());
        item.setDescription(req.getDescription());
        item.setStatus(req.getStatus());
        item.setPriority(req.getPriority());
        item.setSortOrder(req.getSortOrder());
    }
}
