package com.personalsite.blog.service.impl;

import com.personalsite.blog.dto.request.IssueRequest;
import com.personalsite.blog.entity.Issue;
import com.personalsite.blog.enums.IssueStatus;
import com.personalsite.blog.exception.BizException;
import com.personalsite.blog.exception.ErrorCode;
import com.personalsite.blog.mapper.IssueMapper;
import com.personalsite.blog.service.IssueService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IssueServiceImpl implements IssueService {

    private final IssueMapper issueMapper;

    @Override
    public List<Issue> listAll() {
        return issueMapper.selectList(null);
    }

    @Override
    public Issue create(IssueRequest req) {
        Issue issue = new Issue();
        issue.setTitle(req.getTitle());
        issue.setDescription(req.getDescription());
        issue.setPriority(req.getPriority());
        issue.setStatus(IssueStatus.TODO);
        issueMapper.insert(issue);
        return issue;
    }

    @Override
    public Issue update(Long id, IssueRequest req) {
        Issue issue = issueMapper.selectById(id);
        if (issue == null) throw new BizException(ErrorCode.NOT_FOUND);
        issue.setTitle(req.getTitle());
        issue.setDescription(req.getDescription());
        issue.setPriority(req.getPriority());
        issueMapper.updateById(issue);
        return issue;
    }

    @Override
    public Issue updateStatus(Long id, Integer status) {
        Issue issue = issueMapper.selectById(id);
        if (issue == null) throw new BizException(ErrorCode.NOT_FOUND);
        issue.setStatus(IssueStatus.fromCode(status));
        issueMapper.updateById(issue);
        return issue;
    }

    @Override
    public void delete(Long id) {
        issueMapper.deleteById(id);
    }
}
