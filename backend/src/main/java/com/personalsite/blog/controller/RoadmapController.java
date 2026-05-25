package com.personalsite.blog.controller;

import com.personalsite.blog.dto.request.RoadmapItemRequest;
import com.personalsite.blog.entity.RoadmapItem;
import com.personalsite.blog.service.CrudService;
import com.personalsite.blog.service.RoadmapItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/roadmap")
@RequiredArgsConstructor
public class RoadmapController extends BaseCrudController<RoadmapItem, RoadmapItemRequest> {

    private final RoadmapItemService roadmapItemService;

    @Override
    protected CrudService<RoadmapItem, RoadmapItemRequest> getService() {
        return roadmapItemService;
    }
}
