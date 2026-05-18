package com.personalsite.blog.service;

import com.personalsite.blog.dto.request.RoadmapItemRequest;
import com.personalsite.blog.entity.RoadmapItem;

import java.util.List;

public interface RoadmapItemService {
    List<RoadmapItem> listAll();
    RoadmapItem create(RoadmapItemRequest req);
    RoadmapItem update(Long id, RoadmapItemRequest req);
    void delete(Long id);
}
