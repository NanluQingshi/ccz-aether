package com.personalsite.blog.service.impl;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.personalsite.blog.dto.request.IssueRequest;
import com.personalsite.blog.entity.Issue;
import com.personalsite.blog.exception.BizException;
import com.personalsite.blog.exception.ErrorCode;
import com.personalsite.blog.mapper.IssueMapper;
import com.personalsite.blog.service.IssueService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IssueServiceImpl extends BaseCrudService<Issue, IssueRequest> implements IssueService {

    private final IssueMapper issueMapper;

    @Override
    public List<Issue> listAll() {
        return issueMapper.selectList(null);
    }

    @Override
    protected BaseMapper<Issue> getMapper() {
        return issueMapper;
    }

    @Override
    protected Issue newEntity() {
        return new Issue();
    }

    @Override
    protected void applyRequest(Issue issue, IssueRequest req) {
        issue.setTitle(req.getTitle());
        issue.setDescription(req.getDescription());
        issue.setPriority(req.getPriority());
    }

    @Override
    protected void initEntity(Issue issue, IssueRequest req) {
        issue.setStatus(0);
    }

    @Override
    public Issue updateStatus(Long id, Integer status) {
        Issue issue = issueMapper.selectById(id);
        if (issue == null) throw new BizException(ErrorCode.NOT_FOUND);
        issue.setStatus(status);
        issueMapper.updateById(issue);
        return issue;
    }
}
