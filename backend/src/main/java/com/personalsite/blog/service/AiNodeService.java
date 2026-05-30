package com.personalsite.blog.service;

import com.personalsite.blog.dto.request.AiNodeRequest;
import com.personalsite.blog.entity.AiNode;

import java.util.List;

public interface AiNodeService {
    List<AiNode> listAll();
    AiNode create(AiNodeRequest req);
    AiNode update(Long id, AiNodeRequest req);
    void delete(Long id);
}
