package com.personalsite.blog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.personalsite.blog.dto.request.AiNodeRequest;
import com.personalsite.blog.entity.AiNode;
import com.personalsite.blog.enums.AiNodeStatus;
import com.personalsite.blog.exception.BizException;
import com.personalsite.blog.exception.ErrorCode;
import com.personalsite.blog.mapper.AiNodeMapper;
import com.personalsite.blog.service.AiNodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiNodeServiceImpl implements AiNodeService {

    private final AiNodeMapper aiNodeMapper;

    @Override
    public List<AiNode> listAll() {
        return aiNodeMapper.selectList(
                new LambdaQueryWrapper<AiNode>()
                        .orderByAsc(AiNode::getSortOrder));
    }

    @Override
    public AiNode create(AiNodeRequest req) {
        AiNode node = new AiNode();
        copyFields(node, req);
        aiNodeMapper.insert(node);
        return node;
    }

    @Override
    public AiNode update(Long id, AiNodeRequest req) {
        AiNode node = aiNodeMapper.selectById(id);
        if (node == null) throw new BizException(ErrorCode.NOT_FOUND);
        copyFields(node, req);
        aiNodeMapper.updateById(node);
        return node;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (aiNodeMapper.selectById(id) == null) throw new BizException(ErrorCode.NOT_FOUND);
        deleteSubtree(id);
    }

    /** 递归删除以 rootId 为根的整棵子树 */
    private void deleteSubtree(Long rootId) {
        List<Long> childIds = aiNodeMapper.selectList(
                        new LambdaQueryWrapper<AiNode>()
                                .eq(AiNode::getParentId, rootId)
                                .select(AiNode::getId))
                .stream()
                .map(AiNode::getId)
                .collect(Collectors.toList());

        for (Long childId : childIds) {
            deleteSubtree(childId);
        }
        aiNodeMapper.deleteById(rootId);
    }

    private void copyFields(AiNode node, AiNodeRequest req) {
        node.setTitle(req.getTitle());
        node.setDescription(req.getDescription());
        node.setIcon(req.getIcon());
        node.setStatus(req.getStatus() != null ? req.getStatus() : AiNodeStatus.NOT_STARTED);
        node.setParentId(req.getParentId());
        node.setResources(req.getResources() != null ? req.getResources() : Collections.emptyList());
        node.setSortOrder(req.getSortOrder() != null ? req.getSortOrder() : 0);
    }
}
